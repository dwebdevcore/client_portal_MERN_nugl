import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ListingPanel from "./ListingPanel";

const styles = theme => ({
  main: {
    margin: `${theme.spacing.unit * 4}px 15%`,
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  },
  heading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    margin: `${theme.spacing.unit * 2}px 0`
  }
});

const Listings = ({
  listings,
  onAddListingDialogOpen,
  onMapButtonClick,
  onPublishToggle,
  onSubmit,
  classes
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.heading}>
        <Typography variant="title">Your Listings</Typography>
        <Button
          variant="raised"
          color="primary"
          onClick={onAddListingDialogOpen}
          className={classes.button}
        >
          Add a Listing
        </Button>
      </div>
      <div>
        {listings.map(listing => {
          return (
            <ListingPanel
              key={listing.id}
              listing={listing}
              onMapButtonClick={onMapButtonClick}
              onPublishToggle={onPublishToggle}
              onSubmit={onSubmit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(Listings);
