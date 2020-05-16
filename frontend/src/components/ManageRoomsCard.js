import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "gray",
    borderStyle: "dashed",
    borderColor: "#666",
    borderWidth: 2
  },
  contentAction: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    fontSize: 60,
    color: "#ccc"
  }
}));

const spreadsheetId = '1bYvuKaxKEytwBOqwEFVf4iDkkTtO2Dvk4GsmJKlhcwQ';

function openSpreadsheet() {
  console.log('manage rooms', spreadsheetId);
  window.open("/gsuite/spreadsheet", "_blank")
}

const ManageRoomsCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={classes.contentAction}
        onClick={openSpreadsheet}
      >
        <AddIcon className={classes.icon} />
      </CardActionArea>
    </Card>
  );
};


export default ManageRoomsCard;
