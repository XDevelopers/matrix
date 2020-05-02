import React, { useState } from "react";
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
  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 40px)",
    gridGap: 8
  },
  emptyUserSpace: {
    height: 0
  },
  avatarInMeeting: {
    position: "relative",
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
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  blinker: {
    animationName: '$blinker',
    animationDuration: '2s',
    animationTimingFunction: 'jump-start',
    animationIterationCount: 'infinite'
  }
}));

const parseStyle = (styleStr) => {
  try {
    return JSON.parse(styleStr);
  } catch (err) {
    console.log('invalid style', styleStr, err);
    return {};
  }
}

const cardNameColor = (style) => {
  const color = style.backgroundColor;
  if (!color) {
    return undefined;
  }
  return invertColor(color, true);
}

const cardButtonColor = (style) => {
  const color = style.backgroundColor;
  if (!color) {
    return 'primary';
  }
  return invertColor(color, true);
}

const padZero = (str, len) => {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

const invertColor = (hex, bw) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

const RoomCard = ({ name, style: styleStr, blink, users, meetingEnabled, onEnterRoom, onEnterMeeting }) => {
  const [isExpanded, toggleExpand] = useState(false);
  const classes = useStyles();
  const userToShow = isExpanded ? users : users.slice(0, 3);
  const totalUsersHidden = users.length - userToShow.length;

  const style = parseStyle(styleStr);

  return (
    <Card className={classes.root} style={style}>
      <CardActionArea
        className={classes.contentAction}
        onClick={() => {
          toggleExpand(!isExpanded);
        }}
      >
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2" className={blink ? classes.blinker : undefined} style={{ color: cardNameColor(style) }}>
            {name}
          </Typography>
          <div className={classes.userGrid}>
            {userToShow.map(user => (
              <Tooltip key={user.id} title={user.name}>
                <div
                  className={clsx({
                    [classes.avatarInMeeting]: user.inMeet
                  })}
                >
                  <Avatar src={decodeURIComponent(user.imageUrl)} />
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
      <CardActions>
        <Button size="small" style={{ color: cardButtonColor(style) }} onClick={onEnterRoom}>
          Enter room
        </Button>
        {meetingEnabled && (
          <Button size="small" style={{ color: cardButtonColor(style) }} onClick={onEnterMeeting}>
            Join meeting
          </Button>
        )}
      </CardActions>
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
