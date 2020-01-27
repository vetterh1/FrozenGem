import React from "react";
import PropTypes from "prop-types";
import { WizNavBar, WizPageTitle } from "./WizUtilComponents";
import SelectFromMatrix from "./SelectFromMatrix";

//
// (!) handleBack & handleNext & handleChange are async (!)
//

// (!) Multi selection caution (!)
// Returns only the item clicked
// It's the responsibility of the parent to aggregate the multiple selected
// and return them as an array in preselectedItems (with multiselection = true)

const CharacteristicsSelection = ({
  name,
  title,
  handleChange,
  parentUpdateValue,
  handleBack = null,
  handleNext = null,
  items,
  preselectedItems,
  multiselection = false,
  showNavigation = false,
  backDisabled = false,
  defaultIconName = null,
  isActive,
  currentStep,
  goToStep
}) => {
  if (isActive === false) return null;
  if (!items) return null;

  const _handleMultiselectionClick = async id => {
  }

  const _handleClick = async id => {

    if (multiselection)
      await _handleMultiselectionClick(id)
    else {
      const nbStepsForward = await parentUpdateValue({ [name]: id });
      if (nbStepsForward)
        goToStep(currentStep + nbStepsForward);
      else
        
    }

    // const nbStepsForward = await handleChange({ [name]: id });
    


  };

  const _handleBack = async () => {
    // Clear current value when return to previous page
    if (handleBack) {
      const nbStepsBack = await handleBack({ [name]: undefined });
      goToStep(currentStep - nbStepsBack);
    }
  };

  // Only for multiselection
  const _handleNext = async () => {
    if (handleNext) {
      console.debug("handleNext", handleNext);
      const nbStepsForward = await handleNext();
      console.debug("nbStepsForward", nbStepsForward);
      goToStep(currentStep + nbStepsForward);
    }
  };

  return (
    <div className={"flex-normal-height flex-direction-column"}>
      <WizPageTitle message={title} />
      <SelectFromMatrix
        name={name}
        defaultIconName={defaultIconName ? defaultIconName : name + "Default"}
        items={items}
        preselectedItems={preselectedItems}
        multiselection={multiselection}
        handleClick={_handleClick}
      />
      {showNavigation && (
        <WizNavBar
          isBackDisabled={backDisabled}
          onClickNext={handleNext ? _handleNext : null}
          onClickPrevious={_handleBack}
        />
      )}
    </div>
  );
};

CharacteristicsSelection.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  parentUpdateValue: PropTypes.func.isRequired, // return null if valid, or otherwise, an error string to display
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  items: PropTypes.array.isRequired,
  preselectedItems: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number
  ]), // can be null: nothing is pre-selected
  multiselection: PropTypes.bool,
  showNavigation: PropTypes.bool,
  backDisabled: PropTypes.bool,
  defaultIconName: PropTypes.string,
  // Props for StepWizard, can be null when call NOT from StepWizard:
  hashKey: PropTypes.string,
  // Props injected by StepWizard, can be null when call NOT from StepWizard:
  isActive: PropTypes.bool,
  currentStep: PropTypes.number,
  goToStep: PropTypes.func
};

export default CharacteristicsSelection;