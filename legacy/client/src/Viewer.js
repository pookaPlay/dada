import LeafletVideo from './LeafletVideo'

import React from 'react';
import Slider from 'react-toolbox/lib/slider/Slider';

import IconButton from'react-toolbox/lib/button/IconButton';
import TiMediaPlay from 'react-icons/lib/ti/media-play';
import TiMediaFastForward from 'react-icons/lib/ti/media-fast-forward';
import TiMediaPlayReverse from 'react-icons/lib/ti/media-play-reverse';
import TiMediaPlayOutline from 'react-icons/lib/ti/media-play-outline';
import TiMediaPlayReverseOutline from 'react-icons/lib/ti/media-play-reverse-outline';
import TiMediaStop from 'react-icons/lib/ti/media-stop';

import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';
import {stringifyNewAnnotations, stringifyAnnotations} from './Util.js'


class Viewer extends React.Component {

  store = {        
    imageItemId: undefined,
    resultItemId: undefined,
    annotationId: undefined,
    annotationItem: undefined,
    resultAnnotationId: undefined,
    resultAnnotationItem: undefined,

    imageZIndex: undefined,    
    currentFrame: 0,

    dim: { bands: 1, width: 256, height: 256, maxZoom: 3, numFrames: 1},    
  }  

  // Local variables
  imageIds = undefined
  resultIds = undefined
  annotationIds = undefined        
  resultAnnotationIds = undefined        
  readyForNext = true

  nextFrame = 1
  imageMode = 0
  stepSize = 1
  playMode = 0 

  timer() {
    if (this.playMode > 0) {
      if(this.readyForNext) {
        this.readyForNext = false; 

        let newFrame = this.store.currentFrame + this.stepSize; 
        if (newFrame >= this.store.dim.numFrames) {
          newFrame = 0; 
        }
        if (newFrame < 0) {
          newFrame = this.store.dim.numFrames-1; 
        }
        
        let newNextFrame = newFrame + this.stepSize; 
        if (newNextFrame >= this.store.dim.numFrames) {
          newNextFrame = 0; 
        }
        if (newNextFrame < 0) {
          newNextFrame = this.store.dim.numFrames-1; 
        }
        if (this.nextFrame===newFrame) {
          this.store.currentFrame = newFrame; 
          this.nextFrame = newNextFrame;                     

          this.StepVideo();

        } else {
          this.store.currentFrame = newFrame; 
          this.nextFrame = newNextFrame;                     

          this.JumpVideo();          
        }
      }
    }
  }

  loadDoneCallback() {
    this.readyForNext = true
  } 

  componentDidMount() {    
    this.intervalId = setInterval(this.timer.bind(this), 250);    
  }

  newDataSetCallback(newDim) {
    this.store.dim = newDim; 
  }

  // Get the list of image items  
  imagesAndAnnotationsCallback(newImageIds, newAnnotationIds)
  {
    this.imageIds = newImageIds
    this.annotationIds = newAnnotationIds

    this.store.currentFrame = 0
    this.nextFrame = 0
    
    this.JumpVideo();     
  }

  resultAnnotationsCallback(newResultIds)
  {
    this.resultAnnotationIds = newResultIds    
    //console.log(newResultIds)
  }

  resultImageCallback(newResultIds)
  {
    this.resultIds = newResultIds
    this.store.resultItemId = [ this.resultIds[ this.store.currentFrame], 
                                this.resultIds[ this.nextFrame] ]                 
  }

  componentWillReceiveProps(nextProps) 
  {    
    if (nextProps.dataId) {
      
      if (this.props.dataId !== nextProps.dataId) {
        // Load meta data
        globalStore.loadNewDataSet(this.newDataSetCallback.bind(this))
        // load image and annotation ids
        globalStore.loadImagesAndAnnotations(this.imagesAndAnnotationsCallback.bind(this))
      }
    }

    if (nextProps.resultId) {
      
      if (this.props.resultId !== nextProps.resultId) {
        // Load annotation results
        globalStore.loadResultAnnotations(this.resultAnnotationsCallback.bind(this))
      }
    }
    
    if (nextProps.classResultId) {

      if (this.props.classResultId !== nextProps.classResultId) 
        {  
          globalStore.loadClassResultImages(this.resultImageCallback.bind(this))
        }
    } else {
        this.resultIds = undefined; 
        this.store.resultItemId = undefined; 
    }
        
  }

     
  onPlay = () => {
    this.playMode = 1;     
  }
  onStop = () => {
    this.playMode = 0;     
  }
  onFF = () => {
    this.stepSize = this.stepSize + 1; 
  }

  handleFrameSlider = (value) => {    
    
    let newFrame = value; 
    if (newFrame >= this.store.dim.numFrames) {
      newFrame = 0; 
    }
    if (newFrame < 0) {
      newFrame = this.store.dim.numFrames-1; 
    }
    
    let newNextFrame = newFrame + this.stepSize; 
    if (newNextFrame >= this.store.dim.numFrames) {
      newNextFrame = 0; 
    }
    if (newNextFrame < 0) {
      newNextFrame = this.store.dim.numFrames-1; 
    }
    this.store.currentFrame = newFrame; 
    this.nextFrame = newNextFrame;   

    this.JumpVideo()
  }

  onForward = () => {    

    let newFrame = this.store.currentFrame + this.stepSize; 
    if (newFrame >= this.store.dim.numFrames) {
      newFrame = 0; 
    }
    if (newFrame < 0) {
      newFrame = this.store.dim.numFrames-1; 
    }
    
    let newNextFrame = newFrame + this.stepSize; 
    if (newNextFrame >= this.store.dim.numFrames) {
      newNextFrame = 0; 
    }
    if (newNextFrame < 0) {
      newNextFrame = this.store.dim.numFrames-1; 
    }
        
    if (newFrame === this.nextFrame) 
    {
      this.store.currentFrame = newFrame; 
      this.nextFrame = newNextFrame;    
        
      this.StepVideo()

    } else {
      this.store.currentFrame = newFrame; 
      this.nextFrame = newNextFrame;    
        
      this.JumpVideo()      
    }

  }

  onBack = () => {
    let newFrame = this.store.currentFrame - this.stepSize; 
    if (newFrame >= this.store.dim.numFrames) {
      newFrame = 0; 
    }
    if (newFrame < 0) {
      newFrame = this.store.dim.numFrames-1; 
    }
    
    let newNextFrame = newFrame - this.stepSize; 
    if (newNextFrame >= this.store.dim.numFrames) {
      newNextFrame = 0; 
    }
    if (newNextFrame < 0) {
      newNextFrame = this.store.dim.numFrames-1; 
    }

    if (newFrame === this.nextFrame) 
      {
        this.store.currentFrame = newFrame; 
        this.nextFrame = newNextFrame;    
          
        this.StepVideo()
  
      } else {
        this.store.currentFrame = newFrame; 
        this.nextFrame = newNextFrame;    
          
        this.JumpVideo()      
      }     
  }

  LoadCurrentAnnotations = () =>
  {
    if (this.annotationIds) {
      console.log("Loading annotations for " + this.store.currentFrame);
      this.store.annotationItem = this.annotationIds[this.store.currentFrame.toString()] ?
                                this.annotationIds[this.store.currentFrame.toString()].annotations
                                : undefined 

      this.store.annotationItemId = this.annotationIds[this.store.currentFrame.toString()] ?
                                  this.annotationIds[this.store.currentFrame.toString()].id
                                  : undefined                                 
    }

    if (this.resultAnnotationIds) {      
      //console.log(this.resultAnnotationIds[this.store.currentFrame.toString()])
      this.store.resultAnnotationItem = this.resultAnnotationIds[this.store.currentFrame.toString()] ?
                                  this.resultAnnotationIds[this.store.currentFrame.toString()].annotations
                                  : undefined 
                              
      this.store.resultAnnotationItemId = this.resultAnnotationIds[this.store.currentFrame.toString()] ?
                                  this.resultAnnotationIds[this.store.currentFrame.toString()].id
                                  : undefined
            
      //console.log("Results: " + this.store.resultAnnotationItem.length)      
    }
  }
    
  StepVideo = () =>
  {
    if (this.imageMode) 
    {
        this.imageMode = 0; 
        this.store.imageZIndex = [2,1];
        this.store.imageItemId = this.props.dataId ?
                                [ this.store.imageItemId[0], this.imageIds[this.nextFrame] ]
                                : undefined;
        this.store.resultItemId = this.props.classResultId ?
                                [ this.store.resultItemId[0], this.resultIds[this.nextFrame] ]
                                : undefined;          
    } 
    else 
    {
        this.imageMode = 1;
        
        this.store.imageZIndex = [1,2];
        this.store.imageItemId = this.props.dataId ?
                                [ this.imageIds[this.nextFrame], this.store.imageItemId[1] ]
                                : undefined;
        this.store.resultItemId = this.props.classResultId ?
                                [ this.resultIds[this.nextFrame], this.store.resultItemId[1]  ]
                                : undefined;
    }
    this.LoadCurrentAnnotations()
  }

  JumpVideo = () => 
  {
      this.imageMode = 0; 
      
      this.store.imageZIndex = [2,1]
      this.store.imageItemId = this.props.dataId ?
                   [ this.imageIds[this.store.currentFrame], this.imageIds[this.nextFrame] ]
                   : undefined
                    
      this.store.resultItemId = this.props.classResultId ?
                   [ this.resultIds[this.store.currentFrame], this.resultIds[this.nextFrame] ]
                   : undefined

      this.LoadCurrentAnnotations()
  }          

  annotationIdCallback = (newAnnotation, newId) =>
  {
    this.annotationIds[this.store.currentFrame.toString()] = { id: newId, 
                          annotations: [JSON.parse(newAnnotation)]}

    this.store.annotationItem = this.annotationIds[this.store.currentFrame.toString()].annotations     
    this.store.annotationItemId = this.annotationIds[this.store.currentFrame.toString()].id
  }

  newAnnotationCallback = (newAnnotation) =>
  {
    console.log("newAnnotationCallback")
    if (this.store.annotationItem) 
      {                
        let allAnnotations = stringifyNewAnnotations(this.store.annotationItem, newAnnotation)
        globalStore.saveAnnotation(this.store.annotationItemId, allAnnotations);      
        this.store.annotationItem.push(JSON.parse(newAnnotation)); 
      } 
      else 
      {
        let oneAnnotation = '{ "annotations": { "features": [' + newAnnotation + '] } }'
        
        globalStore.newAnnotation(this.store.currentFrame.toString(), 
                                  oneAnnotation, 
                                  this.annotationIdCallback.bind(this, newAnnotation))        
      }
  }

  delAnnotationCallback = (delList) =>
  {
    console.log("dellAnnotationCallback")
    let leftOvers = []
    for(let i=0; i< this.store.annotationItem.length; i++) {
      if (!delList.includes(i)) {
        leftOvers.push(this.store.annotationItem[i])
      }
    }    
    let allAnnotations = stringifyAnnotations(leftOvers)
    globalStore.saveAnnotation(this.store.annotationItemId, allAnnotations)      
    this.store.annotationItem = leftOvers
  }

  render () {
    console.log("Render Viewer")
    return (
        <div>
            <Slider min={0} max={this.store.dim.numFrames-1} step={1} 
                    editable value={this.store.currentFrame} 
                    onChange={this.handleFrameSlider.bind(this)} 
            />
            
            <IconButton icon={<TiMediaPlayReverseOutline/>} onClick={this.onBack.bind(this)}/>
            <IconButton icon={<TiMediaPlayReverse/>} onClick={this.onBack.bind(this)}/>
            <IconButton icon={<TiMediaStop/>} onClick={this.onStop.bind(this)}/>
            <IconButton icon={<TiMediaPlay/>} onClick={this.onPlay.bind(this)}/>
            <IconButton icon={<TiMediaPlayOutline/>} onClick={this.onForward.bind(this)}/>
            <IconButton icon={<TiMediaFastForward/>} onClick={this.onFF.bind(this)}/>                
                                
            <LeafletVideo                                
                dim={this.store.dim}
                classAnnotationId={this.props.classAnnotationId}
                classAnnotationColors={this.props.classAnnotationColors}
                threshold={this.props.threshold}
                options={this.props.options}                                
                imageZIndex = {this.store.imageZIndex}
                imageItemId = {this.store.imageItemId}
                resultItemId = {this.store.resultItemId}
                annotationItem = {this.store.annotationItem}
                resultAnnotationItem = {this.store.resultAnnotationItem}
                onNewAnnotation = {this.newAnnotationCallback.bind(this)} 
                onDelAnnotation = {this.delAnnotationCallback.bind(this)}
                onLoadDone= {this.loadDoneCallback.bind(this)}
                />    
        </div> 
    );
  }
}

export default easyComp(Viewer)


// <div className="videoControls">