import React, { Component } from 'react';
import './App.css';

import Layout from 'react-toolbox/lib/layout/Layout';
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer';
import Panel from 'react-toolbox/lib/layout/Panel';
import Sidebar from 'react-toolbox/lib/layout/Sidebar';
import AppBar from 'react-toolbox/lib/app_bar/AppBar';
import MdCode from 'react-icons/lib/md/code';
import MdClose from 'react-icons/lib/md/close';

import Viewer from './Viewer.js';
import Tools from './Tools.js';
import ProjectBrowser from './ProjectBrowser.js';

import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';

class App extends Component {
  
  toggleDrawerPinned = () => {    
      globalStore.drawerPinned = !globalStore.drawerPinned
  }

  toggleSidebarPinned = () => {
      globalStore.sidebarPinned = !globalStore.sidebarPinned
  }

  handleThreshChange = (value) => {     
      globalStore.classThreshold = 255-value
  }

  handleDataChange = (dataId, annotationId, dataSetId) => {            
    //console.log('App dataId to ' + value);

    globalStore.dataId = dataId
    globalStore.annotationId = annotationId
    globalStore.dataSetId = dataSetId
    globalStore.resultId = undefined
    globalStore.classResultId = undefined
  }

  handleResultChange = (value) => {       
    //console.log("Setting resultId "); 
    //console.log(value);  
    globalStore.resultId = value
    globalStore.classResultId = undefined
  }

  handleClassResultChange = (value) => {      
    //console.log("Setting classResultId")
    //console.log(value);  
    globalStore.classResultId = value
  }

  handleClassAnnotationChange = (newClassId, newClassColors) =>
  {
    //console.log("Setting annotations")
    //console.log(newClassId);        
    //console.log(newClassColors);        
    globalStore.classAnnotationId = newClassId        
    globalStore.classAnnotationColors = newClassColors
  }

  handleToolOptions = (opt) => {    
    globalStore.options[opt] = !globalStore.options[opt]
  }
  
  render() {
      console.log("Render App")
      return(
        <Layout>
            <NavDrawer                 
                pinned={globalStore.drawerPinned} 
                permanentAt='xxxl' 
                scrollY={true}>   

                <AppBar title='Project' 
                        rightIcon={globalStore.drawerPinned ? <MdClose/> : undefined}
                        onRightIconClick={globalStore.drawerPinned ? this.toggleDrawerPinned : undefined}                     
                />

                { globalStore.collectionName ? 
                    <ProjectBrowser
                        collectionName={globalStore.collectionName}                    
                        dataId={globalStore.dataId} 
                        onDataChange = {this.handleDataChange.bind(this)}
                        resultId={globalStore.resultId}
                        onResultChange = {this.handleResultChange.bind(this)}                        
                    /> 
                    : undefined 
                }

            </NavDrawer>
            <Panel>                
                <AppBar 
                    title='Viewer' 
                    leftIcon={globalStore.drawerPinned ? undefined : <MdCode/>} 
                    onLeftIconClick={globalStore.drawerPinned ? undefined : this.toggleDrawerPinned}
                    rightIcon={globalStore.sidebarPinned ? undefined :<MdCode/>} 
                    onRightIconClick={globalStore.sidebarPinned ? undefined : this.toggleSidebarPinned} 
                />
                <Viewer                    
                    dataSetId={globalStore.dataSetId}
                    dataId={globalStore.dataId}                     
                    threshold= {globalStore.classThreshold}
                    annotationId={globalStore.annotationId}
                    classAnnotationId={globalStore.classAnnotationId}                    
                    classAnnotationColors={globalStore.classAnnotationColors}                    
                    classResultId={globalStore.classResultId}
                    resultId={globalStore.resultId}
                    options={globalStore.options}
                />                
            </Panel>
            <Sidebar                 
                pinned={ globalStore.sidebarPinned } 
                width={ 5 }>

                <AppBar title='Tools'
                    rightIcon={globalStore.sidebarPinned ? <MdClose/> : undefined}
                    onRightIconClick={globalStore.sidebarPinned ? this.toggleSidebarPinned : undefined}
                />   

                <Tools                                                      
                    threshold = { globalStore.classThreshold }
                    onThreshChange = {this.handleThreshChange.bind(this)}
                    resultId={globalStore.resultId}
                    classResultId = { globalStore.classResultId }
                    onClassResultChange = {this.handleClassResultChange.bind(this)}
                    annotationId={globalStore.annotationId}
                    classAnnotationId = { globalStore.classAnnotationId }                    
                    onClassAnnotationChange = { this.handleClassAnnotationChange.bind(this)}
                    options={globalStore.options}
                    optionHandler={this.handleToolOptions.bind(this)}
                />

            </Sidebar>
        </Layout>   
      ) 
    }
}

export default easyComp(App);

/*
        <Viewer/>
    );
}
}
export default App;
        
          <AppBar leftIcon='menu' onLeftIconClick={ this.toggleDrawerActive } />
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
              <h1>Main Content</h1>
              <p>Main content goes here.</p>
              <Checkbox label='Pin drawer' checked={globalStore.drawerPinned} onChange={this.toggleDrawerPinned} />
              <Checkbox label='Show sidebar' checked={globalStore.sidebarPinned} onChange={this.toggleSidebar} />
          </div>
*/