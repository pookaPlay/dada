import React from 'react';
import List from 'react-toolbox/lib/list/List';
import ListItem from 'react-toolbox/lib/list/ListItem';
import ListDivider from 'react-toolbox/lib/list/ListDivider';
import ListSubHeader from 'react-toolbox/lib/list/ListSubHeader';
import IconButton from'react-toolbox/lib/button/IconButton';
import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';
import MdAdd from 'react-icons/lib/md/add';
import MdCancel from 'react-icons/lib/md/cancel';
import MdDone from 'react-icons/lib/md/done';
import MdSave from 'react-icons/lib/md/save';
import MdEdit from 'react-icons/lib/md/edit';

class ProjectBrowser extends React.Component {
    
    store = {    
        dataSelected: undefined,
        resultSelected: undefined,        
        collectionId: undefined,
        collection: undefined
      }
       
    collectionCallback(newId, newCollection) {        
        this.store.collectionId = newId; 
        this.store.collection = newCollection; 
    }      

    componentDidMount()
    {      
      globalStore.loadCollection(this.collectionCallback.bind(this));        
    }

    componentWillReceiveProps(nextProps) 
    {                    
        if (nextProps.collectionName) {         
            if (this.props.collectionName !== nextProps.collectionName) 
            {                            
                globalStore.loadCollection(this.collectionCallback.bind(this));            
            }
        }     
    }

    onResultSelect = (ind) => 
    {
        let resultId = this.store.collection[this.store.dataSelected]['resultIds'][ind]['id'];
        this.store.resultSelected = ind;
        this.props.onResultChange(resultId);
    }

    onDataSelect = (ind) => 
    {
        let dataId = this.store.collection[ind]['dataId'];
        let annotationId = this.store.collection[ind]['annotationId'];
        let dataSetId = this.store.collection[ind]['id'];
        this.store.dataSelected = ind; 
        this.store.resultSelected = undefined; 
        this.props.onResultChange(undefined);
        this.props.onDataChange(dataId, annotationId, dataSetId);
    }

    handleAddModel = () => 
    {
        /*
        if (this.props.annotationId) {
            let maxId = 0
            let aname = ''
            let acolor = ''
            console.log(this.store.classAnnotations)
            if (this.store.classAnnotations) {
                maxId = (this.store.classAnnotations.length>0) ?
                            (Math.max.apply(Math, this.store.classAnnotations.map(function(o){return o.id;})) + 1)
                            : 1
                aname = 'Class-' + maxId
                let colorId = (maxId-1) % DEFAULT_CLASS_COLORS.length
                acolor = DEFAULT_CLASS_COLORS[colorId]
            } else {
                this.store.classAnnotations = []
                maxId = 1
                aname = 'Background'
                acolor = DEFAULT_CLASS_COLORS[0]
            }
            
            this.store.classAnnotations.push( {id: maxId, name: aname, classColor: acolor });
            this.store.classAnnotationsSelected = undefined
            this.store.classEdit = false
            this.store.classDel = false

            globalStore.saveAnnotationClasses(this.store.classAnnotations)            
            this.props.onClassAnnotationChange(undefined, this.getMap(this.store.classAnnotations) )
        }        
        */
    }

    addExperiment = (item, ind) => 
    {                
        return( 
            <ListItem
                key={'e'+ind.toString()}                  
                onClick={this.onResultSelect.bind(this, ind)}
                caption={item.name}                    
                selectable
                rightIcon={
                    this.store.resultSelected === ind ?
                        <IconButton icon={<MdDone/>} /> : undefined
                        }                    
            />
        ); 
    }

    addDataset = (item, ind) => 
    {                       
        return( 
            <div>                    
                <ListSubHeader caption={item.name + ' : ' + item.desc}/>
                    <ListItem                        
                        key={'d'+ind.toString()}                  
                        onClick={this.onDataSelect.bind(this, ind)}
                        selectable ripple={false}
                        itemContent={<img src={this.store.collection[ind]['thumbnail']}/>}
                    />
                    {
                    this.store.dataSelected === ind ?
                        <ListItem caption='Models' selectable={false} ripple={false}                        
                                    rightIcon={<IconButton icon={<MdAdd/>} onClick={this.handleAddModel.bind(this)}/>}
                                    />
                        : undefined 
                    }
                    {
                       this.store.dataSelected === ind ?                        
                                this.store.collection[ind]['resultIds'] ?
                                this.store.collection[ind]['resultIds'].map(this.addExperiment)
                                : undefined
                            : undefined
                    }
                <ListDivider/>        
            </div>
        ); 
    } 
              

    render() {
        console.log("Render project browser")        
        return (
            <div>
                <List selectable ripple={false}>
                    { 
                        this.store.collection ?
                        this.store.collection.map(this.addDataset)
                        : undefined 
                    }
                </List>
            </div>
        );
    }
}

export default easyComp(ProjectBrowser)
