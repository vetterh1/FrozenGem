/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Typography } from "@material-ui/core";
import config from "../../data/config";
import Picture from "./Picture";



const stylesItemCard = (theme) => ({

  cardPlusSeparation: {
    display: "flex",
    flexDirection: "column",

    [theme.breakpoints.down('xs')]: {
      flexBasis: `calc(100% - ${theme.spacing(2)}px)`,
      // Mobile / xs: No margin bottom, separation instead
    },
    [theme.breakpoints.up('sm')]: {
      flexBasis: `calc(50% - ${theme.spacing(2)}px)`,
      marginBottom: theme.spacing(5),
    },
    [theme.breakpoints.up('md')]: {
      flexBasis: `calc(33.33% - ${theme.spacing(2)}px)`,
      marginBottom: theme.spacing(5),
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: `calc(25% - ${theme.spacing(2)}px)`,
      marginBottom: theme.spacing(5),
    },

    marginRight: theme.spacing(2),

    height: "100%",
  },


  card: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down('xs')]: {
      // Mobile / xs : image on the left, text on the right
      flexDirection: "row",
    },
  },


  cardImage: {
    [theme.breakpoints.down('xs')]: {
      // Mobile / xs : image on the left, text on the right
      flexBasis: `calc(50% - ${theme.spacing(1)}px)`,
      marginRight: theme.spacing(2),
    },
    marginBottom: theme.spacing(3),
  },



  cardText: {
    display: "flex",
    flexDirection: "column",
    // flexGrow: 1,

    [theme.breakpoints.down('xs')]: {
      // Mobile / xs : image on the left, text on the right
      flexBasis: `calc(50% - ${theme.spacing(1)}px)`,
    },
  },

  cardMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // flexGrow: 1,
  },


  details_image_code: {
    display: "flex",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
    padding: "0px 4px",
    color: "white",
  },

  
  // Mobile / xs: display separation between cards
  separation: {
    [theme.breakpoints.up('sm')]: {
      display: "none",
    },    
    width: "100%",
    height: "1px",
    backgroundColor: "#dfe7e7",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },

});

const intItemCard = ({ 
  // From caller
  item, 
  // From other HOC
  classes, 
  intl 
}) => {
  // console.debug(`[--- FC ---] Functional component: ItemCard - item=${item.id}`);

  const [toDetails, setToDetails] = React.useState(false);


  const handleClickForDetails = (e) => {
    setToDetails(true);
    e.stopPropagation();
  };

  if (toDetails === true) {
    // use Redirect push to keep the history (without the push, it replaces the url and does not keep the previous page)
    return <Redirect push to={`/details/${item.id}`} />;
  }


  return (
    <div className={classes.cardPlusSeparation}>
      <div className={classes.card} onClick={handleClickForDetails}>
        <Picture
          imageUrl={item.pictureName ?`${config.staticUrl}/custom-size-image/${item.pictureName}` : null}
          imageAlt={item.__descriptionOrCategory}
          itemCategory={item.category}
          className={classes.cardImage}
          maxResolution={250}
        />      
        <div className={classes.cardText}>
          <div className={classes.cardMain}>
            <Typography gutterBottom variant="h4">{item.__descriptionOrCategory}</Typography>
            <Typography gutterBottom color="textSecondary">{item.__sizeInText}</Typography>
            <Typography gutterBottom color="textSecondary">{intl.formatMessage(item.__expirationText)}</Typography>
          </div>
          <Typography className={classes.details_image_code} color="textSecondary" component="p" >{item ? item.code : "-"}</Typography>
        </div>      
      </div>
      <div className={classes.separation} />
    </div>
  );
};

intItemCard.propTypes = {
  // Props from caller
  item: PropTypes.object,

  // Props from other HOC
  classes: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(stylesItemCard, { withTheme: true })(intItemCard));
