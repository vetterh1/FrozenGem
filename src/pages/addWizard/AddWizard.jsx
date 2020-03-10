/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { itemsActions } from "../../_actions/itemsActions";
import { notifierActions } from "../../_actions/notifierActions";
import { characteristicsServices } from "../../_services/characteristicsServices";
import { Redirect } from "react-router";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import WizCharacteristicsSelection from "../utils/WizCharacteristicsSelection";
import WizTextOrDateSelection from "../utils/WizTextOrDateSelection";
import Stepper from "../utils/Stepper";
// import Results from "./Results";
import StepWizard from "react-step-wizard";

const styles = theme => ({
  button: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },
  divWizardPage: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto"
  },
  maxHeight: {
    display: "flex",
    flexGrow: 1
  },
  normalHeight: {
    display: "flex",
    flexGrow: 0
  }
});

const AddWizard = ({
  addItem,
  savePicture,
  addIntlNotifier,
  loggedIn,
  language,
  characteristics,
  intl,
  classes,
  history
}) => {
  const emptyItem = {
    id: null,
    category: null,
    categoryName: "",
    categoryDetails: [],
    detailsArray: [],
    container: null,
    containerName: "",
    containerColors: [],
    color: null,
    size: null,
    freezer: null,
    location: null,
    name: "",
    expirationDate: null,
    expirationInMonth: 0,
    pictureName: null,
    thumbnailName: null,
    code: null
  };
  const [item, setItemValues] = React.useState(emptyItem);
  // const [cameraDialogState, setCameraDialogState] = React.useState(false);

  const _resetState = () => setItemValues(emptyItem);

  const _handleChangeWithServerSave = async updates => {
    // First, save to get the code & id
    try {
      const itemUpdated = await addItem({ ...item, ...updates });
      console.debug("_handleChangeWithServerSave - itemUpdated ", itemUpdated);

      // Then update state with code & id generated by the server & locqtion!
      handleChange(
        { code: itemUpdated.code, id: itemUpdated.id, ...updates },
        false
      );
      // returns the id so the caller can go to this detailed page:
      return itemUpdated.id;
    } catch (error) {
      console.error("AddWizard._handleChangeWithServerSave error: ", error);
      addIntlNotifier("item.add.error", "error");
    }
    return null;
  };

  const handleBack = async (updates, updateServer = false) => {
    await handleChange(updates, updateServer);
    return 1;
  };

  const handleBackFromSize = async (updates, updateServer = false) => {
    await handleChange(updates, updateServer);
    return item.containerColors.length > 0 ? 1 : 2;
  };

  // Set the received value in the state
  // (replacing any existing one)
  const handleChange = async (updates, updateServer = false) => {
    // Update the item with the new values
    setItemValues({ ...item, ...updates });

    if (updateServer) {
      try {
        const itemUpdated = await itemsActions.updateItem(item.id, updates);
        handleChange({ code: itemUpdated.code });
      } catch (error) {
        console.error("AddWizard.handleChange error: ", error);
        addIntlNotifier("item.add.error", "error");
        return null;
      }
    }
    return 1;
  };

  const handleMultiselectionChange = name => async (
    updates,
    updateServer = false
  ) => {
    const updatedValue = updates[name];
    if (updatedValue) {
      const existingValues = item[name];
      console.debug("existingValues", existingValues);
      let alreadyExists = false;
      const undefinedExistingValues =
        !existingValues || existingValues === undefined;
      if (!undefinedExistingValues && existingValues.length > 0)
        alreadyExists = existingValues.find(
          valueInList => valueInList === updatedValue
        );

      // Add the received value to the state value lists if it does not exist yet
      // If it already exists: remove it (toggle action)
      let newValues;
      if (alreadyExists) {
        newValues = existingValues.filter(
          valueInList => valueInList !== updatedValue
        );
      } else {
        if (!undefinedExistingValues)
          newValues = [...existingValues, updatedValue];
        else newValues = [updatedValue];
      }
      await handleChange({ ...updates, [name]: newValues }, updateServer);
    }
    return null;
  };

  const handleNextFromCategory = async (updates, updateServer = false) => {
    let categoryDetails = [];
    let categoryName = "";

    // When category is selected, get it's details:
    const category = updates["category"];
    if (category) {
      categoryName = !characteristics.categories
        ? "item"
        : characteristics.categories
            .find(oneCategory => oneCategory.id2 === category)
            .name[language].toLowerCase();
      categoryDetails = characteristics.details.filter(detail =>
        detail.parents.find(
          oneParent => oneParent === "all" || oneParent === category
        )
      );
    }
    await handleChange(
      { ...updates, categoryName, categoryDetails },
      updateServer
    );
    return 1;
  };

  const handleDetailsChange = async (updates, updateServer = false) => {
    await handleMultiselectionChange("detailsArray")(updates, updateServer);
    return null;
  };

  //
  // Compute expiration date from now & category & details
  //
  const computeExpiration = () => {
    const defaultExpirationInMonths = characteristicsServices.getDefaultExpirationInMonths(
      item.category,
      item.detailsArray,
      characteristics
    );
    let expirationDateInDateForm = new Date();
    expirationDateInDateForm.setMonth(
      expirationDateInDateForm.getMonth() + defaultExpirationInMonths,
      1
    );
    console.debug(
      "computeExpiration - defaultExpirationInMonths: " +
        defaultExpirationInMonths +
        ", expirationDateInDateForm:",
      expirationDateInDateForm
    );

    return {
      expirationDate: expirationDateInDateForm.getTime(),
      expirationInMonth: defaultExpirationInMonths
    };
  };

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const getMonthsBetweenNowAndDate = dateInMs => {
    const diffInMonths = monthDiff(new Date(), new Date(dateInMs));
    console.debug("getMonthsBetweenNowAndDate diffInMonths:", diffInMonths);
    return diffInMonths;
  };

  const handleNextFromDetails = async (updateServer = false) => {
    const updatesComputed = computeExpiration();
    await handleChange({ ...updatesComputed }, updateServer);
    return 1;
  };

  const handleNextFromDateWithServerSave = async updates => {
    const expirationDateInMs = updates["expirationDate"];
    if (expirationDateInMs) {
      const monthsBetweenNowAndDate = getMonthsBetweenNowAndDate(
        expirationDateInMs
      );
      const id = await _handleChangeWithServerSave({
        expirationDate: expirationDateInMs,
        expirationInMonth: monthsBetweenNowAndDate
      });
      history.push(`/new/${id}`);
    }

    return null;
  };

  const handleNextFromContainer = async (updates, updateServer = false) => {
    let containerColors = [];
    let containerName = "";

    // If container changes, check if it has a color:
    const container = updates["container"];
    if (container) {
      containerName = !characteristics.containers
        ? "container"
        : characteristics.containers
            .find(oneContainer => oneContainer.id2 === container)
            .name[language].toLowerCase();
      containerColors = characteristics.colors.filter(color =>
        color.parents.find(oneParent => oneParent === container)
      );
    }

    await handleChange(
      { ...updates, containerName, containerColors },
      updateServer
    );
    return containerColors.length > 0 ? 1 : 2;
  };

  // Set the received value in the state
  // (replacing any existing one)
  const _savePicture = async (pictureData, thumbnailData) => {
    try {
      const itemUpdated = await savePicture(
        item.id,
        pictureData,
        thumbnailData
      );
      handleChange(
        {
          pictureName: itemUpdated.pictureName,
          thumbnailName: itemUpdated.thumbnailName
        },
        false
      );
      addIntlNotifier("camera.success", "success");
    } catch (error) {
      console.error("AddWizard.handleChange error: ", error);
      addIntlNotifier("camera.error", "error");
    }
  };

  if (!loggedIn) {
    console.debug("[>>> AddWizard ------>>>----- / >>>] Reason: not logged in");
    return <Redirect to="/" />;
  }

  console.debug("----------> item : ", item);

  return (
    <div className={classes.divWizardPage}>
      <StepWizard
        isHashEnabled
        transitions={{}}
        className={"flex-normal-height flex-direction-column"}
        classNameWrapper={"flex-normal-height flex-direction-column"}
        nav={<Stepper />}
      >
        <WizCharacteristicsSelection
          hashKey={"category"}
          name="category"
          title={intl.formatMessage({ id: "add.category.title" })}
          handleChange={handleNextFromCategory}
          items={characteristics.categories}
          preselectedItems={item.category}
          showNavigation
          backDisabled
        />
        <WizCharacteristicsSelection
          hashKey={"details"}
          name="detailsArray"
          title={intl.formatMessage(
            { id: "add.details.title" },
            { category: item.categoryName }
          )}
          handleChange={handleDetailsChange}
          handleNext={handleNextFromDetails}
          handleBack={handleBack}
          items={item.categoryDetails}
          preselectedItems={item.detailsArray}
          multiselection
          showNavigation
          defaultIconName={"category" + item.category}
        />
        <WizTextOrDateSelection
          hashKey={"name"}
          name="name"
          title={intl.formatMessage({ id: "add.name.title" })}
          help={intl.formatMessage({ id: "add.name.help" })}
          handleBack={handleBack}
          handleNext={handleChange}
          initialValue={item.name}
          showNavigation
        />
        <WizCharacteristicsSelection
          hashKey={"size"}
          name="size"
          title={intl.formatMessage({ id: "add.size.title" })}
          handleChange={handleChange}
          handleBack={handleBack}
          items={characteristics.sizes}
          preselectedItems={item.size}
          showNavigation
        />
        <WizCharacteristicsSelection
          hashKey={'container'}
          name='container'
          title={intl.formatMessage({id: 'add.container.title'})}
          handleChange={handleChange}
          handleBack={handleBack}
          items={characteristics.containers}
          preselectedItems={item.container}
          showNavigation
        />          
        {/* <WizCharacteristicsSelection
          hashKey={'color'}
          name='color'
          title={intl.formatMessage({id: 'add.color.title'}, {container: item.containerName})}
          handleChange={handleChange}
          handleBack={handleBack}
          items={item.containerColors}
          preselectedItems={item.color}
          showNavigation
        /> */}
        <WizTextOrDateSelection
          hashKey={"expirationDate"}
          name="expirationDate"
          isDate
          title={intl.formatMessage({ id: "add.date.title" })}
          help={intl.formatMessage({ id: "add.date.help" })}
          handleBack={handleBack}
          handleNext={handleNextFromDateWithServerSave}
          initialValue={item.expirationDate}
          showNavigation
        />
        {/* 

          <WizCharacteristicsSelection
            hashKey={'freezer'}
            name='freezer'
            title={intl.formatMessage({id: 'add.freezer.title'})}
            handleChange={handleChange}
            handleBack={handleBack}
            items={characteristics.freezers}
            preselectedItems={item.freezer}
            showNavigation
          />
          <WizCharacteristicsSelection
            hashKey={'location'}
            name='location'
            title={intl.formatMessage({id: 'add.location.title'})}
            handleChange={_handleChangeWithServerSave}
            handleBack={handleBack}
            items={characteristics.locations}
            preselectedItems={item.location}
            showNavigation
          />     
        <Results
          hashKey={"results"}
          item={item}
          onResetState={_resetState}
          handleAddPicture={_savePicture}
        />
      */}
      </StepWizard>
    </div>
  );
};

function mapStateToProps(state) {
  const {
    user: { loggedIn, language },
    characteristics
  } = state;
  return {
    loggedIn,
    language,
    characteristics
  };
}

const mapDispatchToProps = {
  addItem: itemsActions.addItem,
  savePicture: itemsActions.savePicture,
  addIntlNotifier: notifierActions.addIntlNotifier
};

const connectedAddWizard = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddWizard);

export default withRouter(
  injectIntl(withStyles(styles, { withTheme: true })(connectedAddWizard))
);
