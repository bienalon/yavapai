import React, { useRef, useEffect, useContext, useState } from "react";
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip";
import TableContainer from '@material-ui/core/TableContainer';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import LayersIcon from '@material-ui/icons/Layers';

import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AddIcon from '@material-ui/icons/Add';
import CommentIcon from '@material-ui/icons/Comment';
import LaunchIcon from '@material-ui/icons/Launch';
import DescriptionIcon from '@material-ui/icons/Description';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GridOnIcon from '@material-ui/icons/GridOn';
import MeasureIcon from 'calcite-ui-icons-react/MeasureIcon';
//import { FaRulerCombined } from 'react-icons/fa';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkOutlined';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';

import Keycloak from 'keycloak-js';

//import { useCookies } from 'react-cookie';
import { cookie, withCookies, Cookies } from 'react-cookie';
//import { toast } from 'react-toastify';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import GUHSDLogo from '../../public/assets/GrossmontHSDlogo.png';
import { WebMapView } from './WebMapView';
import { DrawerControl } from './DrawerControl';
import { FeatureTableControl } from './FeatureTableControl';
import { AboutControl } from './AboutControl';
import { useStore } from '../usestore';

const drawerWidth = 300;
const drawerWidthBottom = '50%';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        display: 'flex',
        flexDirection: 'row',
        background: '#818b6f'
    },
    appToolbarLeft: {
        flexGrow: 1,
    },
    appToolbarMiddle: {
        flexGrow: 1,
    },
    appToolbarRight: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarLink: {
        // flexGrow: 1,
        placeContent: 'flex-end',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    logo: {
        maxWidth: 200,
        maxHeight: 60,
        marginRight: 10,
        //backgroundColor: 'white'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%'
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
    content: {
        flexGrow: 1,
        height: "calc(100% - 64px)",
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    openBottomDrawerButton: {
        position: 'absolute',
        opacity: 0.5,
        bottom: 0,
        left: '50%',
        width: 90,
        height: 24,
        borderRadius: 0,
        zIndex: 100000,
    },
    bottomDrawer: {
        width: drawerWidthBottom,
        flexShrink: 1,
        //maxHeight: '50%',
    },
    tableContainer: {
        height: 'calc(100%)',
        overflow: 'hidden',
        // maxHeight: '50%',
    },
    tableToolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    closeTableButton: {
        padding: 5,
        height: 32,
        width: 32,
    },
    openBottomDrawerButton: {
        position: 'absolute',
        opacity: 0.5,
        bottom: 0,
        left: '50%',
        width: 90,
        height: 24,
        borderRadius: 0,
        zIndex: 100000,
    },
    fabBorder: {
        border: 'solid 2px white',
        margin: 5,
    },
    fabBorderSelect: {
        border: 'solid 4px yellowgreen',
        margin: 5,
    },
    paperDrawer: {
        height: drawerWidthBottom,
    },
    footer: {
        height: drawerWidthBottom,
    },
    title: {
        fontFamily: 'Times New Roman, serif',
        marginBottom: -10
    },
    loader: {
        zIndex: 100000,
        display: 'flex',
        background: '#fff',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 1,
        height: '100%',
        width: '100%'
    },
}));

export function Frame() {
    const classes = useStyles();
    const theme = useTheme();
    //const state = useGlobalState();
    const [state, actions] = useStore();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const cookies = new Cookies();

    const [auth, setAuth] = useState(false);

    //const [cookies, setCookies] = useCookies(['onboarded']);
    ///const { drawerOpen, setDrawerOpen, tableOpen, setTableOpen, rows, view, docLayer } = useContext(AppContext);
    //const [state, { loadSchoolFeatures, setSelectedSchool }] = useStore();

    theme.palette.primary.main = '#818b6f'//'#0080FF'; 
    theme.palette.secondary.main = '#0080FF'//'#0D99D7';
    const EditButton = () => {
        return <Fab color="secondary" aria-label="edit">
            <EditIcon />
        </Fab>
    };

    const initKeycloak = () => {
        var keycloak = new Keycloak('./keycloak.json');
        keycloak.init({
            onLoad: 'login-required',
            checkLoginIframe: false
        }).success(function (authenticated) {
            setAuth(authenticated);
            console.log(authenticated ? 'authenticated' : 'not authenticated');

        }).error(function (err) {
            setAuth(false);
            console.log('failed to initialize');
            console.log(err);
        });
    }

    // Local cookie management
    if (!(cookies.get('onboarded') || false)) {
        setSnackbarOpen(true);
        cookies.remove('onboarded', true, { path: '/' });
    }
    cookies.set('onboarded', true, { path: '/' });

    // Handlers
    const handleDrawerOpen = () => {
        //setOpen(true);
        actions.setDrawerOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarOpen(false);
      };

    useEffect(() => {
        console.log('drawer open status changed: ' + state.drawerOpen.toString());
    }, [state.drawerOpen]);

    useEffect(() => {
        //initKeycloak();
        // if (!(cookies.get('onboarded') || false)) {
        //     setSnackbarOpen(true);
        //     cookies.remove('onboarded', true, { path: '/' });
        // }
        // cookies.set('onboarded', true, { path: '/' });
        //setCookies('onboarded', true, { path: '/' });
        //actions.setCookies(cookies);
        //setSnackbarOpen(Boolean(cookies.onboarded));
    }, []);

    return (
        <React.Fragment>
        {/* {auth == false && 
            <div className={classes.loader}>
                <CircularProgress />
            </div>} */}
            {state.login == false && 
            <div className={classes.loader}>
                <CircularProgress />
            </div>}
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: state.drawerOpen,
                })}
            >
                <Toolbar className={classes.appToolbarLeft}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, state.drawerOpen && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src="images/logos/yavapai-nation-logo.png" alt="logo" className={classes.logo} />
                    <div className={classes.titleContainer}>
                        <Typography variant="h6" className={classes.title} noWrap>
                            Yavapai-Prescott Indian Tribe
                        </Typography>
                        <Typography variant="caption" noWrap>
                            Utilities
                        </Typography>
                    </div>
                    {/* <Toolbar className={classes.appToolbarMiddle}>
                    <Tooltip title="Add Project" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(0)} className={state.tabValue == 0 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="edit">
                                <AddIcon size={16} />
                            </Fab>
                        </Tooltip>
                    </Toolbar> */}
                    <Toolbar className={classes.appToolbarMiddle}>
                        <Tooltip title="Layer List" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(0)} className={state.tabValue == 0 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="layers">
                                <LayersIcon size={16} />
                            </Fab>
                        </Tooltip>
                        <Tooltip title="Legend" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(1)} className={state.tabValue == 1 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="legend">
                                <FormatListBulletedIcon size={16} />
                            </Fab>
                        </Tooltip>
                        
                        <Tooltip title="Measure" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(2)} className={state.tabValue == 2 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="measure">
                                <MeasureIcon size={16} />
                            </Fab>
                        </Tooltip>
                        <Tooltip title="Bookmarks" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(3)} className={state.tabValue == 3 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="bookmark">
                                <BookmarkOutlinedIcon size={16} />
                            </Fab>
                        </Tooltip>
                        {/* <Tooltip title="Add Comment" placement="bottom">
                            <Fab onClick={() => actions.setTabValue(4)} className={state.tabValue == 4 ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="edit">
                                <CommentIcon size={16} />
                            </Fab>
                        </Tooltip> */}
                        {/* <Tooltip title="Table" placement="bottom">
                            <Fab onClick={() => actions.setTableOpen(true)} className={state.tableOpen ? classes.fabBorderSelect : classes.fabBorder} color="secondary" size="small" aria-label="search">
                                <GridOnIcon size={16} />
                            </Fab>
                        </Tooltip> */}
                        <Tooltip title="Access Project Data" placement="bottom">
                            <Fab onClick={() => {
                                    window.open("https://share.rickengineering.com/apps/files/?dir=/AmazonS3/YPIT") //&fileid=434063
                                }} className={classes.fabBorder} color="secondary" size="small" aria-label="nextcloud">
                                <CloudDownloadIcon size={16} />
                            </Fab>
                        </Tooltip>
                    </Toolbar>
                    
                    
                    {/* <IconButton color="secondary" aria-label="edit">
                        <EditIcon />
                    </IconButton> */}
                    {/* <Tooltip title="Go to Sharepoint" placement="bottom">
                        <IconButton
                            color="inherit"
                            aria-label="go sharepoint"
                            edge="end"
                            onClick={() => {
                                window.open("https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration")
                            }}
                        >
                            <Typography style={{ marginRight: 5 }} variant="subtitle2">SharePoint</Typography>
                            <LaunchIcon />
                        </IconButton>
                    </Tooltip> */}
                    
                </Toolbar>
                <Toolbar className={classes.appToolbarRight}>
                    <Tooltip title="About" placement="bottom">
                        <IconButton
                            color='inherit'
                            aria-label="about"
                            edge="end"
                            onClick={() => {
                                actions.setAboutOpen(true)
                            }}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <DrawerControl />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: state.drawerOpen,
                })}
            >
                <div className={classes.drawerHeader} />
                <WebMapView />
            </main>
            
        </div>
        {/* <Button className={clsx(classes.openBottomDrawerButton, state.tableOpen && classes.hide)} onClick={() => actions.setTableOpen(true)} startIcon={<GridOnIcon style={{ height: '20px' }} />} variant="contained" color="default">Table</Button>
        <div id="bottom-drawer" className={clsx(state.tableOpen && classes.footer)}>
            <Drawer className={classes.bottomDrawer} 
            PaperProps={{ className: classes.paperDrawer } }
            //BackdropProps={{ style: { height: 300 } }}
            ModalProps={{container: document.getElementById("bottom-drawer")}} 
            anchor="bottom" variant='persistent' open={state.tableOpen} >
                <div className={classes.tableToolbar}>
                    <Tooltip title="Close table">
                        <IconButton className={classes.closeTableButton} onClick={() => actions.setTableOpen(false)} type="button" aria-label="clear">
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <Divider />
                <TableContainer className={classes.tableContainer}>
                    {state.view === null ? <div>Loading...</div> :
                        <FeatureTableControl view={state.view} />}
                </TableContainer>
            </Drawer>
        </div> */}
        <AboutControl />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success">
                Click on a scan location on the map.
            </Alert>
        </Snackbar>
        </React.Fragment>
    );
}