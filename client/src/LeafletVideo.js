import 'leaflet/dist/leaflet.css';
import './LeafletVideo.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { FeatureGroup, LayerGroup} from 'react-leaflet';
import { LayersControl} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { Polygon, Circle, Polyline} from 'react-leaflet';
import Leaflet from 'leaflet'
import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';
import annotationsToJSON from './Util.js'


class LeafletVideo extends React.Component {

  annotations = []
  activeColor = undefined
  imgBounds = [ [-90.0, -180.0], [90.0, 180.0] ];
  position = [0.0, 0.0];

  componentWillReceiveProps(nextProps) 
  {
    if (nextProps.imageItemId) {
      if (this.props.imageItemId !== nextProps.imageItemId) {
        let southWest = this.lmap.leafletElement.unproject([0, this.props.dim.height], this.props.dim.maxZoom)
        let northEast = this.lmap.leafletElement.unproject([this.props.dim.width, 0], this.props.dim.maxZoom)
    
        this.imgBounds = [[southWest.lat, southWest.lng], [northEast.lat, northEast.lng]]        
        this.position = [(southWest.lat+northEast.lat)/2.0, (southWest.lng+northEast.lng)/2.0]
        
        this.activeColor = undefined
      }
    }
    if (nextProps.classAnnotationId) {
      if (this.props.classAnnotationId !== nextProps.classAnnotationId) {
        if (nextProps.classAnnotationColors) {
          this.activeColor = nextProps.classAnnotationColors[ nextProps.classAnnotationId ]
        }
      }
    }
    // need to find a place to put these!
    if (this.result1) {
      this.result1.leafletElement.getContainer().style.mixBlendMode = 'screen';
    }
    if (this.result2) {
      this.result2.leafletElement.getContainer().style.mixBlendMode = 'screen';
    }
  }

  handleLoadDone = (ind) => 
  {    
    this.props.onLoadDone();
  }

  getResultTileUrl = (layerId, threshold) => globalStore.apiRoot + 
              '/item/' + this.props.resultItemId[layerId] + '/tiles/zxy/{z}/{x}/{y}?threshold=' + 
              threshold.toString() //+ '&color=0,255,0,10' 


  getImageTileUrl = (layerId) => globalStore.apiRoot + 
              '/item/' + this.props.imageItemId[layerId] + '/tiles/zxy/{z}/{x}/{y}'
  

  onEditPath(e) 
  {
    console.log('Path edited !');
  }

  onDeleted(e) {    

    let indMap = {}
    for(let i=0; i< this.annotations.length; i++) {
        indMap[this.annotations[i].leafletElement._leaflet_id] = i;
    }
    //console.log(indMap);
    let delList = []

    for (var key in e.layers._layers) {
      if (e.layers._layers.hasOwnProperty(key)) {
          delList.push(indMap[key])
      }
    }
    this.props.onDelAnnotation(delList)       
  }   
   
  onCreate(e) {        
    let myAnnotation = annotationsToJSON(e.layer, 
                                         this.lmap.leafletElement, 
                                         this.props.dim.maxZoom, 
                                         this.props.classAnnotationId);

    //console.log('Deleting layer ' + e.layer._leaflet_id);
    this.editGroup.leafletElement.removeLayer(e.layer._leaflet_id);
    
    this.props.onNewAnnotation(myAnnotation); 
  }
  
  componentDidUpdate()
  {
    //console.log("Should be good...")
    //console.log(this.annotations)
    if (this.props.classAnnotationColors) {
      if (this.props.annotationItem) 
      {
          for(let li=0; li < this.props.annotationItem.length; li++) 
          {
            console.log(this.props.annotationItem[li])
            let fillFlag = (this.props.annotationItem[li].geometry.type === 'Polygon') ?  true : false

            let col = this.props.classAnnotationColors[ this.props.annotationItem[li].classId ]
            this.editGroup.leafletElement.getLayers()[li].setStyle({
              "color": col, 
              "fill": fillFlag,
              "fillColor": col,
              "fillOpacity": 0.5,
              "opacity": 1.0,
              "stroke": !fillFlag,
              "weight": 1
            })
          }
      }
    }        
  }

  unprojectArray = (item) => this.lmap.leafletElement.unproject(item, this.props.dim.maxZoom); 

  addAnnotation(item, ind) 
  {      
    let unproj = [];
    //console.log("Adding " + ind + " is " + item.geometry.coordinates.length)
    if (item.geometry.coordinates.length > 1) {
      unproj = item.geometry.coordinates.map(this.unprojectArray.bind(this));       
    } else return(undefined); 
    
    if (item.geometry.type === "Polygon") 
    {                  
      return (       
        <Polygon key={item.id} positions={unproj}  ref={a => {this.annotations[ind] = a; }}/>
      );  
    }
    
    if (item.geometry.type === "Polyline") 
    {
      return(       
        <Polyline key={item.id} positions={unproj} options={item.style} />
    )}
    
    if (item.geometry.type === "Circle") 
    {
      return (                
        <Circle key={item.id} center={unproj} radius={item.geometry.radius} options={item.style} />     
    )}         
  }

  renderBaseImage()
  {
    return(
      <LayerGroup>
        <TileLayer className = 'image1' noWrap={true} zIndex={this.props.imageZIndex[0]}
                            updateWhenIdle={true} maxNativeZoom={this.props.dim.maxZoom} 
                            onload={this.handleLoadDone.bind(this, 0)}
                            url= { this.getImageTileUrl(0) } />  
        <TileLayer className = 'image2' noWrap={true} zIndex={this.props.imageZIndex[1]}
                            updateWhenIdle={true} maxNativeZoom={this.props.dim.maxZoom} 
                            onload={this.handleLoadDone.bind(this, 1)}
                            url= { this.getImageTileUrl(1) } />
      </LayerGroup>
    ); 
  }

  renderResultImage()
  {
    return(
    <LayerGroup>
      <TileLayer className = 'result1' noWrap={true} zIndex={this.props.imageZIndex[0]} opactity={0.5}
                updateWhenIdle={true} maxNativeZoom={this.props.dim.maxZoom} ref={m => { this.result1 = m; }}                           
                url= { this.getResultTileUrl(0, this.props.threshold) } />
      <TileLayer className = 'result2' noWrap={true} zIndex={this.props.imageZIndex[1]} opactity={0.5}
                updateWhenIdle={true} maxNativeZoom={this.props.dim.maxZoom} ref={m => { this.result2 = m; }}                           
                url= { this.getResultTileUrl(1, this.props.threshold) } />              
    </LayerGroup>
    ); 
  }

  renderResultLayer()
  {
    return(
      this.props.options.layer ?      
        <LayersControl.Overlay name='Results' checked={true}>            
          {
            this.renderResultImage()
          }
        </LayersControl.Overlay>
      : this.renderResultImage()
    )
  }

  renderBaseLayer()
  {
    return(
      this.props.options.layer ?      
        <LayersControl.BaseLayer name='Image' checked={true}>
        { 
          this.renderBaseImage()
        }
        </LayersControl.BaseLayer>            
      : this.renderBaseImage()
      )
  }

  renderBaseOverlay()
  {
    return(
      <FeatureGroup         
        ref={g => {this.editGroup = g; }}
        >
        {
          (this.props.options.draw && this.activeColor) ?
              <EditControl                  
                onEdited={this.onEditPath.bind(this)}
                onCreated={this.onCreate.bind(this)}
                onDeleted={this.onDeleted.bind(this)}
                draw={
                  {
                    polygon: {     
                        icon: new Leaflet.DivIcon({
                          iconSize: new Leaflet.Point(5, 5),
                          className: 'leaflet-div-icon leaflet-editing-icon'
                          }),                 
                        shapeOptions: {
                          color: this.activeColor,
                          weight: 3
                        }
                    },
                    polyline: {
                      shapeOptions: {
                          color: this.activeColor,
                          weight: 3
                        }
                    },
                    rectangle: {
                      shapeOptions: {
                          color: this.activeColor,
                          weight: 3
                        }
                    },
                    circle: {
                      shapeOptions: {
                          color: this.activeColor,
                          weight: 3
                        }
                    },
                    circlemarker: false,
                    marker: false
                  }
                }             
              />
          : undefined          
        }        
        { 
          this.props.annotationItem ? 
            this.props.annotationItem.map( this.addAnnotation.bind(this) ) 
            : undefined 
        }  
      </FeatureGroup>
    )
  }

  renderResultOverlay()
  {   
    if (this.props.resultAnnotationItem)
    {
      if (this.props.resultAnnotationItem.length > 1) {
        return(
          <FeatureGroup>                   
            {
              this.props.resultAnnotationItem.map( this.addAnnotation.bind(this) )
            }
          </FeatureGroup>
        )
      } 
      else if (this.props.resultAnnotationItem.length > 0) 
      {      
        return( this.addAnnotation(this.props.resultAnnotationItem[0], 0))
      }
    } 
    return(undefined)
  }

  renderBaseOverlayLayer()
  {
    return(
      this.props.options.layer ?
        <LayersControl.Overlay name='Markup' checked={true}>
          {
            this.renderBaseOverlay()
          }
        </LayersControl.Overlay>
        : this.renderBaseOverlay()
        )
  }

  renderResultOverlayLayer()
  {
    return(
      this.props.options.layer ?
        <LayersControl.Overlay name='Results' checked={true}>
          {
            this.renderResultOverlay()
          }
        </LayersControl.Overlay>
        : this.renderResultOverlay()
        )
  }
  
  render () {
    console.log("Render Leaflet");    
    this.annotations = []
    return (      
        this.props.options.layer ?
              <Map    attributionControl={false}                                              
                                  center={this.position}                                 
                                  bounds={this.imgBounds}                                
                                  zoom={1} zoomAnimation={true} inertia={false} 
                                  zoomSnap={0.1} zoomDelta={0.1}
                                  crs={Leaflet.CRS.Simple} 
                                  ref={m => { this.lmap = m; }}
                                  >
                  <LayersControl position='topright' hideSingleBase={false} collapsed={false}>
                      {
                        this.props.imageItemId ?  this.renderBaseLayer() : undefined
                      }
                      {
                        this.renderBaseOverlayLayer()
                      }
                      {
                        this.props.resultAnnotationItem ? this.renderResultOverlayLayer() : undefined
                      }
                      {
                        this.props.resultItemId ? this.renderResultLayer() : undefined
                      }        
                  </LayersControl>     
              </Map>    
            : 
            <Map  attributionControl={false}  
                  center={this.position}                                 
                  bounds={this.imgBounds}                                
                  zoom={1} zoomAnimation={true} inertia={false} 
                  zoomSnap={0.1} zoomDelta={0.1}
                  crs={Leaflet.CRS.Simple} 
                  ref={m => { this.lmap = m; }}
                  >
              {
                this.props.imageItemId ?  this.renderBaseLayer() : undefined
              }
              {
                this.renderBaseOverlayLayer()
              }
              {
                this.props.resultAnnotationItem ? this.renderResultOverlayLayer() : undefined
              }              
              {
                this.props.resultItemId ? this.renderResultLayer() : undefined
              }        
            </Map>    
    );
  }
}

export default easyComp(LeafletVideo)

/*
//ref={m => { this.leafletMap = m; }}
    
    // normal, multiply, screen, overlay, darken, lighten,
    // color-dodge, color-burn, hard-light, soft-light, difference,
    // exclusion, hue, saturation, color, luminosity
    //this.result1.leafletElement.getContainer().style.mixBlendMode = 'screen';
    //this.result2.leafletElement.getContainer().style.mixBlendMode = 'screen';
    //this.result1.leafletElement.getContainer().style.filter = 'grayscale(50%)';

  onClickPolygon(e) {
    console.log('Clicked the polygon ');    

    if (this.selected[e.target]) {
      this.selected[e.target] = false; 
      e.target.setStyle({ fillColor: '#000000', fill: true});
    } else {
      this.selected[e.target] = true; 
      e.target.setStyle({ fillColor: '#ff0000', fill: true});      
    }
    //this._poly.setStyle({ fillColor: '#ff0000'});
  }
  On EditControl
   draw={drawOptions}    

          <Polygon 
              key={item.meta.id} 
              positions={item.meta.geometry.coordinates}                                    
              onmousedown={this.onClickPolygon.bind(this)}
              ref={(poly) => { this.selected[poly] = false; poly.setStyle(item.meta.style)}}
            />

const  drawOptions = {        
  polyline: {
      shapeOptions: {
          color: '#00ff00',
          weight: 1
      }
  },
  polygon: {
      shapeOptions: {
          color: '#00ff00',
          fillColor: '#000000',
          fill: true,
          weight: 1
      }
  },
  circle: false, // Turns off this drawing tool
  rectangle: {
      shapeOptions: {
          color: '#00ff00',
          fillColor: '#000000',
          fill: true,
          weight: 1
      }
  },
  marker: false
}; 


              */