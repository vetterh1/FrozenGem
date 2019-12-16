/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions/userActions';

import { Link } from 'react-router-dom';
import { FormattedMessage } from "react-intl";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LoginInBar from '../navigation/LoginInBar';
import MenuNav from './MenuNav';
import { NavigationStyle } from './configNavigation'


const styles = theme => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  toolbarTitle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  margin: {
    margin: theme.spacing(1, 1.5),
  },
});


class Header extends React.Component {

  render() {
    const { classes, loggedIn, language, navigationStyle, setLanguage } = this.props;
    if(!language) return null;

    return (
      <AppBar position="static" color="primary" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar} disableGutters>
          <Button color="inherit" component={Link} to="/" className={classes.toolbarTitle}>
            <Typography variant="body1" color="inherit" noWrap>
              <FormattedMessage id="header.title" />
            </Typography>
          </Button>
          {!loggedIn &&
            <nav>
              {language === "fr" && 
                <Button color="secondary" onClick={e => setLanguage("en")}>
                  EN
                </Button>
              }
              {language === "en" &&
                <Button color="secondary" onClick={e => setLanguage("fr")}>
                  FR
                </Button>
              }
            </nav>
          }

          {loggedIn && navigationStyle === NavigationStyle.NAVIGATION_TOOLBAR && 
            <MenuNav />
          }

          <LoginInBar userInfo={this.props.userInfo} />
        </Toolbar>
      </AppBar>
    );
  }
}



function mapStateToProps(state) {
  const { user: { loggedIn, language, navigationStyle } } = state;
  return {
    loggedIn,
    language,
    navigationStyle
  };
}

const mapDispatchToProps = {
  setLanguage: userActions.setLanguage,
};

const connectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default withStyles(styles)(connectedHeader);
