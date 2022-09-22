import React, {useState, useEffect, useContext} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Search from "esri/widgets/Search";
import FeatureLayer from "esri/layers/FeatureLayer";

import { useStore } from '../usestore';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    filterForm: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 10,
        marginBottom: 15,
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    searchButton: {
        marginLeft: 'calc(50% - 50px)',
    },
}));

const FilterControl = ({ view }) => {
    const classes = useStyles();
    const nodeRef = React.createRef(); // useRef(null);
    const [state, actions] = useStore();
    const [searchLayer, setSearchLayer] = React.useState(1);
    const [searchText, setSearchText] = React.useState('');
    const [open, setOpen] = React.useState(false);

    let search;
    const masterJobListURL = "https://portal2.rickengineering.com/server/rest/services/Hosted/GeoRick_Projects_Table/FeatureServer/0";
    const projectPointsURL = "https://portal2.rickengineering.com/server/rest/services/Hosted/GeoRick_Projects_Service/FeatureServer/0";
    const projectOutlinesURL = "https://portal2.rickengineering.com/server/rest/services/Hosted/GeoRick_Projects_Service/FeatureServer/1";

    const table = new FeatureLayer({
        // URL to the service
        url: masterJobListURL,
        outFields: ["objectid", "recjob", "jobname", "clientname", "principal", "startdate", "jobdesc", "latitude", "longitude", "hasgeom"],
        title: "Master Job List"
    });

    const layer = new FeatureLayer({
        // URL to the service
        url: projectPointsURL,
        outFields: ["objectid", "rec_jobnumber", "project_name", "client"],
        title: "RICK Project"
    });

    const layerOutline = new FeatureLayer({
        // URL to the service
        url: projectOutlinesURL,
        outFields: ["objectid", "rec_jobnumber", "project_name", "client"],
        title: "RICK Project Outline"
    });


    const handleChange = (event) => {
        // if (event.target.value === "1") { // Master job list is 1
        //     table = new FeatureLayer({
        //         // URL to the service
        //         url: masterJobListURL,
        //         outFields: ["objectid", "recjobnumber", "name", "client", "pic_name ", "start_date ", "description"],
        //         title: "Master Job List"
        //     });
        // }
        setSearchLayer(event.target.value);
        if (event.target.value === 1) { // Master job list is 1
            actions.setTableLayer(table);
        } else if (event.target.value === 2) { // Rick job points 2
            actions.setTableLayer(layer);
        } else if (event.target.value === 3) { // Rick job outlines 2
            actions.setTableLayer(layerOutline);
        }
        console.log(state.tableLayer.title);
        
    };

    const handleTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handlePressEnter = (event) => {
        if(event.keyCode == 13) {
            handleButtonClick();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleButtonClick = (event) => {
        
        if (searchLayer === 1) {
            actions.setTableOpen(true);
            actions.setTableSource('master job list');
            if (state.tableLayer.title === "Master Job List") {
                state.tableLayer.definitionExpression = `LOWER(recjob) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(jobname) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(clientname) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(principal) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(manager) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(office) LIKE '%${searchText.toLowerCase()}%'`;
            }
            console.log(state.tableLayer.title);
        } else if (searchLayer === 2) {
            actions.setTableOpen(true);
            actions.setTableSource('rick project');
            if (state.tableLayer.title === "RICK Project") {
                state.tableLayer.definitionExpression = `LOWER(rec_jobnumber) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(client) LIKE '%${searchText.toLowerCase()}%'
                LOWER(project_name) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(tags) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(office) LIKE '%${searchText.toLowerCase()}%'
                LOWER(principal) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(project_manager) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(service) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(market) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(projecttype) LIKE '%${searchText.toLowerCase()}%'`
            }
            console.log(state.tableLayer.title);
        } else if (searchLayer === 3) {
            actions.setTableOpen(true);
            actions.setTableSource('rick project outline');
            if (state.tableLayer.title === "RICK Project Outline") {
                state.tableLayer.definitionExpression = `LOWER(rec_jobnumber) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(client) LIKE '%${searchText.toLowerCase()}%'
                LOWER(project_name) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(tags) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(office) LIKE '%${searchText.toLowerCase()}%'
                LOWER(principal) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(project_manager) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(service) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(market) LIKE '%${searchText.toLowerCase()}%' OR 
                LOWER(projecttype) LIKE '%${searchText.toLowerCase()}%'`;
            }
            console.log(state.tableLayer.title);
        }
        
        
    };

    useEffect(() => {
        // if (state.tableLayer.title === "Master Job List") {
        //     console.log("table layer changed to MJL");
        //     state.tableLayer.definitionExpression = `LOWER(recjobnumber) LIKE '%${searchText.toLowerCase()}%' OR LOWER(name) LIKE '%${searchText.toLowerCase()}%' OR LOWER(client) LIKE '%${searchText.toLowerCase()}%'`;
        //     actions.setTableOpen(true);
        //     actions.setTableSource('master job list');
        // } else if (state.tableLayer.title === "RICK Project") {
        //     console.log("table layer changed to Project Point");
        //     state.tableLayer.definitionExpression = `LOWER(rec_jobnumber) LIKE '%${searchText.toLowerCase()}%' OR LOWER(project_name) LIKE '%${searchText.toLowerCase()}%' OR LOWER(client) LIKE '%${searchText.toLowerCase()}%'`;
        //     actions.setTableOpen(true);
        //     actions.setTableSource('rick project');
        // } else if (state.tableLayer.title === "RICK Project Outline") {
        //     console.log("table layer changed to Project Outline");
        //     state.tableLayer.definitionExpression = `LOWER(rec_jobnumber) LIKE '%${searchText.toLowerCase()}%' OR LOWER(project_name) LIKE '%${searchText.toLowerCase()}%' OR LOWER(client) LIKE '%${searchText.toLowerCase()}%'`;
        //     actions.setTableOpen(true);
        //     actions.setTableSource('rick project outline');
        // }
        handleButtonClick();
        return () => {
            if (!!state.tableLayer) {
                //
            }
        }
    }, [state.tableLayer]);


    useEffect(() => {
        //runEffect();
        return () => {
            if (!!search) {
                console.log('closed');
                search.container = null;
            }
        }
    }, [nodeRef.current]);

    return ( 
        <React.Fragment>
            <div id='filter' ref={nodeRef}>
            <FormControl className={classes.filterForm} component="fieldset">
                <InputLabel id="layer-select-label">Select Layer</InputLabel>
                <Select
                    labelId="layer-select-label"
                    id="open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    defaultValue={searchLayer}
                    value={searchLayer}
                    onChange={handleChange}
                    >
                        <MenuItem value={1}>Master Job List</MenuItem>
                        <MenuItem value={2}>Project</MenuItem>
                        <MenuItem value={3}>Project Outline</MenuItem>
                    </Select>
                    
            </FormControl>
            <FormControl className={classes.filterForm} component="fieldset">
                {/* <Typography id="search-text-label">Search by job number, project name or client</Typography> */}
                <TextField id="outlined-basic" placeholder="Enter search term" variant="outlined" value={searchText} onChange={handleTextChange} onKeyDown={handlePressEnter} />
            </FormControl>
            <Button className={classes.searchButton} variant="contained" color="primary" onClick={handleButtonClick}>
                Search
            </Button>
            <div id="search-filter" />
            </div>
        </React.Fragment>
    )
}

export { FilterControl };