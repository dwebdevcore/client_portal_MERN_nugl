import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import TabMenu from "../../common/TabsMenu";
import Brands from "./Brands";
import NoBrands from "./NoBrands";
import BrandDialog from "./BrandDialog";
import {
  addBrand,
  publishBrand,
  uploadPhoto
} from "../../../actions/brandActions";
import { success, error } from "../../../actions/messageActions";

const styles = theme => ({});

class BrandsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addBrandDialogOpen: false,
      errors: {}
    };
  }

  handlePublishToggle = (brand, publish) => event => {
    this.props.publishBrand(brand, publish).then(() => {
      const message = publish
        ? "Your brand has been published to the map."
        : "You brand has been removed from the map.";
      this.props.success(message);
    });
  };

  handleAddBrandDialogClose = () =>
    this.setState({ addBrandDialogOpen: false });

  handleAddBrandDialogOpen = () => this.setState({ addBrandDialogOpen: true });

  handleSubmit = (brand, logo, banner) => {
    return this.props.addBrand(brand).then(() => {
      this.handleAddBrandDialogClose();
      if (logo) this.props.uploadPhoto(brand, "logo", logo);
      if (banner) this.props.uploadPhoto(brand, "banner", banner);
    });
  };

  render() {
    const { brands } = this.props;
    return (
      <div>
        <TabMenu />
        {brands && brands.length === 0 ? (
          <NoBrands onAddBrandDialogOpen={this.handleAddBrandDialogOpen} />
        ) : (
          <Brands
            brands={brands}
            onAddBrandDialogOpen={this.handleAddBrandDialogOpen}
            onPublishToggle={this.handlePublishToggle}
            onSubmit={this.handleSubmit}
          />
        )}
        <BrandDialog
          open={this.state.addBrandDialogOpen}
          onClose={this.handleAddBrandDialogClose}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    brands: state.brands
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, {
    addBrand,
    publishBrand,
    uploadPhoto,
    success,
    error
  })(BrandsPage)
);
