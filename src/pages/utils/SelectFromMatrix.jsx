import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import { withUserInfo } from '../../auth/withUserInfo';
import MatrixCard from './MatrixCard'
import { getIcon } from "../../data/Icons";



const styles = theme => ({
  layout: {
    display: "flex",
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: 'auto',
    padding: `${theme.spacing(2)}px 0`,
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
  },
});




const intSelectFromMatrix = ({ name = "", defaultIconName = "", items, itemInState, itemInStateIsAnArray, handleClick, classes, userInfo }) => (
  <div className={classes.layout}>
    {items && items.map((item) => {
      const nameItem = item.name[userInfo.language]
      const labelItem = item.label[userInfo.language]
      let iconItem = getIcon(name + item.id2)
      if(!iconItem) {
        iconItem = getIcon(defaultIconName)
      }
      return <MatrixCard 
        onClick={handleClick.bind(this, item.id2)} 
        selected={itemInStateIsAnArray ? itemInState.find(detail => detail === item.id2) !== undefined : itemInState === item.id2} 
        key={item.id2}      
        id={item.id2}
        name={nameItem}
        label={labelItem}
        icon={iconItem}
      />
    })}
  </div>
);

intSelectFromMatrix.propTypes = {
  name: PropTypes.string.isRequired,
  defaultIconName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  itemInState: PropTypes.oneOfType([PropTypes.string,PropTypes.number]), // can be null: nothing is pre-selected
  itemInStateIsAnArray: PropTypes.bool,
  handleClick: PropTypes.func,
  classes: PropTypes.object,
  userInfo: PropTypes.object,
}


export default withStyles(styles)(withUserInfo(intSelectFromMatrix));
