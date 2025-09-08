

   export function stringifyAnnotations(annotationItem)
   {
      let allAnnotations = '{ "annotations": { "features": ['
    
      for(let i=0; i< annotationItem.length; i++) {
        allAnnotations += JSON.stringify(annotationItem[i])
        if (i < annotationItem.length-1) allAnnotations += ','
      }      
      allAnnotations += '] } }'
      return(allAnnotations)
   }


   export function stringifyNewAnnotations(annotationItem, newAnnotation)
   {
      let allAnnotations = '{ "annotations": { "features": ['
    
      for(let i=0; i< annotationItem.length; i++) {
        allAnnotations += JSON.stringify(annotationItem[i])
        allAnnotations += ','
      } 
      allAnnotations += newAnnotation
      allAnnotations += '] } }'
      return(allAnnotations)
   }

   export function annotationsToJSON(ditem, map, maxZoom, labelId) 
   {
      var dOut1 = '';    
      if ('_latlng' in ditem) {
        console.log("Circle!");
        dOut1 = '{"type":"Feature","id":' + ditem._leaflet_id +
        ',"classId":' + labelId +
        ',"geometry":{"type":"Circle","coordinates":[';
        let pt = map.project([ditem._latlng.lat, ditem._latlng.lng], maxZoom);        
        //dOut1 += ditem._latlng.lat + ',' + ditem._latlng.lng + '],"radius":';
        dOut1 += pt.x + ',' + pt.y + '],"radius":';
        //let r = this.lmap.leafletElement.project([ditem._latlng.lat, ditem._latlng.lng], this.props.dim.maxZoom);        
        dOut1 += ditem._mRadius + '}'
      } else if ('_latlngs' in ditem) {
        if (ditem._latlngs.length > 1) {
          console.log("Line or multi-poly..." + ditem._latlngs.length);
          dOut1 = '{"type":"Feature","id":' + ditem._leaflet_id + 
          ',"classId":' + labelId + 
          ',"geometry":{"type":"Polyline","coordinates":[';  
          for (var ll = 0; ll < ditem._latlngs.length; ll++) {
            // convert to pixel            
            let pt = map.project([ditem._latlngs[ll].lat, ditem._latlngs[ll].lng], maxZoom);
            //console.log(ditem._latlngs[ll].lat + ',' + ditem._latlngs[ll].lng + ' -> ' + pt);            
            dOut1 += '[' + pt.x + ',' + pt.y + ']';
            
            if (ll < (ditem._latlngs.length-1)) {
              dOut1 += ',';
            }
          }
          dOut1 += ']}';
        } else {
          console.log("Rect or Poly..." + ditem._latlngs[0].length);
          dOut1 = '{"type":"Feature","id":' + ditem._leaflet_id +
          ',"classId":' + labelId +
          ',"geometry":{"type":"Polygon","coordinates":[';
          for (ll = 0; ll < ditem._latlngs[0].length; ll++) {
              
              let pt = map.project([ditem._latlngs[0][ll].lat, ditem._latlngs[0][ll].lng], maxZoom);
              //console.log(ditem._latlngs[0][ll].lat + ',' + ditem._latlngs[0][ll].lng + ' -> ' + pt);              
              dOut1 += '[' + pt.x + ',' + pt.y + ']';

              //dOut1 += '[' + ditem._latlngs[0][ll].lat + ',' + ditem._latlngs[0][ll].lng + ']';
              if (ll < (ditem._latlngs[0].length-1)) {
              dOut1 += ',';
            }
          }
          dOut1 += ']}';
        }
      }
      dOut1 += '}'; // top level

    return(dOut1);
  }  

export default annotationsToJSON