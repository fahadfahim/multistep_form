import React, { useState } from "react";
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm,FormProvider } from "react-hook-form";
import BasicInformation from "./BasicInformation";
import ContactInformation from "./ContactInformation";
import PersonalInformation from "./PersonalInformation";
const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Basic information",
    "Contact Information",
    "Personal Information",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <>
          <BasicInformation />
        </>
      );

    case 1:
      return (
        <>
          <ContactInformation />
        </>
      );
    case 2:
      return (
        <>
         <PersonalInformation />
        </>
      );
  }
}

const LinaerStepper = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const steps = getSteps();

  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: "",
      emailAddress: "",
      phoneNumber: "",
      alternatePhone: "",
      address1: "",
      address2: "",
      country: "",
    }

  });
  
  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = (data) => {
    if(activeStep == steps.length -1){
      fetch('https://jsonplaceholder.typicode.com/users').then((data) => data.json()).then((res) => {
        console.log(res);
        console.log(data);
        setActiveStep(activeStep + 1);
      })
    }else{
      setActiveStep(activeStep + 1);
      setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));
    }
    //console.log(data);
    
    
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };
// const onSubmit = (data) =>{
//   console.log(data);
// }
  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                align="center"
                style={{ display: "block" }}
              >
              </Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Typography variant="h3" align="center">
          Thank You
        </Typography>
      ) : (
        <>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>{getStepContent(activeStep)}
          <Button
            className={classes.button}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            back
          </Button>
          {isStepOptional(activeStep) && (
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleSkip}
            >
              skip
            </Button>
          )}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            // onClick={handleNext}
            type='submit'
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
          </form>
        </FormProvider>
          
        </>
      )}
    </div>
  );
};

export default LinaerStepper;
