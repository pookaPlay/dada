import { easyStore } from 'react-easy-state'
import RestStore from './RestStore'

export const API_ROOT = 'http://localhost:8080/api/v1';
export const API_KEY = '';
export const COLLECTION_NAME ='test';

export const DEFAULT_CLASS_COLORS = ['#B80000', '#00B800', '#0000B8', '#B8B800', '#00B8B8', '#B800B8', '#000000', '#B8B8B8']
             
export default easyStore({
    apiRoot: API_ROOT,
    apiKey: API_KEY,
    collectionName: COLLECTION_NAME,   

    resultId: undefined,
    classResultId: undefined,
    classThreshold: 127, 
    annotationId: undefined,
    classAnnotationId: undefined,    
    classAnnotationColors: undefined,
    drawerPinned: true,
    sidebarPinned: true,
    options: {layer: true, zoom: true, draw: true, edit:true},    

    dataSetId: undefined,   // Id of dataset folder which contains images, results, and annotation sub-folders
    dataId: undefined,      // images sub-folder
    
    newAnnotation(currentFrame, annotation, newAnnotationCallback)
    {
        RestStore.newAnnotation(this.apiRoot, this.apiKey, this.annotationId, currentFrame, annotation, newAnnotationCallback)
    },

    saveAnnotation(aid, annotation) {
        RestStore.saveAnnotation(this.apiRoot, this.apiKey, aid, annotation)
    },

    loadClassAnnotations(classAnnotationsCallback) {
        RestStore.loadClassAnnotations(this.apiRoot, this.annotationId, classAnnotationsCallback)
    },

    saveAnnotationClasses(classAnnotations) {        
        RestStore.saveAnnotationClasses(this.apiRoot, this.apiKey, this.annotationId, classAnnotations)
    },
    
    loadClassResults(classResultsCallback) {
        RestStore.loadClassResults(this.apiRoot, this.resultId, classResultsCallback)
    },
      
    loadClassResultImages(classResultImagesCallback) {
        RestStore.loadClassResultImages(this.apiRoot, this.classResultId, classResultImagesCallback)
    },

    loadImagesAndAnnotations(imagesAndAnnotationsCallback) {
        RestStore.loadImagesAndAnnotations(this.apiRoot, this.dataId, this.annotationId, imagesAndAnnotationsCallback)
    },
    
    loadResultAnnotations(resultAnnotationsCallback) {
        RestStore.loadResultAnnotations(this.apiRoot, this.resultId, resultAnnotationsCallback)
    },

    loadNewDataSet(newDataSetCallback) {
        RestStore.loadNewDataSet(this.apiRoot, this.dataSetId, newDataSetCallback)
    },

    loadCollection(collectionCallback) {         
        RestStore.loadCollection(this.apiRoot, this.collectionName, collectionCallback)
    }

})