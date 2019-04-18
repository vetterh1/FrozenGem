import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Auth from '../auth/Auth';
import Callback from '../auth/Callback';
import About from './About';
import MainAppBar from '../navigation/MainAppBar';
import MainPageContent from './MainPageContent';
import AddContainer from './AddContainer';

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const NotFound = () => <h2>404 error - This page has not been found!</h2>;



const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});



class App extends React.Component {
  state = {
  };


  render() {
    const { classes } = this.props

    return (
      <Router>

        <MainAppBar auth={auth} />

        <div className={classes.root}>
          <Typography variant="h4" gutterBottom>
            Material-UI
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            example project
          </Typography>
        </div>
        <hr />

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>


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

      </Router>
    );
  }
}

App.propTypes = {
    // auth: PropTypes.instanceOf(Auth).isRequired,
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));




// import React, { Component } from 'react';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="">

//         <nav className="indigo darken-3" role="navigation">
//             <div className="nav-wrapper container">
//               <a id="logo-container" href="/" className="brand-logo"><i className="material-icons">ac_unit</i>FrozenGem</a>
//               <ul className="right hide-on-med-and-down">
//                 <li><a href="/">-</a></li>
//               </ul>
//               <ul id="nav-mobile" className="sidenav">
//                 <li><a href="/">-</a></li>
//               </ul>
//               <a href="/" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
//             </div>
//           </nav>

//         <div className="section no-pad-bot" id="index-banner">
//           <div className="container">
//             <h1 className="header center indigo-text text-darken-3">Frozen Gem</h1>
//             <div className="row center">
//               <h5 className="header col s12 light">Super simple system to add &amp; retreive your freezer content</h5>
//             </div>
//             <div className="row center">
//               <a href="http://materializecss.com/getting-started.html" id="download-button" className="btn-large waves-effect waves-light amber black-text">Get Started</a>
//             </div>
//           </div>
//         </div>


//         <div className="container">
//           <div className="section">

//             {/* <!--   Icon Section   --> */}
//             <div className="row">
//               <div className="col s12 l4">
//                 <div className="icon-block">
//                   <h2 className="center indigo-text text-darken-3"><i className="medium material-icons">ac_unit</i></h2>
//                   <h5 className="center indigo-text text-darken-3">Don't waste food</h5>
//                   <p className="light">Always know what you have in your freezer. You just need to use our simple tag system. Reminders will then tell you what to get out before it stays for too long.</p>
//                 </div>
//               </div>

//               <div className="col s12 l4">
//                 <div className="icon-block">
//                   <h2 className="center indigo-text text-darken-3"><i className="medium material-icons">access_time</i></h2>
//                   <h5 className="center indigo-text text-darken-3">Don't waste time</h5>
//                   <p className="light">Adding a produce will take you less than 30s. For the retreival, you've nothing to do! We'll be sending you reminders with proposals of what you should take.</p>
//                 </div>
//               </div>

//               <div className="col s12 l4">
//                 <div className="icon-block">
//                   <h2 className="center indigo-text text-darken-3"><i className="medium material-icons">note_add</i></h2>
//                   <h5 className="center indigo-text text-darken-3">Easy to work with</h5>
//                   <p className="light">We have worked hard to create a super simple process. A combination of easy to use app / page &amp; regular sticky notes makes adding or retreiving food a trivial task.</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//           <br /><br />
//         </div>

//         <footer className="page-footer amber lighten-3">
//           <div className="container">
//             <div className="row">
//               <div className="col l6 s12">
//                 <h5 className="black-text">Why?</h5>
//                 <p className="black-text text-lighten-4">This project was started out of despair. Despair everytime we discard food because we don't remember what it is, when it was added. Despair every other night when we don't know what to cook... even though we know we have put so many good homemade leftovers in the freezer... but not / badly labelled!</p>
//               </div>
//             </div>
//           </div>
//           <div className="footer-copyright">
//             <div className="container black-text text-lighten-3">
//             Made by <a className="black-text text-lighten-3" href="https://food-maniac.com/about">Laurent Vetterhoeffer</a>
//             </div>
//           </div>
//         </footer>

//       </div>
//     );
//   }
// }

// export default App;
