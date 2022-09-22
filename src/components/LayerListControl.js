import React, {useEffect, useRef} from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import LayerList from "esri/widgets/LayerList";
import * as watchUtils from 'esri/core/watchUtils';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
    typography: {
        padding: theme.spacing(2),
    },
    formControl: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 12,
        width: 200,
        backgroundColor: '#f3f3f3',
    },
    form: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    applyButton: {
        margin: theme.spacing(1),
    }
}));

const LayerListControl = React.memo(({view}) => {
    const classes = useStyles();

    const nodeRef = useRef(); //React.createRef();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [fieldName, setFieldName] = React.useState('');
    const [fLayer, setLayer] = React.useState(null);
    const [fieldValue, setFieldValue] = React.useState('');
    const [domainList, setDomainList] = React.useState([]);
    const [openFieldName, setFieldNameOpen] = React.useState(false);
    const [openFieldValue, setFieldValueOpen] = React.useState(false);

    let layerList;
    useEffect(() => {
        //layerList.container = nodeRef.current;
        layerList = new LayerList({
            view: view,
            listItemCreatedFunction: function(event) {
                const item = event.item;
                if (item.layer.type != "group" && item.layer.type != "map-image") {
                    item.panel = {
                        content: "legend",
                        open: true
                    };
                } 
                if (item.title == "Water System" || item.title == "Basemap") {
                    item.open = true;
                }
            },
            container: nodeRef.current
        });
        // return () => {
        //     if (!!layerList) {
        //         layerList.container = null;
        //     }
        // }
    }, []);

    return (
        <React.Fragment>
            <div ref={nodeRef}/>
        </React.Fragment>
    )  
});

export { LayerListControl };