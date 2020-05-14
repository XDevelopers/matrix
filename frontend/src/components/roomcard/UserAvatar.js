import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    avatar: {
        "&:hover": {
            transform: "scale(1.7)",
            zIndex: 100
        },
        border: '1px solid #444',
        filter: 'brightness(130%) drop-shadow(3px 3px 2px #000)',
    },
    avatarInMeeting: {
        position: "relative",
        "&:hover": {
            transform: "scale(1.7)",
            zIndex: 100
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
    }
}));

const UserAvatar = ({ user }) => {
    const classes = useStyles();
    return (
        <Tooltip key={user.id} title={user.name}>
            <div
                className={clsx({
                    [classes.avatarInMeeting]: user.inMeet
                })}>
                <Avatar className={classes.avatar} src={decodeURIComponent(user.imageUrl)} />
            </div>
        </Tooltip>
    )
}

UserAvatar.propTypes = {
    user: PropTypes.object
};

UserAvatar.defaultProps = {
};


export default UserAvatar;
