import React from 'react';
import Slider from 'react-toolbox/lib/slider/Slider';
import ListItem from 'react-toolbox/lib/list/ListItem';
import ListDivider from 'react-toolbox/lib/list/ListDivider';
import ListSubHeader from 'react-toolbox/lib/list/ListSubHeader';
import IconButton from'react-toolbox/lib/button/IconButton';
import MdDone from 'react-icons/lib/md/done';
import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';

class ExpandableResults extends React.Component {
    
    store = {    
        classResultSelected: undefined,
        classResults: undefined     
      };    
    
    classColor = ['#008F00', '#8F0000']

    classResultsCallback(newResults)
    {
        this.store.classResults = newResults
        this.store.classResultSelected = undefined   
        this.props.onClassResultChange(undefined);                 
    }

    componentWillReceiveProps(nextProps) 
    {            
        if (nextProps.resultId) {
            if (this.props.resultId !== nextProps.resultId) 
            {            
                globalStore.loadClassResults(this.classResultsCallback.bind(this))
            }
        } else {
            this.classResultsCallback(undefined)
        }
    }

    handleThreshChange = (value) => {        
        this.props.onThreshChange(value)        
    }

    handleClassResultChange = (ind) => {
        this.store.classResultSelected = ind  
        let classId = undefined
        if (ind >= 0) classId = this.store.classResults[ind]['_id']                
        this.props.onClassResultChange(classId);         
    }

    colorBlock = (myColor) => {
        return(
            <svg viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" style={ {stroke: myColor, fill: myColor} }/>         
            </svg>
        )
    }
    
    addClassResult = (item, ind) => {
        return(            
            <div>                
                <ListItem
                    selectable
                    leftIcon={<IconButton 
                                icon={this.colorBlock(this.classColor[ind])}                        
                                />}
                    rightIcon={ 
                        this.store.classResultSelected === ind ?
                        <IconButton icon={<MdDone/>} /> : undefined
                    }
                    caption={item.name}
                    onClick={this.handleClassResultChange.bind(this, ind)}                
                />
            </div>
        )
    }
        
    render() {
        console.log("Render result tools");        
        return (
            <div>
            <ListSubHeader caption='Result Images' />
            { 
                        this.store.classResults ?
                        this.store.classResults.map(this.addClassResult.bind(this))
                        : undefined 
            }
            <Slider min={0} max={255} step={1} 
                    value={255-this.props.threshold}
                    onChange={this.handleThreshChange.bind(this)}
                />                            
        </div>); 
    }
}

export default easyComp(ExpandableResults);


/*

            <div className="raster">
                { this.props.thresholds.map(this.addSlider) }                        
                 legend='You will receive a notification when a new one is published' 
            </div>                         
    addSlider = (item, ind) => {        
        console.log('Add slider ' + item + ' and ' + ind.toString());
        return(
            <Slider min={0} max={256} step={1} key={ind.toString()}
                value={item}
                onChange={this.handleThreshChange.bind(this, ind)} 
            />
        );
    }

            
*/