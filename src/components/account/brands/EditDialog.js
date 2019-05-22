import React from "react";
import { shape, string, bool, func } from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider/Divider";
import BrandServices from "./BrandServices";
import BrandInfo from "./BrandInfo";
import BrandStrains from "./BrandStrains";
import BrandLogo from "./BrandLogo";
import BrandBanner from "./BrandBanner";
import { toCamelCase } from "../../../util/StringUtil";
import BusinessTypes from "../../../const/BusinessTypes";

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
    brand: shape(),
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
      brand: {
        ...this.props.brand,
        services: this.props.brand.services.reduce(
          (r, v) => ({
            ...r,
            [toCamelCase(v)]: v
          }),
          {}
        ),
        strains: this.props.brand.strains.reduce(
          (r, v) => ({
            ...r,
            [toCamelCase(v)]: v
          }),
          {}
        )
      },
      errors: {}
    };
  }

  handleChange = type => e =>
    this.setState({
      brand: {
        ...this.state.brand,
        [type]: e.target.value
      }
    });

  handleChangeService = name => (event, checked) => {
    let services = this.state.brand.services || {};
    if (checked) {
      services[name] = event.target.value;
    } else {
      delete services[name];
    }
    let brand = { ...this.state.brand, services: services };
    this.setState({ brand });
  };

  handleChangeStrain = name => (event, checked) => {
    let strains = this.state.brand.strains;
    if (checked) {
      strains[name] = event.target.value;
    } else {
      delete strains[name];
    }
    const brand = { ...this.state.brand, strains };
    this.setState({ brand });
  };

  handleUploadPicture = name => (file, dataUrl) =>
    this.setState({
      [name]: { file, dataUrl }
    });

  handleUploadError = name => error =>
    this.setState({
      [name]: { error }
    });

  handleSave = () => {
    const { logoImage, bannerImage } = this.state;
    this.setState({
      loading: true
    });

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
    delete brand.logo;
    delete brand.banner;
    if (!this.isValid()) {
      this.setState({ loading: false });
      return;
    }

    this.props
      .onSubmit(
        brand,
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
    } else if (type === "services") {
      const services = this.state.brand.services;
      if (!services || _.isEmpty(services)) {
        isValid = false;
        errors.services = "Select at least 1 option.";
      }
    } else if (type === "strains") {
      if (
        this.state.brand.type === BusinessTypes.DISPENSARY ||
        this.state.brand.type === BusinessTypes.CHURCH
      ) {
        const strains = this.state.brand.strains;
        if (!strains || _.isEmpty(strains)) {
          isValid = false;
          errors.strains = "Select at least 1 option.";
        }
      }
    }
    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }
    return isValid;
  };

  renderContent = () => {
    const { type } = this.props;
    const { errors, brand, logoImage, bannerImage } = this.state;

    switch (type) {
      case "info":
        return (
          <BrandInfo
            brand={brand}
            errors={errors}
            onChange={this.handleChange}
          />
        );
      case "services":
        return (
          <BrandServices
            brand={brand}
            errors={errors}
            onChangeService={this.handleChangeService}
          />
        );
      case "strains":
        return (
          <BrandStrains
            brand={brand}
            errors={errors}
            onChange={this.handleChangeStrain}
          />
        );
      case "logo":
        return (
          <BrandLogo
            logoImage={logoImage.dataUrl ? logoImage : { dataUrl: brand.logo }}
            errors={errors}
            onUpload={this.handleUploadPicture}
            onError={this.handleUploadError}
          />
        );
      case "banner":
        return (
          <BrandBanner
            bannerImage={
              bannerImage.dataUrl ? bannerImage : { dataUrl: brand.banner }
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
    const { editing, classes } = this.props;
    const { loading } = this.state;

    return (
      <Dialog open={editing}>
        <div className={classes.content}>{this.renderContent()}</div>
        <Divider className={classes.divider} />
        <div className={classes.footer}>
          <Button disabled={loading} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={this.handleSave}>
            Save
          </Button>
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
