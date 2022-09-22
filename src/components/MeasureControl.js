import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MeasureLineIcon from 'calcite-ui-icons-react/MeasureLineIcon';
import MeasureAreaIcon from 'calcite-ui-icons-react/MeasureAreaIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Measurement from "esri/widgets/Measurement";

import { useStore } from '../usestore';

const useStyles = makeStyles((theme) => ({
    measureButtonsContainer: {
        textAlign: 'center'
    },
    measureButtons: {
        margin: 10
    },
}));

const MeasureControl = ({view}) => {
    const nodeRef = React.createRef(); //
    const [selected, setSelected] = useState(0);
    const [state, actions] = useStore();

    const classes = useStyles();

    useEffect(() => {
        const measurement = new Measurement({
            view: view,
            areaUnit: 'acres',
            linearUnit: 'us-feet',
            container: document.getElementById('info')
        });
        actions.setSelectMeasure(measurement);
        return () => {
            if (!!state.measurement) {
                console.log('closed');
                state.measurement.container = null;
            }
        }
    }, []);

    useEffect(() => {
        if (state.measurement) {
            if (selected === 1) {
                state.measurement.activeTool = 'distance';
            } else if (selected === 2) {
                state.measurement.activeTool = 'area';
            } else {
                state.measurement.clear();
            }
        }
    }, [selected]);

    return (
        <React.Fragment>
            <div id='measurement' className={classes.measureButtonsContainer} ref={nodeRef}>
                <ButtonGroup className={classes.measureButtons} color="primary" aria-label="measure button group">
                    <Button key={1} onClick={() => setSelected(1)} variant={selected !== 1 ? "outlined" : "contained"} startIcon={<MeasureLineIcon size={16} />} >Line</Button>
                    <Button key={2} onClick={() => setSelected(2)} variant={selected !== 2 ? "outlined" : "contained"} startIcon={<MeasureAreaIcon size={16} />} >Area</Button>
                </ButtonGroup>
                <Button color="secondary" onClick={() => setSelected(0)} variant="contained" startIcon={<DeleteIcon size="small" />}>Clear</Button>
            </div>
            <div id='info'></div>
        </React.Fragment>
    )  
};

export { MeasureControl };