import React from 'react';
// import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import withMyTheme from '../withMyTheme';
import Auth from '../auth/Auth';
import Callback from '../auth/Callback';
import About from './About';
import MainAppBar from '../navigation/MainAppBar';
import Footer from '../navigation/Footer';
import MainPageContent from './MainPageContent';
import AddContainer from './AddContainer';
import Pusher from 'pusher-js';

//
// Auth init
//

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};



//
// Pusher socket init
//

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher('e5759208f6ccb0542038', {
  cluster: 'eu',
  forceTLS: true
});

const channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  alert(JSON.stringify(data));
});




const NotFound = () => <h2>404 error - This page has not been found!</h2>;


class App extends React.Component {

  render() {
    const divStyle = {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    };

    return (
      <Router>

        <div style={divStyle}>

          <MainAppBar auth={auth} />

          <Switch>
            <Route
              exact path="/callback"
              component={(props) => {
                handleAuthentication(props);
                return <Callback {...props} />;
              }}
            />
            <Route
              exact path="/add"
              component={props => <AddContainer auth={auth} {...props} />}
            />
            <Route
              exact path="/about"
              component={() => <About />}
            />
            <Route
              exact path="/"
              component={props => <MainPageContent auth={auth} {...props} />}
            />
            <Route
              exact path="*"
              component={NotFound}
              auth={auth}
            />
          </Switch>          

          <Footer />
        </div>
      </Router>
    );
  }
}

// App.propTypes = {
//     // auth: PropTypes.instanceOf(Auth).isRequired,
//     // classes: PropTypes.object.isRequired,
// };

export default withMyTheme(App);
