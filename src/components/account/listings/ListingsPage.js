import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import ShopDialog from "./ShopDialog";
import TabMenu from "../../common/TabsMenu";
import Listings from "./Listings";
import NoListings from "./NoListings";
import { success, error } from "../../../actions/messageActions";
import {
  addListing,
  publishListing,
  uploadPhoto
} from "../../../actions/listingActions";
import { setCenterMapLocation } from "../../../actions/mapActions";

const styles = theme => ({});

class ListingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addListingDialogOpen: false,
      errors: {}
    };
  }

  handleAddListingDialogClose = () =>
    this.setState({ addListingDialogOpen: false });

  handleAddListingDialogOpen = () =>
    this.setState({ addListingDialogOpen: true });

  handleMapButtonClick = (location, id) => () => {
    this.props.setCenterMapLocation(
      { lat: location._lat, lng: location._long },
      id
    );
    this.props.history.push("/");
  };

  handlePublishToggle = (listing, publish) => event => {
    this.props.publishListing(listing, publish).then(() => {
      const message = publish
        ? "Your shop has been published to the map."
        : "You shop has been removed from the map.";
      this.props.success(message);
    });
  };

  handleSubmit = (listing, logo, banner) => {
    return this.props.addListing(listing).then(() => {
      this.handleAddListingDialogClose();
      if (logo) this.props.uploadPhoto(listing, "logo", logo);
      if (banner) this.props.uploadPhoto(listing, "banner", banner);
    });
  };

  render() {
    const { listings } = this.props;
    return (
      <div>
        <TabMenu />
        {listings && listings.length > 0 ? (
          <Listings
            listings={listings}
            onAddListingDialogOpen={this.handleAddListingDialogOpen}
            onMapButtonClick={this.handleMapButtonClick}
            onPublishToggle={this.handlePublishToggle}
            onSubmit={this.handleSubmit}
          />
        ) : (
          <NoListings
            onAddListingDialogOpen={this.handleAddListingDialogOpen}
          />
        )}
        <ShopDialog
          open={this.state.addListingDialogOpen}
          onClose={this.handleAddListingDialogClose}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    listings: state.listings
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, {
    setCenterMapLocation,
    addListing,
    publishListing,
    uploadPhoto,
    success,
    error
  })(ListingsPage)
);
