import React, { useState, useRef, useEffect, useContext } from "react";
// import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from "@material-ui/core/Tooltip";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/Add';
import CommentIcon from '@material-ui/icons/Comment';
import LayersIcon from '@material-ui/icons/Layers';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EditIcon from '@material-ui/icons/Edit';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkOutlined';
import MeasureIcon from 'calcite-ui-icons-react/MeasureIcon';
//import { FaRulerCombined } from 'react-icons/fa';
import SearchIcon from '@material-ui/icons/Search';

import { LayerListControl } from './LayerListControl';
import { LegendControl } from './LegendControl';
import { EditControl } from './EditControl';
import { MeasureControl } from './MeasureControl';
import TabPanel from './TabPanel';
import { useStore } from '../usestore';
import { BookmarksControl } from "./BookmarksControl";
import { FilterControl } from "./FilterControl";


const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 1,
    },
    drawerPaper: {
        width: drawerWidth,
        overflowY: 'hidden',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // height: 64,
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    tab: {
        width: 96,
    },
    tabPanel: {
        height: '100%',
    },
    listContainer: {
        marginTop: 0,
        paddingTop: 0,
        overflowY: 'auto',
    },
    hide: {
        display: 'none',
    },
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const DrawerControl = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    //const [tabValue, setTabValue] = useState(0);
    const [state, actions] = useStore();
    const { view, projectPointLayer, projectAreaLayer, drawerOpen, tabValue } = state;
    const { setDrawerOpen, setTabValue, setProjectAreaLayer } = actions;

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLayersOff = () => {
        if (view != null) {
            view.map.when(() => {
                view.map.layers.forEach((layer) => {
                    if (layer.type === "feature") {
                        layer.visible = false;
                    }
                });
            });
        }
    };

    // useEffect(() => {
    //     if (tabValue != null) {
    //         console.log(tabValue);
    //         setTabValue(tabValue);
    //     }
    // }, [tabValue]);
    // useEffect(() => {
    //     if (projectAreaLayer != null && view != null) {
    //         const foundLayer = view.map.allLayers.find(function(layer) {
    //             return layer.title === projectAreaLayer.title;
    //         });
    //         setProjectAreaLayer(foundLayer);
    //     }
    // }, [projectAreaLayer]);

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <Tabs
                value={tabValue}
                indicatorColor="primary"
                variant="scrollable"
                textColor="primary"
                onChange={handleTabChange}
                aria-label="disabled tabs example"
            >
                {/* <Tooltip title="List of schools" placement="top"><Tab className={classes.tab} icon={<SchoolIcon />} {...a11yProps(0)} /></Tooltip> */}
                <Tooltip title="Map layer list" placement="top"><Tab className={classes.tab} icon={<LayersIcon />} {...a11yProps(0)} /></Tooltip>
                <Tooltip title="Map legend" placement="top"><Tab className={classes.tab} icon={<FormatListBulletedIcon />} {...a11yProps(1)} /></Tooltip>
                <Tooltip title="Measure" placement="top"><Tab className={classes.tab} icon={<MeasureIcon />} {...a11yProps(2)} /></Tooltip>
                <Tooltip title="Bookmarks" placement="top"><Tab className={classes.tab} icon={<BookmarkOutlinedIcon />} {...a11yProps(3)} /></Tooltip>
                {/* <Tooltip title="Search" placement="top"><Tab className={classes.tab} icon={<SearchIcon />} {...a11yProps(5)} /></Tooltip> */}
                <Tooltip title="Add Comment" placement="top"><Tab className={classes.tab} icon={<CommentIcon />} {...a11yProps(4)} /></Tooltip>
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
                {view === null ? <div>Loading...</div> :
                    <div><div style={{ textAlign: 'center', margin: '5px 10px' }}></div><LayerListControl view={view} /></div>}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {view === null ? <div>Loading...</div> :
                    <LegendControl view={view} />}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                {view === null ? <div>Loading...</div> :
                    <MeasureControl view={view} />}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                {view === null ? <div>Loading...</div> :
                    <BookmarksControl view={view} />}
            </TabPanel>
            {/* <TabPanel value={tabValue} index={4}>
                {projectAreaLayer === null || view === null ? <div>Loading...</div> :
                    <EditControl view={view} selectedEditLayer={projectAreaLayer} />}
            </TabPanel> */}
            {/* <TabPanel className={classes.tabPanel} value={tabValue} index={5}>
                {view === null ? <div>Loading...</div> :
                    <FilterControl view={view} />}
            </TabPanel> */}
        </Drawer>
    );
};

export { DrawerControl };