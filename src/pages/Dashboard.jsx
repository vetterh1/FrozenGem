import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box'; // ! must be at the end of the material-ui imports !
import Typography from '@material-ui/core/Typography';
// import { FormattedMessage } from 'react-intl.macro';
import { injectIntl, FormattedMessage } from "react-intl";
import { withStyles } from '@material-ui/core/styles';
import { withUserInfo } from '../auth/withUserInfo';
import { withItems } from '../auth/withItems';
import { ItemsList } from './utils/ItemsList'
import Filters from './Filters'



const styles = theme => ({
  layout: {
    width: 'auto',
    padding: `${theme.spacing(2)}px 0`,
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  largeIcon: {
    width: 48,
    height: 48,
    marginBottom: theme.spacing(2),
  },
});





class Dashboard extends React.Component {
  static propTypes = {
    userInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {arrayItems:[], arrayFilters:[]};

    this.onFilterChange = this.onFilterChange.bind(this);
  }



  getItems = async () => {
    const {items, userInfo} = this.props;

    const result = await items.get(userInfo.accessToken);
    if(!result) {
      console.error('ItemsList: could not retrieve items' );
    }
    // console.log('ItemsList data: ', result.data);
    this.setState({arrayItems: result.data});
  }

  componentDidMount() {
    this.getItems();
  }


  onFilterChange = (arrayFilters) => {
    this.setState({filters: arrayFilters});
  }


  render() {
    const { classes, userInfo } = this.props;
    const { arrayItems, arrayFilters } = this.state;

    if(arrayItems.length === 0) return null;

    return (
      <React.Fragment>

        <Box mt={5} display="flex" flexDirection="column" >
          <Typography component="h1" variant="h4" color="primary" align="center" gutterBottom>
            <FormattedMessage id="dashboard.title" defaultMessage="Your dashboard" />
          </Typography>
          <Typography variant="h6" align="center" gutterBottom >
            <FormattedMessage id="dashboard.subtitle" defaultMessage="Here is what you have in your freezer" />
          </Typography>
        </Box>

        <div className={classes.layout}>
          <Filters language={userInfo.language.toUpperCase()} onFilterChange={this.onFilterChange} />
          <ItemsList arrayItems={arrayItems} arrayFilters={arrayFilters} />
        </div>          

      </React.Fragment>
    );
  }
}

export default injectIntl(withItems(withUserInfo(withStyles(styles)(Dashboard))));