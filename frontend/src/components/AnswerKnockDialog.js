import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const AnswerKnockDialog = ({
  open,
  onClose,
  onConfirm,
  userName,
  roomName
}) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Someone is knocking {roomName}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Open the door for {userName}?
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
          Open
      </Button>
      </DialogActions>
    </Dialog>
  );

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
