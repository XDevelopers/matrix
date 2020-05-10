import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ProfileIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  profileName: {
    ['@media (max-width:600px)']: {
      display: 'none'
    }    
  },
  profileIcon: {
    ['@media (min-width:600px)']: {
      display: 'none'
    }    
  }
}));


const MenuAuth = ({ onLogout, userName }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={classes.profileIcon}>
        <Tooltip title="Profile">
          <IconButton
            aria-label="Profile"
            aria-controls="menu-appbar"
            onClick={event => setAnchorEl(event.currentTarget)}>
            <ProfileIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.profileName}>
        <Button
          color="inherit"
          onClick={event => setAnchorEl(event.currentTarget)}
        >
          {userName}
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

MenuAuth.propTypes = {
  userName: PropTypes.string,
  onLogout: PropTypes.func
};

MenuAuth.defaultProps = {
  userName: "",
  onLogout: () => { }
};

export default MenuAuth;
