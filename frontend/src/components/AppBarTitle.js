import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    paddingTop: 2,
    display: 'inline'
  },
  title: {
    filter: 'drop-shadow(5px 5px 2px #222)',
    display: 'inline',
    padding: 0,
    margin: 0,
    // verticalAlign: 'top',
    ['@media (max-width:670px)']: {
      display: 'none'
    }
  },
  logo: {
    width: 120,
    // marginTop: -2,
    marginRight: 16,
    verticalAlign: 'bottom',
    marginBottom: 9,
    filter: 'drop-shadow(5px 5px 2px #222)',
    display: 'inline'
  }
}));

const getLogoSrc = () => {
  const host = window.location.hostname;
  return `https://storage.googleapis.com/dexmatrix-public/images/${host}/logo.png`;
  // return 'https://storage.googleapis.com/dexmatrix-public/images/matrix.mutantbr.com/logo.png'
  // return 'https://storage.googleapis.com/dexmatrix-public/images/matrix.dextra.com.br/logo.png'
}

const AppBarTitle = ({ children }) => {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <img className={classes.logo} src={getLogoSrc()} />
      <Typography variant="h6" className={classes.title} color="secondary">
        {children}
      </Typography>
    </section>
  );
};

AppBarTitle.propTypes = {
  children: PropTypes.node
};

AppBarTitle.defaultProps = {
  children: undefined
};

export default AppBarTitle;
