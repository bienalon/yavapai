import React, { useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Tooltip from "@material-ui/core/Tooltip";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import FeatureTable from "esri/widgets/FeatureTable";
import FeatureLayer from "esri/layers/FeatureLayer";
import * as watchUtils from 'esri/core/watchUtils';

import { useStore } from '../usestore';
import { ViewCompact } from '@material-ui/icons';

const { Parser } = require('json2csv');

const useStyles = makeStyles((theme) => ({
    zoomButton: {
        margin: 5
    },
    extentButton: {
        margin: 5,
        padding: 5,
        height: 30
    },
    tableContainer: {
        height: 'calc(100% - 42px)',
    },
    tableLayers: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 10,
        overflow: 'hidden',
        justifyContent: 'space-between',
        //width: '100%'
    },
    layerSwitch: {
        //
    },
    radioBlock: {
        marginLeft: 10
    }
}));

const FeatureTableControl = ({ view }) => {
    let nodeRef = useRef(null); //React.createRef();
    const classes = useStyles();
    const theme = useTheme();

    const [zoomButtonStatus, setZoomButtonStatus] = useState(true);
    const [filterExtent, setFilterExtent] = useState(false);
    const [layerNames, setLayerNames] = React.useState({'Existing Junctions': true, 'Existing Conduits': false, 'Comments': false});
    const [state, actions] = useStore();

    // Handlers
    const handleZoomTo = () => {
        const query = state.tableLayer.createQuery();
        // Iterate through the features and grab the feature's objectID
        const featureIds = state.tableFeatures.map(function (result) {
            return result.feature.getAttribute(state.tableLayer.objectIdField);
        });
        // Set the query's objectId
        query.objectIds = featureIds;
        // Make sure to return the geometry to zoom to
        query.returnGeometry = true;
        // Call queryFeatures on the feature layer and zoom to the resulting features
        state.tableLayer.queryFeatures(query).then(function (results) {
            if (results.features.length == 1) {
                view.goTo({target: results.features, zoom: 19});
            } else {
                view.goTo(results.features)
                .catch(function (error) {
                    if (error.name != "AbortError") {
                        console.error(error);
                    }
                });
            }
        });
    };

    const handleChange = (event) => {
        event.stopPropagation();
        actions.setTableSource(event.target.value);
        setFilterExtent(false); // Clear extent filter
        view.map.layers.forEach((flayer) => {
            if (flayer.type === "group") {
                flayer.layers.forEach((sublayer) => {
                    if (sublayer.type === "feature" && sublayer.title.toLowerCase() == event.target.value) {
                        state.tableLayer = sublayer;
                        //nodeRef.current.innerHTML = '';
                        state.featureTable.clearSelection();
                        state.featureTable.clearHighlights();
                        state.featureTable.container = null;
        
                        document.getElementById("feat-table").innerHTML = '';
                        state.tableFeatures = [];
                        createTable(event.target.value == "existing junctions" ? exJunctionsFieldConfigs : exConduitsFieldConfigs);
                        actions.setTableFeatures([]);
                        actions.setTableLayer(sublayer);
                    }
                });
            } else if (flayer.type === "feature" && flayer.title.toLowerCase() == event.target.value) {
                state.tableLayer = flayer;
                state.featureTable.clearSelection();
                state.featureTable.clearHighlights();
                state.featureTable.container = null;

                document.getElementById("feat-table").innerHTML = '';
                state.tableFeatures = [];
                createTable(commentsFieldConfigs);
                actions.setTableFeatures([]);
                actions.setTableLayer(flayer);
            }
        });
    };

    
    const features = [];
    const commentsFieldConfigs = [
        {
            name: "comment",
            label: "Comment",
            direction: "asc"
        },
        {
            name: "author",
            label: "Author"
        },
        {
            name: "entity",
            label: "Source"
        },
    ];
    const exJunctionsFieldConfigs = [
        {
            name: "dmpfacid",
            label: "DMP ID",
            direction: "asc"
        },
        {
            name: "jtype",
            label: "Junction Type"
        },
        {
            name: "invertelev",
            label: "Invert Elev"
        },
        {
            name: "rimelev",
            label: "Rim Elev"
        },
        {
            name: "depth",
            label: "Depth"
        },
        {
            name: "status",
            label: "Status"
        },
        {
            name: "ownership",
            label: "Ownership"
        },
        {
            name: "originown",
            label: "Origin Ownership"
        },
        {
            name: "ainvert",
            label: "Assume Invert Elev"
        },
        {
            name: "dmpcomm",
            label: "DMP Comment"
        },
        {
            name: "modeled",
            label: "Modeled"
        }
    ];
    const exConduitsFieldConfigs = [
        {
            name: "dmpfacid",
            label: "DMP ID",
            direction: "asc"
        },
        {
            name: "ctype",
            label: "Conduit Type"
        },
        {
            name: "inletelev",
            label: "Inlet Elev"
        },
        {
            name: "outletelev",
            label: "Outlet Elev"
        },
        {
            name: "geom1",
            label: "Diameter"
        },
        {
            name: "geom2",
            label: "Size"
        },
        {
            name: "width",
            label: "Width"
        },
        {
            name: "botwidth",
            label: "Bottom Width"
        },
        {
            name: "depth",
            label: "Depth"
        },
        {
            name: "dimension",
            label: "Dimension"
        },
        {
            name: "roughness",
            label: "Roughness "
        },
        {
            name: "xsection",
            label: "Cross Section"
        },
        {
            name: "barrels",
            label: "Barrels"
        },
        {
            name: "material",
            label: "Material"
        },
        {
            name: "slope",
            label: "Slope"
        },
        {
            name: "status",
            label: "Status"
        },
        {
            name: "ownership",
            label: "Ownership"
        },
        {
            name: "originown",
            label: "Origin Ownership"
        },
        {
            name: "ausinvert",
            label: "Assume Upstream Invert Elev"
        },
        {
            name: "adsinvert",
            label: "Assume Downstream Invert Elev"
        },
        {
            name: "amaterial",
            label: "Assume Material"
        },
        {
            name: "dmpcomm",
            label: "DMP Comment"
        },
        {
            name: "modeled",
            label: "Modeled"
        },
        {
            name: "zone",
            label: "Zone"
        },
        {
            name: "datrequest",
            label: "Data Request"
        }

    ];

    const createTable = (fieldConfigs) => {
        let featureTable = new FeatureTable({
            view: view,
            layer: state.tableLayer,
            container: document.getElementById("feat-table"), //nodeRef.current,
            fieldConfigs: fieldConfigs,
            menuConfig: {
                items: [{
                  label: "Export to CSV",
                  iconClass: "esri-icon-download",
                  clickFunction: function(event) {
                    //zoomToSelectedFeature();
                    const featureLayer = featureTable.layer;
                    const query = featureLayer.createQuery();
                    query.returnGeometry = false;
                    const fields = fieldConfigs.map(field => {
                        return field.name;
                    });
                    let fields2 = [];
                    fieldConfigs.forEach(field => {
                        fields2.push({label: field.label, value: field.name});
                    });
                    const json2csvParser = new Parser({ fields: fields2 });
                    query.where = featureLayer.definitionExpression;
                    query.outFields = fields;
                    featureLayer.queryFeatures(query).then(function(results) {
                        const rows = results.features.map(feature => {
                            return feature.attributes;
                        });
                        const csv = json2csvParser.parse(rows);
                        console.log(csv);
                        const fileName = featureLayer.title + '.csv' || 'export.csv';
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        if (navigator.msSaveBlob) { // IE 10+
                            navigator.msSaveBlob(blob, fileName);
                        } else {
                            const link = document.createElement("a");
                            if (link.download !== undefined) { // feature detection
                                // Browsers that support HTML5 download attribute
                                const url = URL.createObjectURL(blob);
                                link.setAttribute("href", url);
                                link.setAttribute("download", fileName);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }
                    });
                  }
                }]},
            visibleElements: {
                header: true,
                menu: true,
                menuItems: {
                    clearSelection: true,
                    refreshData: false,
                    toggleColumns: true
                }
            },
        });
        featureTable.on("selection-change", function(changes){
            // If the selection is removed, remove the feature from the array
            changes.removed.forEach(function (item) {
                const data = state.tableFeatures.find(function (data) {
                    return data.feature === item.feature;
                });
                if (data) {
                    state.tableFeatures.splice(state.tableFeatures.indexOf(data), 1);
                }
            });

            // If the selection is added, push all added selections to array
            changes.added.forEach(function (item) {
                const feature = item.feature;
                state.tableFeatures.push({
                    feature: feature
                });
            });
            // Enable or disable zoom to button
            
            if (state.tableFeatures.length > 0) {
                setZoomButtonStatus(false);
            } else {
                setZoomButtonStatus(true);
            }
            if (state.tableLayer.isTable) {
                setZoomButtonStatus(false);
            }
            actions.setTableFeatures(state.tableFeatures);
        });
        actions.setFeatureTable(featureTable);
    }
    
    useEffect(() => {
        view.map.layers.forEach((grouplayer) => {
            if (grouplayer.type === "group") {
                grouplayer.layers.forEach((flayer) => {
                    if (flayer.type === "feature" && flayer.title === "Existing Junctions") {
                        state.tableLayer = flayer;
                        actions.setTableLayer(flayer);
                        watchUtils.watch(flayer, "visible", () => {
                            setLayerNames(layerNames => ({...layerNames, 'Existing Junctions': flayer.visible}));
                            flayer.visible === true ? actions.setTableSource(flayer.title.toLowerCase()) : actions.setTableSource('Existing Conduits'.toLowerCase());
                        });
                    }
                    if (flayer.type === "feature" && flayer.title === "Existing Conduits") {
                        //state.tableLayer = flayer;
                        //actions.setTableLayer(flayer);
                        watchUtils.watch(flayer, "visible", () => {
                            setLayerNames(layerNames => ({...layerNames, 'Existing Conduits': flayer.visible}));
                            flayer.visible === true ? actions.setTableSource(flayer.title.toLowerCase()) : actions.setTableSource('Existing Junctions'.toLowerCase());
                        });
                    }
                });
            } else if (grouplayer.type === "feature" && grouplayer.title === "Comments") {
                //state.tableLayer = grouplayer;
                //actions.setTableLayer(grouplayer);
                watchUtils.watch(grouplayer, "visible", () => {
                    setLayerNames(layerNames => ({...layerNames, 'Comments': grouplayer.visible}));
                    grouplayer.visible === true ? actions.setTableSource(grouplayer.title.toLowerCase()) : actions.setTableSource('Comments'.toLowerCase());
                });
            }
        });
        createTable(exJunctionsFieldConfigs);
        return () => {
            if (!!state.featureTable) {
                state.featureTable.container = null;
            }
        }
    }, []);

    // useEffect(() => {
    //     if (layerNames["Existing Junctions"] === false && layerNames["Existing Conduits"] === false) {
    //         actions.setTableSource('Master Job List'.toLowerCase());
    //     }     
    // }, [layerNames]);

    useEffect(() => {
        if (filterExtent) {
            if (view.extent && state.featureTable != null && state.tableLayer != null) {
                state.featureTable.filterGeometry = view.extent;
            }
            // watchUtils.whenFalse(view, "updating", () => {
                
            // });
        } else {
            if (view.extent && state.featureTable != null && state.tableLayer != null) {
                state.featureTable.filterGeometry = null;
            }
            // watchUtils.whenFalse(view, "updating", () => {
                
            // });
        }
    }, [filterExtent]);

    useEffect(() => {
        console.log("table source changed");   
        return () => {
            if (!!state.tableSource) {
                //
            }
        }
    }, [state.tableSource]);

    return (
        <React.Fragment>
            <div className={classes.tableLayers}>
                <div className={classes.layerSwitch, classes.tableLayers}>
                    <Typography variant="body1" noWrap>
                        Choose Table Layer Source:
                    </Typography>
                    <FormControl className={classes.radioBlock} component="fieldset">
                        <RadioGroup row aria-label="layers" name="layer1" value={state.tableSource} onChange={handleChange}>
                            <FormControlLabel key={0} value="existing junctions" control={<Radio />} label="Existing Junctions" />
                            <FormControlLabel key={1} value="existing conduits" control={<Radio />} label="Existing Conduits" />
                            <FormControlLabel key={2} value="comments" control={<Radio />} label="Comments" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <ToggleButton className={classes.extentButton} value="extent" selected={filterExtent} onChange={() => setFilterExtent(!filterExtent)}>{filterExtent ? "Extent Filter On" : "Extent Filter Off"}</ToggleButton>
                    <Button className={classes.zoomButton} onClick={handleZoomTo} disabled={zoomButtonStatus} size="small" variant="outlined" color="primary" aria-label="zoom">
                        Zoom To Selected
                    </Button>
                </div>
            </div>
            <Divider/>
            <div id="feat-table" />
        </React.Fragment>
        
    )
}

export { FeatureTableControl };