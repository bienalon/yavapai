import React, {useEffect, useRef, useMemo} from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import FeatureForm from "esri/widgets/FeatureForm";
import FeatureTemplates from "esri/widgets/FeatureTemplates";
import Polygon from "esri/geometry/Polygon";
import Search from "esri/widgets/Search";
import * as geometryEngine from "esri/geometry/geometryEngine";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Draw from 'esri/views/draw/Draw';
import SketchViewModel from 'esri/widgets/Sketch/SketchViewModel';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import NativeSelect from '@material-ui/core/NativeSelect';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useStore } from '../usestore';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    listHeading: {
        fontWeight: 'normal',
        marginTop: 20,
        marginBottom: 10,
        color: '#323232'
    },
    formButtons: {
        margin: theme.spacing(1),
        textAlign: 'center',
    },
    searchBar: {
        margin: 10,
        width: 'inherit !important',
        border: '1px solid rgba(110, 110, 110, .3)',
        // boxShadow: '0 1px 0 rgb(110 110 110 / 30%)'
    },
    orWrap: {
        textAlign: 'center',
        backgroundColor: '#e0e0e0',
        height: '1px',
        margin: '2em 1em',
        overflow: 'visible'
    },
    orText: {
        background: '#fff',
        lineHeight: 0,
        padding: '0 1em',
        position: 'relative',
        bottom: '0.75em'
    },
    editText1: {
        color: '#323232',
        fontFamily: 'Avenir Next',
        fontSize: '14px',
        fontWeight: 800,
        lineHeight: '1.3em',
        marginTop: 10,
        marginLeft: 10
    },
    editText2: {
        color: '#323232',
        fontFamily: 'Avenir Next',
        fontSize: '14px',
        fontWeight: 800,
        lineHeight: '1.3em',
        marginLeft: 10
    },
    editText3: {
        color: '#323232',
        fontFamily: 'Avenir Next',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '1.3em',
        marginLeft: 10
    },
    radioForm: {
        marginLeft: 10,
        marginBottom: 15
    },
    addFeature: {
        backgroundColor: 'aliceblue !important'
    },
    addForm: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 12,
        minWidth: 120,
        backgroundColor: '#f3f3f3',
    },
    selectService: {
        // maxWidth: '95%',
        // width: '95%',
        borderRadius: 0,
    },
    selectServiceInput: {
        borderRadius: 0,
        // padding: '5px 26px 5px 5px',
        border: '1px solid #ced4da',
        backgroundColor: '#fff',
        paddingLeft: 5,
        fontFamily: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
        fontSize: '0.85em',
    },
    serviceLabel: {
        fontSize: 14,
        fontFamily: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
        fontWeight: 400,
        lineHeight: 1.5,
        marginTop: 0,
    },
    tagsLabel: {
        fontSize: 14,
        fontFamily: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
        fontWeight: 400,
        lineHeight: 1.5,
        marginTop: 10,
    },
    esriText: {
        fontFamily: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
        fontSize: '0.85em',
        color: '#323232'
    },
    filterForm: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 10,
        marginBottom: 15,
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 10.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};

const EditControl = ({view, selectedEditLayer}) => {
    const nodeRef = React.createRef();

    const [open, setOpen] = React.useState(false);
    //const [selectedEditLayer, setSelectedEditLayer] = React.useState(null);
    const [searchLayer, setSearchLayer] = React.useState('Comments');
    const [templates, setTemplates] = React.useState(null);
    let [{editFeature, editAttFeature, highlight, graphicsLayer, featureForm, editFormState, attributes, point, searchWidget, radioValue, graphicFeature, sketch, editableLayers, projectAreaLayer}, 
        {setEditFeature, setEditAttFeature, setHighlight, setGraphicsLayer, setFeatureForm, setEditFormState, setAttributes, setPoint, setSearchWidget, setRadioValue, setGraphicFeature, setSketch, setEditableLayers, setProjectAreaLayer}] = useStore();

    const classes = useStyles();
    const theme = useTheme();

    const node = document.createElement("div");
    node.classList.add('bottom-center');
    node.setAttribute("id", "bottomButtons");

    // let projectAreaLayer = view.map.allLayers.find(function(layer) {
    //     return layer.title === "Comments";
    // });
    //setSelectedEditLayer(selectedEditLayer0);
    // Edit graphics layer
    const AddSketchGraphics = () => {
        let foundLayer = view.map.allLayers.find(function(layer) {
            return layer.title === "SketchLayer";
        });
        if (foundLayer == null || foundLayer == undefined) {
            view.map.add(sketchLayer);
        } else {
            sketchLayer = foundLayer;
        }
    };
    const ClearSketchGraphics = () => {
        let foundLayer = view.map.allLayers.find(function(layer) {
            return layer.title === "SketchLayer";
        });
        if (foundLayer != null) {
            //view.map.remove(foundLayer);
            foundLayer.removeAll();
        }
    };
    let graphicsLayer2;
    let sketchLayer = new GraphicsLayer({ title: 'SketchLayer', listMode: 'hide'});
    AddSketchGraphics();

    const handleSketchFinish = (event2) => {
        sketch.on("update", function(event) {
            if (event.state === "complete") {
                console.log("just completed update event");
                setPoint(event.graphics[0].geometry);
                ReactDOM.unmountComponentAtNode(node);
                view.ui.remove(node);
                node.innerHTML = "";
                setEditFormState('add-attributes');
                //view.map.remove(graphicsLayer2); 
                //ClearSketchGraphics();
            }
        });
        sketch.complete();
        view.whenLayerView(sketchLayer).then(function(layerView) { //graphicsLayer
            layerView.layer.graphics.forEach((graphic) => {
                setHighlight(layerView.highlight(graphic));
            });
        });
    };

    const BottomButtons = () => {
        return <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <ButtonGroup>
                    <Button size="small" color="secondary"
                    onClick={() => sketch.delete()} 
                    variant="contained" startIcon={<CancelIcon size={16} />} >Cancel</Button>
                    <Button size="small" color="secondary"
                    onClick={() => sketch.undo()} 
                    variant="contained" startIcon={<UndoIcon size={16} />} >Undo</Button>
                    <Button size="small" color="secondary"
                    onClick={() => sketch.redo()} 
                    variant="contained" startIcon={<RedoIcon size={16} />} >Redo</Button>
                    <Button size="small" color="primary"
                    onClick={handleSketchFinish} 
                    variant="contained" startIcon={<CheckCircleOutlineIcon size={16} />}>Finish</Button>
            </ButtonGroup>
        </div>
    };

    const BootstrapInput = withStyles((theme) => ({
        // root: {
        //   'label + &': {
        //     marginTop: theme.spacing(3),
        //   },
        // },
        input: {
            borderRadius: 0,
            //   position: 'relative',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            fontSize: 14,
            padding: '5px 26px 5px 5px',
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    }))(InputBase);

    let layer = selectedEditLayer;
    //layer.outFields = ["*"];
    //let templates = null;

    let fieldConfig = [
        {
            name: "comment",
            label: "Comment",
            maxLength: 500,
            editable: true,
            editorType: "text-area"
        },
        {
            name: "entity",
            label: "Source",
            maxLength: 50,
            editable: true,
        },
        {
            name: "author",
            label: "Author",
            maxLength: 80,
            editable: true,
        }
    ];

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleChange = (event) => {
        let foundLayer = view.map.allLayers.find(function(layer) {
            return layer.title === event.target.value;
        });
        if (foundLayer != null && foundLayer != undefined && templates != null) {
            setProjectAreaLayer(foundLayer);
            templates.layers = [foundLayer];
        }
        setSearchLayer(event.target.value);
    };

    const handleAddCancelButtonClick = (event, index) => {
        console.log("clicked add cancel button");
        unselectFeature();
        if (editFeature) {
            setEditFeature(null);
        }
        // if (graphicsLayer != null) {
        //     view.map.remove(graphicsLayer);
        // }
        ClearSketchGraphics();
        setEditFormState('add-template');
    };

    const handleEditCancelButtonClick = (event, index) => {
        console.log("clicked edit cancel button");
        unselectFeature();
        if (editAttFeature) {
            setEditAttFeature(null);
        }
        // if (graphicsLayer != null) {
        //     view.map.remove(graphicsLayer);
        // }
        ClearSketchGraphics();
        setEditFormState('add-template');
    };

    const handleAddButtonClick = (event, index) => {
        //unselectFeature();
        if (editFeature) {
            featureForm.submit();
            let values = featureForm.getValues();
            for (const fname in values) {
                editFeature.attributes[fname] = values[fname];
            }
            //editFeature.attributes.user_jobnumber = values.user_jobnumber;
            //editFeature.attributes["project_name"] = values["project_name"];

            // Setup the applyEdits parameter with adds.
            const edits = {
                addFeatures: [editFeature]
            };
            
            var query = selectedEditLayer.createQuery();
            query.where = "1 = 1";
            selectedEditLayer.queryFeatureCount(query)
            .then(function(event){
                console.log(event);
                selectedEditLayer.applyEdits(edits).then(function(editsResult){
                    if (editsResult.addFeatureResults.length > 0) {
                        let objectId;
                        objectId = editsResult.addFeatureResults[0].objectId;
                        console.log("added polygon oid is " + objectId);
                        console.log(graphicFeature);
                    }
                }).catch(function(error){
                    console.log(error);
                });
            });
        }
        // if (graphicsLayer != null) {
        //     graphicsLayer.graphics = [];
        //     view.map.remove(graphicsLayer);
        // }
        ClearSketchGraphics();
        setEditFormState('add-template');
    };

    const handleUpdateButtonClick = (event, index) => {
        unselectFeature();
        if (editAttFeature) {
            featureForm.submit();
            let values = featureForm.getValues();
            for (const fname in values) {
                editAttFeature.attributes[fname] = values[fname];
            }
            // Setup the applyEdits parameter with adds.
            const edits = {
                updateFeatures: [editAttFeature]
            };
            layer.applyEdits(edits).then(function(editsResult){
                if (editsResult.updateFeatureResults.length > 0) {
                    let objectId;
                    objectId = editsResult.updateFeatureResults[0].objectId;
                    console.log("updated oid is " + objectId);
                    layer.refresh();
                }
                //view.map.remove(graphicsLayer2);
            });
        }
        const foundLayer = view.map.allLayers.find(function(layer) {
            return layer.title === "SketchLayer";
        });

        view.map.remove(foundLayer);
        setEditFormState('add-template');
    };

    function unselectFeature() {
        if (highlight != null) {
          highlight.remove();
        }
    }


    useEffect(() => {
        layer = selectedEditLayer;
        if (editFormState === 'add-template') {
            let templates = new FeatureTemplates({
                layers: [selectedEditLayer],
                visibleElements: {
                    filter: false, // disable the default filter UI
                },
                container: document.getElementById("addFeatureDiv")//nodeRef.current
            });
            templates.on("select", function(evtTemplate) {
                    setAttributes(evtTemplate.template.prototype.attributes);
                    //view.container.style.cursor = "crosshair";
                    //graphicsLayer2 = new GraphicsLayer({ title: 'SketchLayer', listMode: 'hide'});
                    //view.map.add(graphicsLayer2);
                    let polygonSymbol1 = null;
                    if (evtTemplate.template.name == "Town of Star Valley") {
                        polygonSymbol1 = selectedEditLayer.renderer.uniqueValueInfos[0].symbol;
                    } else {
                        polygonSymbol1 = selectedEditLayer.renderer.uniqueValueInfos[1].symbol;
                    }
                    sketch = new SketchViewModel({
                        view: view,
                        layer: sketchLayer,//graphicsLayer2,
                        //polygonSymbol: polygonSymbol1,
                        defaultUpdateOptions: {
                            tool: "reshape"
                        }
                    });

                    sketch.create("polygon", {mode: "click"});
                    
                    sketch.on("create", function(event) {
                        if (event.state === "complete") {
                            console.log("just drew polygon");
                            sketch.update(event.graphic);
                            //view.graphics.add(event.graphic);
                            setPoint(event.graphic.geometry);
                            //setEditFormState('add-attributes');
                        }
                    });
                    sketch.on("update", function(event) {
                        if (event.state === "start") {
                            console.log("started updating polygon");
                            view.ui.add(node, 'manual');
                            ReactDOM.render(<BottomButtons />, node);
                        }
                        if (event.state === "active") {
                            //console.log("actively updating polygon");
                        }
                        // if (event.state === "complete") {
                        //     console.log("just completed update event 2");
                        // }
                    });
                    sketch.on("delete", function(event) {
                        console.log("just deleted polygon");
                        ReactDOM.unmountComponentAtNode(node);
                        view.ui.remove(node);
                        node.innerHTML = "";
                        //view.map.remove(graphicsLayer2);
                    });
                    setSketch(sketch);
            });
            
            setTemplates(templates);
        }
        if (editFormState === 'add-attributes') {
            let featureForm = new FeatureForm({
                layer: layer,
                container: document.getElementById("addFormDiv"),
                fieldConfig: fieldConfig,
                formTemplate: {
                    title: "Comments",
                    description: "Add or update features",
                    // elements: [
                    //     fieldConfig
                    // ]
                }
            });
            let obj = {};
            featureForm.fieldConfig.forEach(field => {
                obj[field.name] = attributes[field.name];
            });
            point.z = undefined;
            point.hasZ = false;
            // Create new feature
            editFeature = new Graphic({
                geometry: point,
                //symbol: layer.renderer.symbol,
                attributes: obj,
            });
            
            //view.map.add(graphicsLayer);
            view.whenLayerView(sketchLayer).then(function(layerView) { //graphicsLayer
                setHighlight(layerView.highlight(editFeature));
            });
            featureForm.feature = editFeature;
            setEditFeature(editFeature);
            setGraphicsLayer(sketchLayer); // graphicsLayer
            setFeatureForm(featureForm);
        }
        if (editFormState === 'edit-attributes') {
            let featureForm = new FeatureForm({
                layer: layer,
                container: document.getElementById("editFormDiv"),
                fieldConfig: fieldConfig
            });
            featureForm.feature = editAttFeature;
            //graphicsLayer2 = new GraphicsLayer({ title: 'SketchLayer', listMode: 'hide'});
            //view.map.add(graphicsLayer2);
            let polygonSymbol1 = null;
            if (editAttFeature.attributes["entity"] == "Town of Star Valley") {
                polygonSymbol1 = selectedEditLayer.renderer.uniqueValueInfos[0].symbol;
            } else {
                polygonSymbol1 = selectedEditLayer.renderer.uniqueValueInfos[1].symbol;
            }
            sketch = new SketchViewModel({
                view: view,
                layer: sketchLayer,//graphicsLayer2,
                //polygonSymbol: polygonSymbol1,
                defaultUpdateOptions: {
                    tool: "reshape"
                }
            });
            //editAttFeature.symbol = polygonSymbol1;
            sketchLayer.graphics.add(editAttFeature); //graphicsLayer2

            sketch.update(editAttFeature);
            view.whenLayerView(editAttFeature.layer).then(function(layerView) {
                //setHighlight(layerView.highlight(editAttFeature));
                //sketch.update(editAttFeature);
            });
            setFeatureForm(featureForm);
        }
    }, [editFormState]);

    return (
            <div>
                
            <div ref={nodeRef} >
                {editFormState === 'add-template' && 
                    <div>
                        <FormControl className={classes.filterForm} component="fieldset">
                            <InputLabel id="layer-select-label" className={classes.editText1}>Select Layer</InputLabel>
                            <Select
                                labelId="layer-select-label"
                                id="open-select"
                                className={classes.selectServiceInput}
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                defaultValue={searchLayer}
                                value={searchLayer}
                                onChange={handleChange}
                                >
                                    {editableLayers.length > 0 ? 
                                    editableLayers.map((item, index) => 
                                        <MenuItem key={index} value={item}>{item}</MenuItem>) :
                                        <Typography className={classes.editText1} >No editable layers</Typography>}
                                </Select>
                        </FormControl>
                        <Typography className={classes.editText1} >Add Comment:</Typography>
                        <br/>
                        <Typography className={classes.editText3} component="h6">Click template below to start drawing.</Typography>
                        <div className={classes.addFeature} id="addFeatureDiv" style={{display: 'block'}} />
                    </div> 
                    }
                {editFormState === 'add-attributes' && 
                    <div id="addAttrituesDiv" style={{display: 'block'}} >
                        <div id="addFormDiv" />
                        <div className={classes.formButtons}>
                            <Button variant="contained" color="secondary" style={{marginRight: 20}} onClick={handleAddCancelButtonClick}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleAddButtonClick}>
                                Add
                            </Button>
                        </div>
                    </div>}
                {editFormState === 'edit-attributes' &&
                    <div id="editFeatureDiv" style={{display: 'block'}} >
                    <div id="editFormDiv" />
                    <div className={classes.formButtons}>
                        <Button variant="contained" color="secondary" style={{marginRight: 20}} onClick={handleEditCancelButtonClick}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleUpdateButtonClick}>
                            Update
                        </Button>
                    </div>
                </div>}
                
            </div>
        </div>
    )  
}

export { EditControl };