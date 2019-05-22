import React from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import CircularProgress from "@material-ui/core/CircularProgress";
import BrandName from "./BrandName";
import BrandInfo from "./BrandInfo";
import BrandLogo from "./BrandLogo";
import BrandBanner from "./BrandBanner";
import BrandServices from "./BrandServices";
import BrandStrains from "./BrandStrains";
import { firestore } from "../../../firebase";
import { mask } from "../../../util/MaskUtil";
import { toUrlFriendlyName } from "../../../util/StringUtil";

const styles = theme => ({
  content: {
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      width: 500
    }
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  preview: {
    width: 150,
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    borderRadius: 0,
    borderColor: "#80bdff"
  },
  logoPreviewCropped: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    width: 150,
    height: 150,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 150px",
    borderColor: "#80bdff"
  },
  bannerPreviewCropped: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    width: 300,
    height: 150,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 150px",
    borderColor: "#80bdff"
  },
  stepper: {
    maxWidth: 500,
    flexGrow: 1
  },
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  serviceSelections: {
    maxHeight: 360,
    overflowY: "auto",
    marginTop: 20
  },
  strainSelections: {
    maxHeight: 260,
    overflowY: "auto",
    marginTop: 20
  },
  hoursSelections: {
    [theme.breakpoints.down("xs")]: {
      maxHeight: 320,
      overflowY: "auto",
      marginTop: 20
    }
  },
  topMargin: {
    marginTop: theme.spacing.unit
  },
  formLabel: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  formControl: {
    marginLeft: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0 0 0`
  },
  error: {
    color: "red"
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  },
  fabProgress: {
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

const defaultBrand = {
  id: "",
  name: "",
  description: "",
  strains: {},
  services: {}
};

class BrandDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      nameIsUnique: false,
      brand: { ...defaultBrand },
      logoImage: null,
      bannerImage: null,
      errors: {}
    };
  }

  handleChange = name => event => {
    let brand = this.state.brand;
    brand[name] = mask(name, event.target.value);
    if (name === "name" || name === "id") {
      brand.id = toUrlFriendlyName(event.target.value);
    }
    let errors = this.state.errors;
    delete errors[name];
    this.setState({
      brand,
      errors
    });
  };

  handleServiceChange = name => (event, checked) => {
    let services = this.state.brand.services || {};
    if (checked) {
      services[name] = event.target.value;
    } else {
      delete services[name];
    }
    let brand = { ...this.state.brand, services: services };
    this.setState({ brand });
  };

  handleStrainChange = name => (event, checked) => {
    let strains = this.state.brand.strains;
    if (checked) {
      strains[name] = event.target.value;
    } else {
      delete strains[name];
    }
    const brand = { ...this.state.brand, strains };
    this.setState({ brand });
  };

  handleClose = () => {
    this.setState({ brand: defaultBrand, errors: {} });
    this.props.onClose();
  };

  handleNext = () => {
    if (this.isValid()) {
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleSubmit = () => {
    this.setState({ nextLoading: true });
    const serviceKeys = Object.keys(this.state.brand.services);
    const strainKeys = Object.keys(this.state.brand.strains);
    let brand = {
      ...this.state.brand,
      services: serviceKeys.map(key => this.state.brand.services[key]),
      strains: strainKeys.map(key => this.state.brand.strains[key]),
      publish: true
    };
    if (this.state.brand.services.length <= 0) {
      delete brand.services;
    }
    if (this.state.brand.strains.length <= 0) {
      delete brand.services;
    }
    if (this.isValid()) {
      this.props
        .onSubmit(brand, this.state.logoImage, this.state.bannerImage)
        .then(() => {
          this.setState({
            activeStep: 0,
            nameIsUnique: false,
            brand: { ...defaultBrand },
            logoImage: null,
            bannerImage: null,
            errors: {}
          });
        });
    } else {
      this.setState({ nextLoading: false });
    }
  };

  handleUploadPicture = name => (file, dataUrl) => {
    this.setState({
      [name]: { file, dataUrl }
    });
  };

  handleUploadError = name => error => {
    this.setState({
      [name]: { error }
    });
  };

  verifyUniqueName = () => {
    this.setState({ nextLoading: true });
    firestore
      .collection("brands")
      .doc(this.state.brand.id)
      .get()
      .then(doc => {
        const exists = doc.exists;
        this.setState({ nameIsUnique: !exists, nextLoading: false });
        this.handleNext();
      })
      .catch(error => {
        this.setState({
          errors: { id: "Unknown Error Verifying Unique Name" },
          nextLoading: false
        });
      });
  };

  isValid = () => {
    let isValid = true;
    let errors = {};
    const activeStep = this.state.activeStep;
    const validateTextField = (field, message) => {
      if (!this.state.brand[field] || this.state.brand[field] === "") {
        isValid = false;
        errors[field] = message;
      }
    };
    if (activeStep === 0) {
      validateTextField("name", "Brand Name is Required");
      validateTextField("id", "Unique Name is Required");
      if (!this.state.nameIsUnique) {
        errors.id = "Unique Name is Already Taken";
        isValid = false;
      }
    } else if (activeStep === 1) {
      validateTextField("description", "Description is Required");
      validateTextField("phone", "Phone is Required");
      validateTextField("email", "Email is Required");
    } else if (activeStep === 2) {
      const image = this.state.logoImage;
      if (!image) {
        isValid = false;
        errors.logoImage = "Upload Logo Image";
      } else if (image.error) {
        isValid = false;
        errors.logoImage = image.error.code;
      }
    } else if (activeStep === 3) {
      const image = this.state.bannerImage;
      if (!image) {
        isValid = false;
        errors.bannerImage = "Upload Banner Image";
      } else if (image.error) {
        isValid = false;
        errors.bannerImage = image.error.code;
      }
    } else if (activeStep === 4) {
      const services = this.state.brand.services;
      if (!services || _.isEmpty(services)) {
        isValid = false;
        errors.services = "Select at least 1 option.";
      }
    } else if (activeStep === 5) {
      const strains = this.state.brand.strains;
      if (!strains || _.isEmpty(strains)) {
        isValid = false;
        errors.strains = "Select at least 1 option.";
      }
    }
    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }
    return isValid;
  };

  renderNextButton = () => {
    if (this.state.activeStep === 0) {
      return (
        <div className={this.props.classes.wrapper}>
          <Button
            size="small"
            color="primary"
            disabled={!!this.state.nextLoading || !this.state.brand.id}
            onClick={this.verifyUniqueName}
          >
            Next
            <KeyboardArrowRight />
          </Button>
          {!!this.state.nextLoading && (
            <CircularProgress
              size={24}
              className={this.props.classes.buttonProgress}
            />
          )}
        </div>
      );
    }

    if (this.state.activeStep === 5) {
      return (
        <div className={this.props.classes.wrapper}>
          <Button
            size="small"
            color="primary"
            disabled={!!this.state.nextLoading}
            onClick={this.handleSubmit}
          >
            Finish
            <KeyboardArrowRight />
          </Button>
          {!!this.state.nextLoading && (
            <CircularProgress
              size={24}
              className={this.props.classes.buttonProgress}
            />
          )}
        </div>
      );
    }

    return (
      <Button size="small" color="primary" onClick={this.handleNext}>
        Next
        <KeyboardArrowRight />
      </Button>
    );
  };

  render() {
    const { classes, theme, onClose, ...other } = this.props;
    const { brand, errors, logoImage, bannerImage } = this.state;
    return (
      <Dialog aria-labelledby="simple-dialog-title" {...other}>
        <div className={classes.content}>
          {this.state.activeStep === 0 && (
            <BrandName
              brand={brand}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 1 && (
            <BrandInfo
              brand={brand}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 2 && (
            <BrandLogo
              logoImage={logoImage}
              errors={errors}
              onUpload={this.handleUploadPicture}
              onError={this.handleUploadError}
            />
          )}
          {this.state.activeStep === 3 && (
            <BrandBanner
              bannerImage={bannerImage}
              errors={errors}
              onUpload={this.handleUploadPicture}
              onError={this.handleUploadError}
            />
          )}
          {this.state.activeStep === 4 && (
            <BrandServices
              brand={brand}
              errors={errors}
              onChangeService={this.handleServiceChange}
            />
          )}
          {this.state.activeStep === 5 && (
            <BrandStrains
              brand={brand}
              errors={errors}
              onChange={this.handleStrainChange}
            />
          )}
        </div>
        <MobileStepper
          variant="progress"
          steps={6}
          position="static"
          activeStep={this.state.activeStep}
          className={classes.stepper}
          nextButton={this.renderNextButton()}
          backButton={
            this.state.activeStep === 0 ? (
              <Button size="small" color="secondary" onClick={this.handleClose}>
                Close
              </Button>
            ) : (
              <Button size="small" color="secondary" onClick={this.handleBack}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            )
          }
        />
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BrandDialog);
