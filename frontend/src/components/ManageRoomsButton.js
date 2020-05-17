import React from "react";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Tooltip from "@material-ui/core/Tooltip";

function openSpreadsheet() {
  console.log('manage rooms');
  window.open("/gsuite/spreadsheet", "_blank")
}

function ManageRoomsButton() {
  return (
    <Tooltip title="Manage Rooms">
      <IconButton
        aria-label="Manage Rooms"
        aria-controls="menu-appbar"
        onClick={openSpreadsheet}>
        <AddCircleOutline />
      </IconButton>
    </Tooltip>
  );
}

ManageRoomsButton.propTypes = {
  spreadsheetId: PropTypes.string
};

export default ManageRoomsButton;
