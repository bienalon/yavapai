import React, {useEffect, useRef} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useStore } from '../usestore';

const useStyles = makeStyles((theme) => ({
    logo: {
        display: 'flex',
        flexGrow: 1,
        marginLeft: 'calc(50% - 70px)',
    },
}));

const AboutControl = () => {
    const classes = useStyles();
    const nodeRef = React.createRef();
    const [state, actions] = useStore();
    //const [open, setOpen] = React.useState(false);

    const handleAcceptButton = () => {
        actions.setAboutOpen(false);
    };
    const handleCancelButton = () => {
        actions.setAboutOpen(false);
    };

    const handleClickOpen = () => {
        actions.setAboutOpen(true);
    };

    const handleClose = () => {
        actions.setAboutOpen(true);
    };

    const descriptionElementRef = React.useRef(null);

    useEffect(() => {
        if (state.aboutOpen) {
          const { current: descriptionElement } = descriptionElementRef;
          if (descriptionElement !== null) {
            descriptionElement.focus();
          }
        }
      }, [state.aboutOpen]);

    return (
        <Dialog
        open={state.aboutOpen}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">About</DialogTitle>
        <DialogContent dividers={true}>
        <img src="images/globe.png" alt="logo" className={classes.logo} />
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <p>Web app description.</p>
            <p><em>This is a RICK developed web application by our GIS group. These 'web apps' are purpose built for your client or project, 
            please reach out to GIS to learn more.</em></p>
            <a href="https://www.ypit.com/" target="_blank">Yavapai-Prescott Indian Tribe</a>
            <br/>
            <a href="https://rickengineering.com/" target="_blank">Rick Engineering</a>
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            {/* <Button onClick={handleCancelButton} variant="contained" color="secondary">
                Cancel
            </Button> */}
            <Button onClick={handleAcceptButton} variant="contained" color="primary">
                Accept
            </Button>
        </DialogActions>
    </Dialog>
    )  
}

export { AboutControl };