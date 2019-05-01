import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../../auth/Auth';
// import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CategoryForm from './CategoryForm';
import DetailsForm from './DetailsForm';
// import ContainerForm from './ContainerForm';
// import ContainerColorForm from './ContainerColorForm';
// import SizeForm from './SizeForm';
// import LocationForm from './LocationForm';
// import Results from './Results';
import StepWizard from 'react-step-wizard';
// import stringifyOnce from '../../utils/stringifyOnce.js'

const styles = theme => ({
  button: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },  
  divWizard: {
    marginTop: theme.spacing(2),
  },
});

const logAddWizard = log.getLogger('logAddWizard');
// loglevelServerSend(logAddWizard); // a setLevel() MUST be run AFTER this!
logAddWizard.setLevel('debug');
logAddWizard.debug('--> entering AddWizard.jsx');



class AddWizard extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
  }


  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      details: [],
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleArrayToggle = this.handleArrayToggle.bind(this)

  }

  // Set the received value in the state 
  // (replacing any existing one)
  handleChange = (change) => {
    const {name, value} = change;
    this.setState({[name]: value});
  }

  // Add the received value to the state value lists if it does not exist yet
  // If it already exists: remove it
  handleArrayToggle = (change) => {
    const {name, value} = change;
    const existingValues = this.state[name];
    const alreadyExists = existingValues.find(valueInList => valueInList === value);
    let newValues;
    if(alreadyExists){
      newValues = existingValues.filter(valueInList => valueInList !== value);
    } else {
      newValues = [...existingValues, value];
    }
    this.setState({[name]: newValues})    
  }


  onLogin() {
    this.props.auth.login();
  }

  render() {
    const { classes } = this.props;
    // const { isAuthenticated } = this.props.auth;
    // if (!isAuthenticated()) return (<LoginBanner auth={this.props.auth} />);

    return (
          <div className={classes.divWizard}>
            <StepWizard>
              <CategoryForm handleChange={this.handleChange} handleArrayToggle={this.handleArrayToggle} state={this.state} />
              <DetailsForm handleChange={this.handleChange} handleArrayToggle={this.handleArrayToggle} state={this.state} />
              {/* <ContainerForm handleChange={handleChange} handleArrayToggle={handleArrayToggle} state={state} />
              <ContainerColorForm handleChange={handleChange} handleArrayToggle={handleArrayToggle} state={state} />
              <SizeForm handleChange={handleChange} handleArrayToggle={handleArrayToggle} state={state} />
              <LocationForm handleChange={handleChange} handleArrayToggle={handleArrayToggle} state={state} /> */}
            </StepWizard>
          </div>
      );
  }
}

export default withStyles(styles, { withTheme: true })(AddWizard);







  