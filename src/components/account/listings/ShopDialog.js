import React from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import CircularProgress from "@material-ui/core/CircularProgress";
import BusinessName from "./BusinessName";
import BusinessInfo from "./BusinessInfo";
import BusinessLogo from "./BusinessLogo";
import BusinessBanner from "./BusinessBanner";
import BusinessAddress from "./BusinessAddress";
import BusinessVerifyAddress from "./BusinessVerifyAddress";
import BusinessType from "./BusinessType";
import BusinessServices from "./BusinessServices";
import BusinessOpenHours from "./BusinessOpenHours";
import BusinessStrains from "./BusinessStrains";
import BusinessSocialMedia from "./BusinessSocialMedia";
import BusinessTypes from "../../../const/BusinessTypes";
import { firestore } from "../../../firebase";
import GoogleApi from "../../../api/GoogleApi";
import { mask } from "../../../util/MaskUtil";
import { toUrlFriendlyName } from "../../../util/StringUtil";
import { types } from "../../../firebase";

const styles = theme => ({
  content: {
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      width: 500
    }
  },
  stepper: {
    maxWidth: 500,
    flexGrow: 1
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

const defaultShop = {
  id: "",
  services: {},
  strains: {},
  hours: {
    monday: { open: true },
    tuesday: { open: true },
    wednesday: { open: true },
    thursday: { open: true },
    friday: { open: true },
    saturday: { open: true },
    sunday: { open: true }
  }
};

class ShopDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      firstDaysChanged: { fromChanged: false, toChanged: false },
      addressVerified: false,
      nameIsUnique: false,
      shop: { ...defaultShop },
      logoImage: null,
      bannerImage: null,
      errors: {}
    };
  }

  handleChange = name => event => {
    let shop = this.state.shop;
    shop[name] = mask(name, event.target.value);
    if (name === "name" || name === "id") {
      shop.id = toUrlFriendlyName(event.target.value);
    }
    const addressChanged = ["address", "city", "state", "zip"].includes(name);
    let errors = this.state.errors;
    delete errors[name];
    this.setState({
      shop,
      errors,
      addressVerified: !addressChanged || this.state.verifyAddress
    });
  };

  handleAddressChange = name => event => {
    let address = this.state.shop.address || {};
    address[name] = event.target.value;
    const shop = { ...this.state.shop, address: address };
    this.setState({
      shop,
      addressVerified: true
    });
  };

  handleServiceChange = name => (event, checked) => {
    let services = this.state.shop.services || {};
    if (checked) {
      services[name] = event.target.value;
    } else {
      delete services[name];
    }
    let shop = { ...this.state.shop, services: services };
    this.setState({ shop });
  };

  handleStrainChange = name => (event, checked) => {
    let strains = this.state.shop.strains;
    if (checked) {
      strains[name] = event.target.value;
    } else {
      delete strains[name];
    }
    const shop = { ...this.state.shop, strains };
    this.setState({ shop });
  };

  handleBusinessTypeRadioChange = (event, value) => {
    let shop = { ...this.state.shop, type: value, services: {} };
    this.setState({ shop });
  };

  handleClose = () => {
    this.setState({ shop: defaultShop, errors: {} });
    this.props.onClose();
  };

  handleNext = () => {
    if (this.isValid()) {
      if (
        this.state.activeStep === 8 && // skip strains
        (this.state.shop.type !== BusinessTypes.DISPENSARY &&
          this.state.shop.type !== BusinessTypes.CHURCH)
      ) {
        this.setState({
          activeStep: this.state.activeStep + 2
        });
      } else {
        this.setState({
          activeStep: this.state.activeStep + 1
        });
      }
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleSubmit = () => {
    this.setState({ nextLoading: true });
    const serviceKeys = Object.keys(this.state.shop.services);
    const strainKeys = Object.keys(this.state.shop.strains);
    let shop = {
      ...this.state.shop,
      services: serviceKeys.map(key => this.state.shop.services[key]),
      strains: strainKeys.map(key => this.state.shop.strains[key]),
      publish: true
    };
    if (this.state.shop.services.length <= 0) {
      delete shop.services;
    }
    if (this.state.shop.strains.length <= 0) {
      delete shop.services;
    }
    if (this.isValid()) {
      this.props
        .onSubmit(shop, this.state.logoImage, this.state.bannerImage)
        .then(() => {
          this.setState({
            activeStep: 0,
            shop: { ...defaultShop },
            nextLoading: false,
            firstDaysChanged: { fromChanged: false, toChanged: false },
            addressVerified: false,
            nameIsUnique: false,
            logoImage: null,
            bannerImage: null
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

  handleTimeChange = (dayOfWeek, fromOrTo) => date => {
    const { fromChanged, toChanged } = this.state.firstDaysChanged;
    if (fromOrTo === "from" && !fromChanged) {
      const hours = this.state.shop.hours;
      Object.keys(this.state.shop.hours).forEach(day => {
        hours[day][fromOrTo] = date.toDate();
      });
      const shop = { ...this.state.shop, hours };
      this.setState({
        shop,
        firstDaysChanged: { fromChanged: true, toChanged }
      });
      return;
    }
    if (fromOrTo === "to" && !toChanged) {
      const hours = this.state.shop.hours;
      Object.keys(this.state.shop.hours).forEach(day => {
        hours[day][fromOrTo] = date.toDate();
      });
      this.setState({ firstDaysChanged: { fromChanged, toChanged: true } });
      return;
    }
    const hours = this.state.shop.hours;
    const day = hours[dayOfWeek];
    day[fromOrTo] = date.toDate();
    const shop = { ...this.state.shop, hours: { ...hours, [dayOfWeek]: day } };
    this.setState({ shop });
  };

  handleClosedChecked = dayOfWeek => (event, checked) => {
    const hours = this.state.shop.hours;
    hours[dayOfWeek].open = checked;
    const shop = { ...this.state.shop, hours };
    this.setState({ shop });
  };

  handleVerfiedAddressCheck = (event, value) => {
    const address = this.state.verifiedAddresses.filter(
      e => e.formattedAddress === value
    )[0];
    const shop = {
      ...this.state.shop,
      location: address.location,
      formattedAddress: address.formattedAddress
    };
    this.setState({ shop });
  };

  verifyUniqueName = () => {
    this.setState({ nextLoading: true });
    firestore
      .collection("listings")
      .doc(this.state.shop.id)
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

  verifyAddress = () => {
    this.setState({ nextLoading: true });
    let errors = {};
    if (this.isValid()) {
      GoogleApi.geocodeSearch(
        "address",
        [
          this.state.shop.address,
          this.state.shop.city,
          this.state.shop.state,
          this.state.shop.zip
        ].join("+")
      )
        .then(results => {
          if (results && results.length > 0) {
            const addresses = results.map((address, index) => {
              const point = new types.GeoPoint(
                address.location.lat,
                address.location.lng
              );
              return {
                id: index,
                formattedAddress: address.formattedAddress,
                location: point
              };
            });

            this.setState({
              nextLoading: false,
              verifiedAddresses: addresses,
              activeStep: this.state.activeStep + 1
            });
          } else {
            errors.address = "Error verifying address.";
            this.setState({ nextLoading: false, errors });
          }
        })
        .catch(error => {
          errors.address = "Error verifying address.";
          this.setState({ nextLoading: false, errors });
        });
    }
  };

  isValid = () => {
    let isValid = true;
    let errors = {};
    const activeStep = this.state.activeStep;
    const validateTextField = (field, message) => {
      if (!this.state.shop[field] || this.state.shop[field] === "") {
        isValid = false;
        errors[field] = message;
      }
    };
    const validateSocialMediaRegEx = (field, message, pattern) => {
      if (this.state.shop[field] && !this.state.shop[field].match(pattern)) {
        isValid = false;
        errors[field] = message;
      }
    };
    if (activeStep === 0) {
      validateTextField("name", "Shop Name is Required");
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
      validateTextField("address", "Address is Required");
      validateTextField("city", "City is Required");
      validateTextField("state", "State is Required");
      validateTextField("zip", "Zip Code is Required");
    } else if (activeStep === 5) {
      validateTextField("formattedAddress", "Please select your address");
    } else if (activeStep === 6) {
      validateTextField("type", "Shop type is Required");
    } else if (activeStep === 7) {
      const services = this.state.shop.services;
      if (!services || _.isEmpty(services)) {
        isValid = false;
        errors.services = "Select at least 1 option.";
      }
    } else if (activeStep === 8) {
      Object.keys(this.state.shop.hours).map(key => {
        const day = this.state.shop.hours[key];
        if (day.open) {
          if (!(day.from && day.to)) {
            isValid = false;
            errors.hours = "Open days require both an open and close time.";
          }
        }
        return day;
      });
    } else if (activeStep === 9) {
      if (
        this.state.shop.type === BusinessTypes.DISPENSARY ||
        this.state.shop.type === BusinessTypes.CHURCH
      ) {
        const strains = this.state.shop.strains;
        if (!strains || _.isEmpty(strains)) {
          isValid = false;
          errors.strains = "Select at least 1 option.";
        }
      }
    } else if (activeStep === 10) {
      validateSocialMediaRegEx(
        "facebook",
        "Invalid Facebook Handle",
        /^[a-zA-Z0-9._-]*$/
      );
      validateSocialMediaRegEx(
        "twitter",
        "Invalid Twitter Handle",
        /^[a-zA-Z0-9._-]*$/
      );
      validateSocialMediaRegEx(
        "instagram",
        "Invalid Instagram Handle",
        /^[a-zA-Z0-9._-]*$/
      );
    }
    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }
    return isValid;
  };

  renderNextButton = () => {
    if (this.state.activeStep === 10) {
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
    if (this.state.activeStep === 4) {
      return (
        <div className={this.props.classes.wrapper}>
          <Button
            size="small"
            color="primary"
            disabled={!!this.state.nextLoading}
            onClick={this.verifyAddress}
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
    if (this.state.activeStep === 0) {
      return (
        <div className={this.props.classes.wrapper}>
          <Button
            size="small"
            color="primary"
            disabled={!!this.state.nextLoading || !this.state.shop.id}
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

    return (
      <Button size="small" color="primary" onClick={this.handleNext}>
        Next
        <KeyboardArrowRight />
      </Button>
    );
  };

  render() {
    const { classes, theme, onClose, ...other } = this.props;
    const {
      shop,
      errors,
      logoImage,
      bannerImage,
      verifiedAddresses
    } = this.state;

    return (
      <Dialog aria-labelledby="simple-dialog-title" {...other}>
        <div className={classes.content}>
          {this.state.activeStep === 0 && (
            <BusinessName
              shop={shop}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 1 && (
            <BusinessInfo
              shop={shop}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 2 && (
            <BusinessLogo
              logoImage={logoImage}
              errors={errors}
              onUpload={this.handleUploadPicture}
              onError={this.handleUploadError}
            />
          )}
          {this.state.activeStep === 3 && (
            <BusinessBanner
              bannerImage={bannerImage}
              errors={errors}
              onUpload={this.handleUploadPicture}
              onError={this.handleUploadError}
            />
          )}
          {this.state.activeStep === 4 && (
            <BusinessAddress
              shop={shop}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 5 && (
            <BusinessVerifyAddress
              shop={shop}
              verifiedAddresses={verifiedAddresses}
              errors={errors}
              onCheckAddress={this.handleVerfiedAddressCheck}
            />
          )}
          {this.state.activeStep === 6 && (
            <BusinessType
              shop={shop}
              errors={errors}
              onCheckType={this.handleBusinessTypeRadioChange}
            />
          )}
          {this.state.activeStep === 7 && (
            <BusinessServices
              shop={shop}
              errors={errors}
              onChangeService={this.handleServiceChange}
            />
          )}
          {this.state.activeStep === 8 && (
            <BusinessOpenHours
              shop={shop}
              errors={errors}
              onTimeChange={this.handleTimeChange}
              onClosedChecked={this.handleClosedChecked}
            />
          )}
          {this.state.activeStep === 9 && (
            <BusinessStrains
              shop={shop}
              errors={errors}
              onChange={this.handleStrainChange}
            />
          )}
          {this.state.activeStep === 10 && (
            <BusinessSocialMedia
              shop={shop}
              errors={errors}
              onChange={this.handleChange}
            />
          )}
          {this.state.activeStep === 11 && (
            <div>Would you like to publish to the map?</div>
          )}
        </div>
        <MobileStepper
          variant="progress"
          steps={11}
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

export default withStyles(styles, { withTheme: true })(ShopDialog);
