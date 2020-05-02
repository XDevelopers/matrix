import React from "react";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import AddBox from "@material-ui/icons/AddBox";
import Tooltip from "@material-ui/core/Tooltip";

const spreadsheetId = '1bYvuKaxKEytwBOqwEFVf4iDkkTtO2Dvk4GsmJKlhcwQ';

function openSpreadsheet() {
  console.log('manage rooms', spreadsheetId);
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
  window.open(url, "_blank")
}

function ManageRoomsButton() {
  return (
    <Tooltip title="Manage Rooms">
      <IconButton
        aria-label="Manage Rooms"
        aria-controls="menu-appbar"
        onClick={openSpreadsheet}>
        <AddBox />
      </IconButton>
    </Tooltip>
  );
}

ManageRoomsButton.propTypes = {
  spreadsheetId: PropTypes.string
};

export default ManageRoomsButton;
