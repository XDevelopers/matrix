import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const KnockDialog = ({
  open,
  onClose,
  onConfirm,
  currentRoomName
}) => (
    open &&
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Knock the door</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Knock the door of {currentRoomName}?
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
          Knock
      </Button>
      </DialogActions>
    </Dialog>
  );

KnockDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  currentRoomName: PropTypes.string
};

KnockDialog.defaultProps = {
  open: false,
  onClose: undefined,
  onConfirm: undefined,
  currentRoomName: undefined
};

export default KnockDialog;
