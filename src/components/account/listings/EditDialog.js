import React from "react";
import { shape, string, bool, func } from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider/Divider";
import BusinessAddress from "./BusinessAddress";
import BusinessVerifyAddress from "./BusinessVerifyAddress";
import BusinessType from "./BusinessType";
import BusinessServices from "./BusinessServices";
import BusinessOpenHours from "./BusinessOpenHours";
import BusinessStrains from "./BusinessStrains";
import BusinessSocialMedia from "./BusinessSocialMedia";
import BusinessLogo from "./BusinessLogo";
import BusinessBanner from "./BusinessBanner";
import { toCamelCase } from "../../../util/StringUtil";
import BusinessTypes from "../../../const/BusinessTypes";
import GoogleApi from "../../../api/GoogleApi";
import { types } from "../../../firebase";

const styles = theme => ({
  content: {
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      width: 500
    }
  },
  divider: {
    width: "calc(100% - 32px)",
    marginLeft: "16px"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

class EditDialog extends React.PureComponent {
  static propTypes = {
    shop: shape(),
    editing: bool.isRequired,
    type: string,
    classes: shape(),
    onClose: func.isRequired,
    loading: false
  };

  constructor(props) {
    super(props);

    this.state = {
      logoImage: {
        file: "",
        dataUrl: ""
      },
      bannerImage: {
        file: "",
        dataUrl: ""
      },
      shop: {
        ...this.props.shop,
        services: this.props.shop.services.reduce(
          (r, v) => ({
            ...r,
            [toCamelCase(v)]: v
          }),
          {}
        ),
        strains: this.props.shop.strains.reduce(
          (r, v) => ({
            ...r,
            [toCamelCase(v)]: v
          }),
          {}
        )
      },
      errors: {},
      editServices: false,
      validateAddress: false,
      nextLoading: false,
      verifiedAddresses: []
    };
  }

  handleNext = () => {
    const { type } = this.props;
    if (type === "address") {
      this.verifyAddress();
    } else if (type === "type") {
      this.setState({
        editServices: true
      });
    }
  };

  handleBack = () => {
    const { type } = this.props;
    if (type === "address") {
      this.setState({
        validateAddress: false
      });
    } else if (type === "type") {
      this.setState({
        editServices: false
      });
    }
  };

  handleChange = type => e =>
    this.setState({
      shop: {
        ...this.state.shop,
        [type]: e.target.value
      }
    });

  handleChangeService = name => (event, checked) => {
    let services = this.state.shop.services || {};
    if (checked) {
      services[name] = event.target.value;
    } else {
      delete services[name];
    }
    let shop = { ...this.state.shop, services: services };
    this.setState({ shop });
  };

  handleChangeStrain = name => (event, checked) => {
    let strains = this.state.shop.strains;
    if (checked) {
      strains[name] = event.target.value;
    } else {
      delete strains[name];
    }
    const shop = { ...this.state.shop, strains };
    this.setState({ shop });
  };

  handleTimeChange = (dayOfWeek, fromOrTo) => date =>
    this.setState({
      shop: {
        ...this.state.shop,
        hours: {
          ...this.state.shop.hours,
          [dayOfWeek]: {
            ...this.state.shop.hours[dayOfWeek],
            [fromOrTo]: date.toDate()
          }
        }
      }
    });

  handleClosedChange = dayOfWeek => (event, checked) =>
    this.setState({
      shop: {
        ...this.state.shop,
        hours: {
          ...this.state.shop.hours,
          [dayOfWeek]: {
            ...this.state.shop.hours[dayOfWeek],
            open: checked
          }
        }
      }
    });

  handleChangeType = (event, value) =>
    this.setState({
      shop: {
        ...this.state.shop,
        type: value,
        services: {}
      }
    });

  handleUploadPicture = name => (file, dataUrl) =>
    this.setState({
      [name]: { file, dataUrl }
    });

  handleUploadError = name => error =>
    this.setState({
      [name]: { error }
    });

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

  handleSave = () => {
    const { logoImage, bannerImage } = this.state;
    this.setState({
      loading: true,
      editServices: false
    });

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
    delete shop.logo;
    delete shop.banner;
    if (!this.isValid()) {
      this.setState({ loading: false });
      return;
    }

    this.props
      .onSubmit(
        shop,
        logoImage.dataUrl ? logoImage : null,
        bannerImage.dataUrl ? bannerImage : null
      )
      .then(() => {
        this.setState({ loading: false });
        this.props.onClose();
      });
  };

  isValid = () => {
    let isValid = true;
    let errors = {};
    const { type } = this.state;
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
    if (type === "logo") {
      const image = this.state.logoImage;
      if (!image) {
        isValid = false;
        errors.logoImage = "Upload Logo Image";
      } else if (image.error) {
        isValid = false;
        errors.logoImage = image.error.code;
      }
    } else if (type === "banner") {
      const image = this.state.bannerImage;
      if (!image) {
        isValid = false;
        errors.bannerImage = "Upload Banner Image";
      } else if (image.error) {
        isValid = false;
        errors.bannerImage = image.error.code;
      }
    } else if (type === "address") {
      validateTextField("address", "Address is Required");
      validateTextField("city", "City is Required");
      validateTextField("state", "State is Required");
      validateTextField("zip", "Zip Code is Required");
      validateTextField("formattedAddress", "Please select your address");
    } else if (type === "type") {
      validateTextField("type", "Shop type is Required");
    } else if (type === "type" || type === "services") {
      const services = this.state.shop.services;
      if (!services || _.isEmpty(services)) {
        isValid = false;
        errors.services = "Select at least 1 option.";
      }
    } else if (type === "operatingHours") {
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
    } else if (type === "strains") {
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
    } else if (type === "socialMedia") {
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
              validateAddress: true
            });
          } else {
            errors.address = "Error verifying address.";
            this.setState({
              nextLoading: false,
              errors,
              validateAddress: true
            });
          }
        })
        .catch(error => {
          errors.address = "Error verifying address.";
          this.setState({ nextLoading: false, errors, validateAddress: true });
        });
    }
  };

  renderContent = () => {
    const { type } = this.props;
    const {
      errors,
      shop,
      editServices,
      logoImage,
      bannerImage,
      validateAddress,
      verifiedAddresses
    } = this.state;

    switch (type) {
      case "address": {
        if (validateAddress) {
          return (
            <BusinessVerifyAddress
              shop={shop}
              verifiedAddresses={verifiedAddresses}
              errors={errors}
              onCheckAddress={this.handleVerfiedAddressCheck}
            />
          );
        }
        return (
          <BusinessAddress
            shop={shop}
            errors={errors}
            onChange={this.handleChange}
          />
        );
      }
      case "type":
        return editServices ? (
          <BusinessServices
            shop={shop}
            errors={errors}
            onChangeService={this.handleChangeService}
          />
        ) : (
          <BusinessType
            shop={shop}
            errors={errors}
            onCheckType={this.handleChangeType}
          />
        );
      case "services":
        return (
          <BusinessServices
            shop={shop}
            errors={errors}
            onChangeService={this.handleChangeService}
          />
        );
      case "operatingHours":
        return (
          <BusinessOpenHours
            shop={shop}
            errors={errors}
            onTimeChange={this.handleTimeChange}
            onClosedChecked={this.handleClosedChange}
          />
        );
      case "strains":
        return (
          <BusinessStrains
            shop={shop}
            errors={errors}
            onChange={this.handleChangeStrain}
          />
        );
      case "socialMedia":
        return (
          <BusinessSocialMedia
            shop={shop}
            errors={errors}
            onChange={this.handleChange}
          />
        );
      case "logo":
        return (
          <BusinessLogo
            logoImage={logoImage.dataUrl ? logoImage : { dataUrl: shop.logo }}
            errors={errors}
            onUpload={this.handleUploadPicture}
            onError={this.handleUploadError}
          />
        );
      case "banner":
        return (
          <BusinessBanner
            bannerImage={
              bannerImage.dataUrl ? bannerImage : { dataUrl: shop.banner }
            }
            errors={errors}
            onUpload={this.handleUploadPicture}
            onError={this.handleUploadError}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { editing, classes, type } = this.props;
    const { loading, editServices, validateAddress, nextLoading } = this.state;

    return (
      <Dialog open={editing}>
        <div className={classes.content}>{this.renderContent()}</div>
        <Divider className={classes.divider} />
        <div className={classes.footer}>
          {(type === "type" && editServices) ||
          (type === "address" && validateAddress) ? (
            <Button disabled={loading} onClick={this.handleBack}>
              Back
            </Button>
          ) : (
            <Button disabled={loading} onClick={this.props.onClose}>
              Cancel
            </Button>
          )}
          {(type === "type" && !editServices) ||
          (type === "address" && !validateAddress) ? (
            <Button
              color="primary"
              disabled={loading || nextLoading}
              onClick={this.handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              color="primary"
              disabled={loading}
              onClick={this.handleSave}
            >
              Save
            </Button>
          )}
          {loading && (
            <CircularProgress
              size={24}
              className={this.props.classes.buttonProgress}
            />
          )}
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(EditDialog);
