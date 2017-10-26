import React from 'react';
import Slider from 'react-toolbox/lib/slider/Slider';
import List from 'react-toolbox/lib/list/List';
import ListItem from 'react-toolbox/lib/list/ListItem';
import ListDivider from 'react-toolbox/lib/list/ListDivider';
import ListSubHeader from 'react-toolbox/lib/list/ListSubHeader';
import IconButton from'react-toolbox/lib/button/IconButton';
import MdDone from 'react-icons/lib/md/done';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';
import ListCheckbox from 'react-toolbox/lib/list/ListCheckbox';
import ExpandableAnnotations from './ExpandableAnnotations.js';
import ExpandableResults from './ExpandableResults.js';
import { SketchPicker } from 'react-color';
import {easyComp} from 'react-easy-state';
import globalStore from './Store.js';

class Tools extends React.Component {
    
    handleOptions = (opt) => 
    {
        console.log("local handler: " + opt)
        this.props.optionHandler(opt); 
    }
        
    render() {
        console.log("Render tools");
        return (
            <div>
                <List selectable ripple={false}>
                    <ListDivider/>
                    <ExpandableAnnotations                             
                            annotationId={this.props.annotationId}
                            classAnnotationId={this.props.classAnnotationId}                            
                            onClassAnnotationChange={this.props.onClassAnnotationChange} 
                            />
                    <ListDivider/>
                    <ExpandableResults
                            resultId={this.props.resultId} 
                            classResultId={this.props.classResultId} 
                            onClassResultChange={this.props.onClassResultChange} 
                            threshold={this.props.threshold}
                            onThreshChange={this.props.onThreshChange}        
                            />
                    <ListDivider/>
                    <ListSubHeader caption='Options' />
                    <ListCheckbox checked={this.props.options['layer']} 
                                  caption='Show layer control'
                                  onChange={this.handleOptions.bind(this, 'layer')}
                        />
                    <ListCheckbox checked={this.props.options['draw']} 
                                  caption='Show drawing tools'
                                  onChange={this.handleOptions.bind(this, 'draw')}
                        />
                </List>
            </div>
        );
    }
}

export default easyComp(Tools)
