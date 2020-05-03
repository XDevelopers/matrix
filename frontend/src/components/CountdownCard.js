import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  contentAction: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  content: {
    flex: 1
  },
  timerComponent: {
    fontSize: '1.5em',
    fontFamily: "'Courier New', Courier, monospace"
  }
}));

const calculateTimeLeft = () => {
  const difference = +new Date("2020-05-03 17:30") - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;
};



const countdownText = (timeLeft) => {
  const c = (key) => `${timeLeft[key]} ${timeLeft[key] > 1 ? key : key.substring(0, key.length - 1)}`;

  const time = `${timeLeft['hours']}h${timeLeft['minutes']}m${timeLeft['seconds']}s`
  if (timeLeft['days']) {
    return `${c('days')} ${c('hours')}`
  }
  if (timeLeft['hours']) {
    return `${c('hours')} ${c('minutes')}`
  }
  if (timeLeft['minutes']) {
    return `${c('minutes')} ${c('seconds')}`
  }
  return c('seconds')
}

const ManageRoomsCard = () => {
  const classes = useStyles();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  return (
    <Card className={classes.root}>
      <CardActionArea
        className={classes.contentAction}>
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2">
            Calendar event
          </Typography>
          <span className={classes.timerComponent}>{countdownText(timeLeft)}</span>
        </CardContent>


      </CardActionArea>
    </Card>
  );
};


export default ManageRoomsCard;
