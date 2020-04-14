/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import ItemImage from "./ItemImage";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",

    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
      maxWidth: "100%"
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: 350,
      maxWidth: 350
    },

    marginBottom: theme.spacing(1)
  },

  cardAlwaysVisible: {
    display: "flex",
    flexDirection: "row"
  },

  cardLeft: {
    display: "flex",
    flexGrow: 0,
    justifyContent: "center",
    width: "100px",
    alignSelf: "center",
    textAlign: "center"
  },

  details_image_media: {
    height: "100px",
    width: "100px",
  },

  cardCenter: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,

    padding: 0,
    margin: `${theme.spacing(1)}px`
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: 0,
    paddingBottom: "0 !important",
  },

  cardMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 1,
  },

  cardIcons: {
    display: "flex",
    flexDirection: "column"
  },

  cardRight: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 0,

    width: "85px",
    minWidth: "85px",
    maxWidth: "85px",

    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,

    justifyContent: "center",
    textAlign: "center",

    borderRadius: "3px"
  },
  details_image_code: {
    display: "flex",
    alignSelf: "flex-end",
    justifySelf: "end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
    padding: "0px 4px",
    color: "white"
  },  
});

const intItemCard = ({ item, classes, theme }) => {
  console.debug(`[--- FC ---] Functional component: ItemCard - item=${item.id}`);

  const [toDetails, setToDetails] = React.useState(false);

  const handleClickForDetails = e => {
    setToDetails(true);
    e.stopPropagation();
  };

  if (toDetails === true) {
    // use Redirect push to keep the history (without the push, it replaces the url and does not keep the previous page)
    return <Redirect push to={`/details/${item.id}`} />;
  }

  return (
    <>
      <Card className={classes.card}>
        <div className={classes.cardAlwaysVisible}>
          <div className={classes.cardLeft}>
            <ItemImage
              item={item}
              style={{
                height: "100px",
                width: "100px",
              }}
            />
          </div>
          <div className={classes.cardCenter} onClick={handleClickForDetails}>
            <CardContent className={classes.cardContent}>
              <div className={classes.cardMain}>
                <Typography variant="h6">{item.__descriptionOrCategory}</Typography>
                <Typography color="textSecondary">
                  {item.__sizeInText}
                </Typography>
              </div>
              <Typography
                className={classes.details_image_code}
                color="textSecondary"
                component="p"
              >
                {item ? item.code : "-"}
              </Typography>
            </CardContent>
          </div>

          <div
            className={classes.cardRight}
            style={{
              backgroundColor:
                theme.palette.itemCard.cardBackgroundColor[
                  item.__cardBackgroundColor
                ]
            }}
            onClick={handleClickForDetails}
          >
            <Typography variant="h4" component="div">
              {item.__monthExpirationAsText}
            </Typography>
            <Typography component="div" gutterBottom>
              {item.__yearExpiration}
            </Typography>
          </div>
        </div>
      </Card>
    </>
  );
};

intItemCard.propTypes = {
  // Props from caller
  item: PropTypes.object.isRequired,

  // Props from other HOC
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(intItemCard);
