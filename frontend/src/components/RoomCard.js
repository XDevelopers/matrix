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
import clsx from "clsx";

const OPEN_ROOM_MILLIS = 30 * 60 * 1000;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#DDD',
    fontWeight: 'bold'
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
  },
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
  avatar: {
    "&:hover": {
      transform: "scale(1.7)"
    },
    border: '1px solid #444',
    filter: 'drop-shadow(3px 3px 2px #000)',
  },
  avatarInMeeting: {
    position: "relative",
    "&:hover": {
      transform: "scale(1.7)"
    },
    "&:after": {
      content: "''",
      position: "absolute",
      top: -2,
      left: -3,
      width: 46,
      height: 40,
      background: "url('/images/headset.svg')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat"
    }
  },
  actionButton: {
    color: '#BBB',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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

const RoomCard = (
  { name,
    style: styleStr,
    blink,
    start, users,
    currentUser,
    closed,
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
        {insideRoom && !closed && (
          <Button size="small" className={classes.actionButton} onClick={onCloseRoom}>
            Close
          </Button>
        )}
        {insideRoom && closed && (
          <Button size="small" className={classes.actionButton} onClick={onOpenRoom}>
            Open
          </Button>
        )}
        {!insideRoom && closed && (
          <Button size="small" className={classes.actionButton} onClick={onKnockRoom}>
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

  return (
    <Card className={classes.root}>
      <section className={classes.background} style={style}></section>
      <CardActionArea
        className={classes.contentAction}
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
              <Tooltip key={user.id} title={user.name}>
                <div
                  className={clsx({
                    [classes.avatarInMeeting]: user.inMeet
                  })}
                >
                  <Avatar className={classes.avatar} src={decodeURIComponent(user.imageUrl)} />
                </div>
              </Tooltip>
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
