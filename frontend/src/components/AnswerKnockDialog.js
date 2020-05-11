import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  highlight: {
    display: 'inline',
    fontWeight: 'bold'
  }
}));

const AnswerKnockDialog = ({
  open,
  onClose,
  onConfirm,
  userName,
  roomName
}) => {
  const classes = useStyles();
  return (
    open &&
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Knock Knock</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box component="span" className={classes.highlight} color="secondary.main">{userName}</Box> is knocking <Box component="span" className={classes.highlight} color="secondary.main">{roomName}</Box>'s door!
      </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
      </Button>
        <Button
          onClick={() => {
            onClose();
            onConfirm();
          }}
          color="primary"
          autoFocus
        >
          Open the door
      </Button>
      </DialogActions>
    </Dialog>
  );
}

AnswerKnockDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  userName: PropTypes.string,
  roomName: PropTypes.string
};

AnswerKnockDialog.defaultProps = {
  open: false,
  onClose: undefined,
  onConfirm: undefined,
  userName: undefined,
  roomName: undefined
};

export default AnswerKnockDialog;
