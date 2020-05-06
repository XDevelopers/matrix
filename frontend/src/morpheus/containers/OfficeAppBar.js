import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import AppBarTitle from "../../components/AppBarTitle";
import MenuOffice from "../../components/MenuOffice";
import MenuAuth from "../../components/MenuAuth";
import {
  changeOfficeFilter,
  changeSystemSetting,
  toggleTheme,
  openLogoutConfirmDialog
} from "../store/actions";
import {
  selectOfficeFilter,
  selectCurrentUser,
  selectSystemSettings
} from "../store/selectors";
import {
  OfficeFilterPropType,
  SettingsPropType,
  CurrentUserPropType
} from "../store/models";

const useStyles = makeStyles(theme => ({
  logo: {
    width: 120,
    marginTop: 10,
    filter: 'drop-shadow(5px 5px 2px #222)'
  }
}));

const LOGO = "https://storage.googleapis.com/dexmatrix-public/images/logo-dextra.png";

const OfficeAppBar = ({
  onChangeOfficeFilter,
  onChangeSettings,
  onChangeTheme,
  onLogout,
  officeFilter,
  settings,
  currentUser
}) => {
  const classes = useStyles();
  return (
    <>
      <AppBarTitle><img className={classes.logo} src={LOGO} /></AppBarTitle>
      <MenuOffice
        filter={officeFilter}
        onChangeFilter={onChangeOfficeFilter}
        onChangeSettings={onChangeSettings}
        onChangeTheme={onChangeTheme}
        settings={settings}
      />
      <MenuAuth onLogout={onLogout} userName={currentUser.name} />
    </>
  );
}

OfficeAppBar.propTypes = {
  onChangeOfficeFilter: PropTypes.func,
  onChangeSettings: PropTypes.func,
  onChangeTheme: PropTypes.func,
  onLogout: PropTypes.func,
  officeFilter: OfficeFilterPropType,
  settings: SettingsPropType,
  currentUser: CurrentUserPropType
};

OfficeAppBar.defaultProps = {
  onChangeOfficeFilter: () => { },
  onChangeSettings: () => { },
  onChangeTheme: () => { },
  onLogout: () => { },
  officeFilter: {},
  settings: {},
  currentUser: {}
};

const mapStateToProps = state => ({
  officeFilter: selectOfficeFilter(state),
  currentUser: selectCurrentUser(state),
  settings: selectSystemSettings(state)
});

const mapDispatchToProps = {
  onChangeOfficeFilter: changeOfficeFilter,
  onChangeSettings: changeSystemSetting,
  onChangeTheme: toggleTheme,
  onLogout: openLogoutConfirmDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(OfficeAppBar);
