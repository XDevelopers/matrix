import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import UserAvatar from "./UserAvatar";

const OPEN_ROOM_MILLIS = 30 * 60 * 1000;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    backgroundColor: 'rgba(50, 50, 50, 0.4)',  
    color: '#DDD',
    fontWeight: 'bold',
    minHeight: 153
  },
  top: {
    minHeight: 153
  },
  inactive: {
    opacity: 0.2,
    // filter: 'grayscale(100%) blur(2px)',
    filter: 'grayscale(90%)',
    "&:hover": {
      opacity: 1,
      filter: 'grayscale(100%)',
      // boxShadow: '2px 2px 2px #111'
    }
  },
  active: {
    // backgroundColor: 'rgba(0, 0, 0, 0)',  
    // filter: 'brightness(120%)'
    // boxShadow: '2px 2px 2px #111'
  },
  name: {
    textShadow: ' 3px 3px 6px #000',
    marginTop: -5
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // opacity: .4,
    width: '100%',
    height: '100%'
  },
  contentAction: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    "&:hover $focusHighlight": {
      opacity: 0
    }
  },
  focusHighlight: {},
  content: {
    flex: 1
  },
  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 40px)",
    gridGap: 8
  },
  emptyUserSpace: {
    height: 0
  },
  actionButton: {
    color: '#CCC',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  closeButton: {
    color: '#FF0000',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    "&:hover": {
      backgroundColor: 'rgba(150, 0, 0, 0.2)'
    }
  },
  knockButton: {
    color: '#FFFF00',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    "&:hover": {
      backgroundColor: 'rgba(150, 150, 0, 0.2)'
    }
  },
  openButton: {
    color: '#00FF00',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    "&:hover": {
      backgroundColor: 'rgba(0, 150, 0, 0.2)'
    }
  },
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  blinker: {
    animationName: '$blinker',
    animationDuration: '2s',
    animationTimingFunction: 'jump-start',
    animationIterationCount: 'infinite'
  },
  timerComponent: {
    // fontSize: '1.2em',
    // fontFamily: "'Courier New', Courier, monospace",
    padding: 10,
    paddingLeft: 16,
    margin: 4,
    backgroundColor: 'rgba(0, 0, 0, .3)',
  }
}));

const parseStyle = (styleStr) => {
  if (!styleStr) {
    return {}
  }
  try {
    const defaults = {
      backgroundSize: 'cover',
      backgroundBlendMode: 'normal'
    }
    if (styleStr.startsWith('#')) {
      return Object.assign({}, defaults, { backgroundColor: styleStr });
    }
    if (styleStr.startsWith('http')) {
      return Object.assign({}, defaults, { backgroundImage: `url(${styleStr})` });
    }
    return Object.assign({}, defaults, JSON.parse(styleStr));
  } catch (err) {
    console.log('invalid style', styleStr, err);
    return {};
  }
}

const calculateTimeLeftMillis = (start) => +Date.parse(start) - +new Date();

const calculateTimeLeft = (start) => {
  const difference = calculateTimeLeftMillis(start);
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
  const c = (key) => {
    if (!timeLeft[key]) {
      return '';
    }
    return `${timeLeft[key]} ${timeLeft[key] > 1 ? key : key.substring(0, key.length - 1)}`;
  }

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

const rootClass = (classes, active, top) => {
  if (active) {
    if (top) {
      return `${classes.root} ${classes.active} ${classes.top}`;
    }
    return `${classes.root} ${classes.active}`;
  }
  return `${classes.root} ${classes.inactive}`;
}

const RoomCard = (
  { name,
    style: styleStr,
    blink,
    start, users,
    currentUser,
    closed,
    top,
    meetingEnabled,
    onEnterRoom,
    onCloseRoom,
    onOpenRoom,
    onKnockRoom,
    onEnterMeeting }) => {

  const [isExpanded, toggleExpand] = useState(false);
  const classes = useStyles();
  const userToShow = isExpanded ? users : users.slice(0, 3);
  const totalUsersHidden = users.length - userToShow.length;

  const style = parseStyle(styleStr);
  const insideRoom = users.filter(u => u.id === currentUser.id).length > 0;

  const RoomActions1 = () => {
    return (
      <CardActions>
        {!insideRoom && (
          <Button size="small" className={classes.actionButton} onClick={onEnterRoom}>
            Enter
          </Button>
        )}
        {meetingEnabled && (
          <Button size="small" className={classes.actionButton} onClick={onEnterMeeting}>
            Join meeting
          </Button>
        )}
      </CardActions>
    )
  }

  const RoomActions = () => {
    return (
      <CardActions>
        {insideRoom && !closed && !top && (
          <Button size="small" className={classes.closeButton} onClick={onCloseRoom}>
            Close
          </Button>
        )}
        {insideRoom && closed && !top && (
          <Button size="small" className={classes.openButton} onClick={onOpenRoom}>
            Open
          </Button>
        )}
        {!insideRoom && closed && !top && (
          <Button size="small" className={classes.knockButton} onClick={onKnockRoom}>
            Knock
          </Button>
        )}
        {!insideRoom && !closed && (
          <Button size="small" className={classes.actionButton} onClick={onEnterRoom}>
            Enter
          </Button>
        )}
        {meetingEnabled && (insideRoom || !closed) && (
          <Button size="small" className={classes.actionButton} onClick={onEnterMeeting}>
            Join meeting
          </Button>
        )}
      </CardActions>
    )
  }

  const RoomCountdown = ({ start }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(start));
    useEffect(() => {
      let mounted = true;
      setTimeout(() => {
        mounted && setTimeLeft(calculateTimeLeft(start));
      }, 1000);
      return () => mounted = false;
    });
    return (
      <div className={classes.timerComponent}>{countdownText(timeLeft)}</div>
    );
  }

  const isOpenCalendar = start && calculateTimeLeftMillis(start) < OPEN_ROOM_MILLIS;

  const active = users.length !== 0 || top;

  return (
    <Card className={rootClass(classes, active, top)}>
      <section className={classes.background} style={style}></section>
      <CardActionArea
        classes={{
          root: classes.contentAction,
          focusHighlight: classes.focusHighlight
        }}
        onClick={() => {
          toggleExpand(!isExpanded);
        }}
      >
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2" className={blink || isOpenCalendar ? classes.blinker : undefined}>
            <div className={classes.name}>{name}</div>
          </Typography>
          <div className={classes.userGrid}>
            {userToShow.map(user => (
              <UserAvatar user={user} />
            ))}
            {totalUsersHidden > 0 && (
              <Tooltip title={`more ${totalUsersHidden} users`}>
                <Avatar>{`+${totalUsersHidden}`}</Avatar>
              </Tooltip>
            )}
            {users.length === 0 && <div className={classes.emptyUserSpace} />}
          </div>
        </CardContent>
      </CardActionArea>
      {
        start && !isOpenCalendar ? <RoomCountdown start={start} /> : <RoomActions />
      }
    </Card>
  );
};

RoomCard.propTypes = {
  onEnterRoom: PropTypes.func,
  onEnterMeeting: PropTypes.func,
  meetingEnabled: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  style: PropTypes.string,
  blink: PropTypes.bool

};

RoomCard.defaultProps = {
  onEnterRoom: () => { },
  onEnterMeeting: () => { },
  meetingEnabled: true,
  users: [],
  name: "",
  style: undefined,
  blink: false
};

export default RoomCard;
