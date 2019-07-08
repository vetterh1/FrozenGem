
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { injectIntl, defineMessages } from "react-intl";
import { injectIntl } from "react-intl";
import ItemCard from './ItemCard'



// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1),
//   },
// }));


// const messages = defineMessages({ 
//   column_category: {
//     id: 'dashboard.category',
//     defaultMessage: 'Category',
//     description: 'Category',
//   },
//   column_expiration: {
//     id: 'dashboard.expiration',
//     defaultMessage: 'Expires',
//     description: 'Expires',
//   },
//   column_name: {
//     id: 'dashboard.name',
//     defaultMessage: 'Name',
//     description: 'Name',
//   },
//   column_code: {
//     id: 'dashboard.code',
//     defaultMessage: 'Code',
//     description: 'Code',
//   },
// });


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





const intItemsList = ({arrayItems, intl}) => {
  console.log('ItemsList arrayItems: ', arrayItems);

  return (
    arrayItems.map(item => <ItemCard  key={item.id} item={item} /> )
  );
}

export const ItemsList = injectIntl(withStyles(styles)(intItemsList));
