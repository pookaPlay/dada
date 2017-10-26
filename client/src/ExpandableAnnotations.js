import React from 'react';
import ListItem from 'react-toolbox/lib/list/ListItem';
import IconButton from'react-toolbox/lib/button/IconButton';
import Input from 'react-toolbox/lib/input/Input';
import MdAdd from 'react-icons/lib/md/add';
import MdCancel from 'react-icons/lib/md/cancel';
import MdDone from 'react-icons/lib/md/done';
import MdSave from 'react-icons/lib/md/save';
import MdEdit from 'react-icons/lib/md/edit';
import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';
import {DEFAULT_CLASS_COLORS} from './Store.js';
import MdDelete from 'react-icons/lib/md/delete';
import Compact from 'react-color/lib/components/compact/Compact.js';
import Slider from'react-toolbox/lib/slider/Slider';
//import Circle from 'react-color/lib/components/circle/Circle.js';

class ExpandableAnnotations extends React.Component {
    
    store = {            
        classAnnotations: undefined,
        classAnnotationSelected: undefined,        
        classDel: false,
        classEdit: false,        
        classEditName : '',
        classEditColor : '',
        widthSlider : 1
      }
        
    getMap = (cl) => {
        if (cl) {
            let classColors = {}        
            for(let i=0; i< cl.length; i++) {
                classColors[cl[i].id] = cl[i].classColor
            }
            return(classColors)
        } else return(undefined)
    }

    classAnnotationsCallback(newClassAnnotations)
    {
        this.store.classAnnotations = newClassAnnotations

        this.store.classAnnotationSelected = undefined
        this.store.classEdit = false
        this.store.classDel = false        
      
        this.props.onClassAnnotationChange(undefined, this.getMap(this.store.classAnnotations))

    }
    
    componentWillReceiveProps(nextProps) 
    {            
        if (nextProps.annotationId) 
        {
            if (this.props.annotationId !== nextProps.annotationId)
            {       
                globalStore.loadClassAnnotations(this.classAnnotationsCallback.bind(this))     
                return;
            }
        }        
    }

    handleClassAnnotationChange = (ind) => {
        if (ind >= 0) {                   
            this.store.classAnnotationSelected = ind
            //console.log("Selected " + this.store.classAnnotationSelected + " and " + this.store.classEdit) 
            this.store.classEdit = false            
            
            this.props.onClassAnnotationChange( this.store.classAnnotations[ind].id, 
                                                this.getMap(this.store.classAnnotations))
        } 
    }
       
    handleAddClass = () => 
    {           
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
            
            this.store.classAnnotations.push( {id: maxId, name: aname, classColor: acolor});
            this.store.classAnnotationsSelected = undefined
            this.store.classEdit = false
            this.store.classDel = false

            globalStore.saveAnnotationClasses(this.store.classAnnotations)            
            this.props.onClassAnnotationChange(undefined, this.getMap(this.store.classAnnotations) )
        }
    }
    
    handleInputChange = (name) => 
    {           
        this.store.classEditName = name
    }

    handleEditClass = (ind, e) => 
    {
        e.stopPropagation(); 
        this.store.classEdit = true
        this.store.classEditName = this.store.classAnnotations[ind].name.slice(0)
        this.store.classEditColor = this.store.classAnnotations[ind].classColor.slice(0)
    }

    handleDoneClass = (e) =>
    {
        e.stopPropagation(); 
        this.store.classDel = true        
    }

    handleDelClass = (ind, e) =>
    {
        e.stopPropagation(); 
        this.store.classAnnotationSelected = undefined
        this.store.classAnnotations.splice(ind, 1)        
        this.store.classDel = false
        globalStore.saveAnnotationClasses(this.store.classAnnotations)
        this.props.onClassAnnotationChange(undefined, this.getMap(this.store.classAnnotations) )
    }

    handleColorChange = (color) =>
    {
        this.store.classEditColor = color.hex
    }

    colorBlock = (myColor) => {
        return(
            <svg viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" style={ {stroke: myColor, fill: myColor} }/>         
            </svg>
        )
    }

    handleSaveClass = (ind) => 
    {
        this.store.classAnnotations[ind].name = this.store.classEditName.slice(0)
        this.store.classAnnotations[ind].classColor = this.store.classEditColor.slice(0)
        this.store.classEdit = false
        
        globalStore.saveAnnotationClasses(this.store.classAnnotations)
        this.props.onClassAnnotationChange( this.store.classAnnotations[ind].id, this.getMap(this.store.classAnnotations))            
    }
        
    handleCancelClass = (ind) => 
    {
        this.store.classEdit = false; 
    }
                 
    handleWidthSlider = (val) =>{
        this.store.widthSlider = val
    }

    renderClassAnnotation = (item, ind) => {        

        if (this.store.classAnnotationSelected === ind) {
              
            if (this.store.classEdit) {
                return(
                    <div>
                        <Input  type='text' label='Name' 
                                value={this.store.classEditName}                         
                                onChange={this.handleInputChange.bind(this)}                         
                                icon={<MdEdit/>}
                                />               
                        <div>    
                           <Compact
                                color={ this.store.classEditColor}
                                onChangeComplete={ this.handleColorChange.bind(this) }                                
                            />
                        </div>                    
                        <ListItem
                            selectable={false}
                            ripple={false}
                            caption=''                            
                            leftIcon={<IconButton icon={<MdSave/>} onClick={this.handleSaveClass.bind(this, ind)}/>}
                            rightIcon={<IconButton icon={<MdCancel/>} onClick={this.handleCancelClass.bind(this, ind)}/>}
                        />                        
                    </div>
                )
            } else {
                return(
                    <ListItem                         
                    caption={this.store.classAnnotations[ind].name}
                    leftIcon={<IconButton 
                        icon={this.colorBlock(this.store.classAnnotations[ind].classColor)}
                        onClick={ this.handleEditClass.bind(this, ind) } 
                        />}
                    onClick={this.handleClassAnnotationChange.bind(this, ind)}                 
                    rightIcon={<IconButton                        
                        icon = {this.store.classDel ? <MdDelete /> : <MdDone />}
                        onClick={ this.store.classDel ? this.handleDelClass.bind(this, ind) : this.handleDoneClass.bind(this) }
                        />} 
                    />                  
                )            
            }
        } else {
            return(                
                <ListItem                         
                    caption={this.store.classAnnotations[ind].name}
                    leftIcon={<IconButton 
                        icon={this.colorBlock(this.store.classAnnotations[ind].classColor)}                        
                        />}
                    onClick={this.handleClassAnnotationChange.bind(this, ind)}                 
                />                  
            )
        }
    }
         

    render() {
        console.log("Render annotation tools")
        //console.log(this.store.classAnnotations)
        return (
            <div>
                <ListItem caption='Annotations' selectable={false} ripple={false}                        
                        rightIcon={<IconButton icon={<MdAdd/>} onClick={this.handleAddClass.bind(this)}/>}
                        />
                
                {
                        this.store.classAnnotations ?
                        this.store.classAnnotations.map(this.renderClassAnnotation.bind(this))
                        : undefined 
                }                                
            </div>            
        );
    }
}


export default easyComp(ExpandableAnnotations);

//<p>Line width</p>
//<Slider min={1} max={20} editable value={this.store.widthSlider} onChange={this.handleWidthSlider.bind(this)} />
