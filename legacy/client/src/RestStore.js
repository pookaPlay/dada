

const RestStore = {  

    saveAnnotationClasses(apiRoot, apiKey, annotationId, classAnnotations)
    {
        let url = apiRoot + "/api_key/token?key=" + apiKey;
        fetch(url, { method: "POST"})
        .then(response => response.json())
        .then(json => {      
            let myToken = json.authToken.token;                          
            let newAnnotations = '{ "classes": '
            newAnnotations += JSON.stringify(classAnnotations)
            newAnnotations += '}'
            console.log("Puting")
            console.log(newAnnotations)
            let urli = apiRoot + "/folder/" + annotationId + "/metadata";            
            console.log(urli)
            return(fetch(urli, { 
                    headers: {"Girder-Token": myToken},
                    method: "PUT",                 
                    body: newAnnotations
            }))        

        })
    },

    loadClassAnnotations(apiRoot, annotationId, classAnnotationsCallback)
    {
        let url = apiRoot + '/folder/' + annotationId;                                        
        fetch(url)
        .then(response => response.json())
        .then(json => {                               
            if (json.meta) {
                if (json.meta.classes) {              
                    classAnnotationsCallback(json.meta.classes)
                    return; 
                }
            }
            classAnnotationsCallback(undefined)
        })
    },

    loadClassResults(apiRoot, resultId, classResultCallback)
    {
        console.log("Load class results");
        let url = apiRoot + '/folder?parentType=folder&parentId=' +
            resultId + '&name=images&limit=1&sort=lowerName&sortdir=1';

        fetch(url)
        .then(response => response.json())
        .then(json => {               
            // Get folder id of images                            
            console.log("Class Results");    
            console.log(json)
            let urli = apiRoot + '/folder?parentType=folder&parentId=' +
            json[0]['_id'] + '&limit=1000&sort=lowerName&sortdir=1';
            return(fetch(urli));                 
        })
        .then(response => response.json())
        .then(json => {
            classResultCallback(json)
        })
    },

    newAnnotation(apiRoot, apiKey, annotationId, currentFrame, annotation, newAnnotationCallback) 
    {
        console.log("Saving first annotation of the frame to girder")
        let myToken = undefined 
        let url = apiRoot + "/api_key/token?key=" + apiKey;
        fetch(url, { method: "POST"})
        .then(response => response.json())
        .then(json => {               // create item for frame
            myToken = json.authToken.token; 
            let urli = apiRoot + "/item?folderId=" + annotationId + "&name=" + currentFrame + "&reuseExisting=false";            
            return(fetch(urli, { 
                method: "POST", 
                headers: {"Girder-Token": myToken}
            }))        
        })
        .then(response => response.json())
        .then(json => {
            
            newAnnotationCallback(json['_id'])
            
            let urlm = apiRoot + "/item/" + json['_id'] + "/metadata?allowNull=false";    
            return(fetch(urlm, {           
              headers: { "Girder-Token": myToken },
              method: "PUT", 
              body: annotation
            }));  
        });      
    },

    saveAnnotation(apiRoot, apiKey, aid, annotation) 
    {
        let url = apiRoot + "/api_key/token?key=" + apiKey;
        fetch(url, { method: "POST"})
        .then(response => response.json())
        .then(json => {      
            let myToken = json.authToken.token;                          
            //console.log(json); 
            let urlm = apiRoot + "/item/" + aid + "/metadata?allowNull=false";        
            return(fetch(urlm, {           
                    headers: { "Girder-Token": myToken },
                    method: "PUT", 
                    body: annotation
            }));  
        })
    },

    loadClassResultImages(apiRoot, classResultId, classResultImagesCallback)
    {
        let  url = apiRoot + '/item?folderId=' + 
                   classResultId + '&limit=5000&offset=0&sort=lowerName&sortdir=1';
        fetch(url)
        .then(response => response.json())
        .then(json => {               
              let imageIds = json.map( item => item['_id'] );
              classResultImagesCallback(imageIds)
        })
    }, 

    loadImagesAndAnnotations(apiRoot, dataId, annotationId, imagesAndAnnotationsCallback) {
        let imageIds = undefined
        let annotationIds = undefined

        let url = apiRoot + '/item?folderId=' + dataId + '&limit=5000&offset=0&sort=lowerName&sortdir=1';
        fetch(url)
            .then(response => response.json())
            .then(json => {
                // Now we have frame data                            
                imageIds = json.map( item => item['_id'] );
                // Go ahead and do annotation
                let urli = apiRoot + '/item?folderId=' + annotationId + '&limit=5000&offset=0&sort=lowerName&sortdir=1';
                return(fetch(urli)); 
            })
            .then(response => response.json())
            .then(json => {                      
                annotationIds = {};
                for (let i=0; i< json.length; i++) {
                    annotationIds[ json[i].name ] = { id: json[i]._id, 
                                                      annotations: json[i].meta.annotations.features };
                }
                //console.log(annotationIds)
                imagesAndAnnotationsCallback(imageIds, annotationIds)
            }); 
    },

    loadResultAnnotations(apiRoot, resultId, resultAnnotationsCallback) {

        let resultAnnotationIds = undefined

        let url = apiRoot + '/folder?parentType=folder&parentId=' +
        resultId + '&name=annotations&limit=1&sort=lowerName&sortdir=1';

        fetch(url)
        .then(response => response.json())
        .then(json => {
            let urli = apiRoot + '/item?folderId=' + json[0]['_id'] + '&limit=5000&offset=0&sort=lowerName&sortdir=1';
            return(fetch(urli));                 
        })
        .then(response => response.json())
        .then(json => {
            resultAnnotationIds = {};
            for (let i=0; i< json.length; i++) {
                resultAnnotationIds[ json[i].name ] = { id: json[i]._id, 
                                                    annotations: json[i].meta.annotations.features };
            }
            resultAnnotationsCallback(resultAnnotationIds)
        })
    },
    
    loadNewDataSet(apiRoot, dataSetId, dataSetCallback) {
          //console.log("Loading info for: " + nextProps.dataId);
          let url = apiRoot + '/folder/' + dataSetId;
          fetch(url)
          .then(response => response.json())
          .then(json => {            
            console.log(json.meta.dimensions)
            let dim = json.meta.dimensions
            dataSetCallback(dim)
          })
    },
    
    loadCollection(apiRoot, collectionName, collectionCallback) {
        let collectionId = undefined
        let url = apiRoot + '/collection?text=' + collectionName + '&limit=50&offset=0&sort=lowerName&sortdir=1'

        fetch(url) 
        .then(response => response.json())
        .then(json => {               
            collectionId = json[0]['_id']; 
            //console.log("CollectionId: " + collectionId);
            let url = apiRoot + '/folder?parentType=collection&parentId=' + collectionId + '&limit=5000&offset=0&sort=lowerName&sortdir=1';                

            return(fetch(url)); 
        })
        .then(response => response.json())
        .then(json => {

            let dataSets = json.map( item => ({id: item['_id'], name: item['name'], desc: item['description'] } )) 
            let count = 0
            //console.log("Collection size: " + dataSets.length);
            dataSets.forEach( (item, ind) => 
            {
                let urld = apiRoot + '/folder?parentType=folder&parentId=' 
                    + item.id + '&limit=10&sort=lowerName&sortdir=1';
                // Get imageid
                fetch(urld)
                .then(response => response.json())
                .then(json => {                        
                    item['annotationId'] = json[0]['_id'];
                    item['dataId'] = json[1]['_id'];
                    item['resultId'] = json[2]['_id'];
                    // Get thumbnail
                    let urli = apiRoot + '/item?folderId=' +
                        item['dataId'] + '&limit=1&sort=lowerName&sortdir=1';
                    return(fetch(urli));     
                })
                .then(response => response.json())
                .then(json => {                            
                    item['imageItem'] = json[0]['_id'];
                    item['thumbnail'] = apiRoot + '/item/' +
                                            item['imageItem'] + '/tiles/thumbnail';                        
                    // Now get list of results    
                    let urlrr = apiRoot + '/folder?parentType=folder&parentId=' +
                        item['resultId'] + '&limit=1000&sort=lowerName&sortdir=1';
                    return(fetch(urlrr));                         
                })
                .then(response => response.json())
                .then(json => {

                    let resultSets = json.map( item => {
                            return( { id: item['_id'], 
                                name: item['name'] } ); 
                        }); 
                    
                    item['resultIds'] = resultSets; 
                    count++
                    //console.log("count is: " + count)
                    if (count >= dataSets.length) {
                        //console.log("Setting: " + dataSets.length)
                        collectionCallback(collectionId, dataSets); 
                    }
                })            
            })
        })
    }
}

export default RestStore
