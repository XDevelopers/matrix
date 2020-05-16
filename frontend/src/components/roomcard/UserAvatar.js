import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhoneForwardedIcon from "@material-ui/icons/PhoneForwarded";

import clsx from "clsx";

const useStyles = makeStyles(() => ({
    title: {
        fontSize: '1.4em',
        textAlign: 'center',
        margin: 10
    },
    actions: {
        marginTop: 10
    },
    avatarScale: {
        transform: "scale(1.7)",
        zIndex: 100
    },
    avatar: {
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

const useTooltipClasses = makeStyles(() => ({
    tooltip: {
        margin: "2px",
        backgroundColor: '#444',
        boxShadow: '-3px 3px 0px rgba(0, 0, 0, 0.15)'
    }
}));

const TooltipTitle = ({ name }) => {
    const classes = useStyles();

    return (
        <section className={classes.title}>
            <div>{name}</div>
            {/* <div className={classes.actions}>
                <IconButton>
                    <PhoneForwardedIcon />
                </IconButton>
            </div> */}
        </section>
    );
};

const UserAvatar = ({ user }) => {
    const classes = useStyles();
    const tooltipClasses = useTooltipClasses();

    const avatarRef = React.createRef();

    const onOpen = () => {
        avatarRef.current.classList.add(classes.avatarScale);
    }

    const onClose = () => {
        avatarRef.current.classList.remove(classes.avatarScale);
    }

    return (
        <Tooltip title={<TooltipTitle name={user.name} />} classes={tooltipClasses} arrow="top" interactive onOpen={onOpen} onClose={onClose}>
            <div ref={avatarRef}
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
