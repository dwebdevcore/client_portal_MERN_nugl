import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button/Button";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Popover from "@material-ui/core/Popover";
import Rating from "../common/Rating";
import { isCurrentlyOpen } from "../../util/ListingUtil";

const styles = theme => ({
  popover: {},
  card: {
    boxShadow: "none",
    borderRadius: 0,
    margin: 4,
    [theme.breakpoints.up("sm")]: {
      width: 500
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: 360
    }
  },
  media: {
    height: 100
  },
  content: {
    paddingBottom: 0,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2
  },
  popoverActions: {
    height: 48,
    display: "flex",
    alignItems: "center"
  },
  stars: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "flex-end",
    display: "flex"
  },
  starIcon: {
    fill: theme.palette.secondary.main
  },
  clock: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "flex-end",
    display: "flex"
  },
  car: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "flex-end",
    display: "flex"
  },
  ratingDescription: {
    textAlign: "center",
    padding: theme.spacing.unit
  },
  description: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    textAlign: "center",
    padding: theme.spacing.unit
  },
  ratingsAndHours: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  ratings: {
    flex: 2,
    margin: theme.spacing.unit
  },
  hours: {
    flex: 1,
    margin: theme.spacing.unit
  },
  distance: {
    flex: 1,
    margin: theme.spacing.unit
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing.unit,
    paddingTop: 0
  },
  openGreen: {
    color: theme.palette.tertiary.dark
  },
  closedRed: {
    color: theme.palette.secondary.dark
  },
  noHours: {
    color: "#d0d0d0;"
  }
});

const basePhotoUrl = `${process.env.REACT_APP_IMGIX_HOST}`;

class ListingPopover extends React.Component {
  state = {
    positionTop: 200,
    positionLeft: 400,
    anchorReference: "anchorEl"
  };

  render() {
    const {
      open,
      result,
      onPopoverClose,
      onNavigateToListing,
      classes,
      anchorEl
    } = this.props;
    const listing = result.listing;
    const distance = Number.parseFloat(result.distance[0]).toPrecision(3);
    const isOpen = isCurrentlyOpen(listing);
    return (
      <Popover
        classes={{
          paper: classes.popover
        }}
        open={open}
        anchorEl={anchorEl}
        anchorReference={"anchorEl"}
        anchorPosition={{ top: 200, left: 400 }}
        onClose={onPopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
      >
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <img
                src={
                  listing.seed
                    ? `${basePhotoUrl}/nugl/grey-logo.png?h=40&fit=crop`
                    : `${basePhotoUrl}/listings/${
                        listing.id
                      }/logo.jpg?h=40&fit=crop`
                }
                title={listing.name}
                alt={listing.name}
              />
            }
            title={listing.name}
            subheader={listing.type}
          />
          <CardMedia
            className={classes.media}
            image={
              listing.seed
                ? `${basePhotoUrl}/nugl/banner.jpg`
                : `${basePhotoUrl}/listings/${listing.id}/banner.jpg`
            }
            title={listing.name}
          />
          <CardContent className={classes.content}>
            {listing.description && (
              <Typography className={classes.description} component="p">
                {listing.description}
              </Typography>
            )}
            <div className={classes.ratingsAndHours}>
              <div className={classes.distance}>
                <div className={classes.car}>
                  <DriveEtaIcon />
                </div>
                <Typography
                  className={classes.ratingDescription}
                  variant="caption"
                >
                  {distance} MI
                </Typography>
              </div>

              <div className={classes.ratings}>
                <Rating
                  rating={listing.ratings ? listing.ratings.averageAverage : 0}
                  tooltipText={
                    listing.ratings
                      ? `${(listing.ratings.averageAverage / 2.0).toFixed(
                          1
                        )} by ${listing.ratings.averageCount} review${
                          listing.ratings.averageCount === 1 ? "" : "s"
                        }`
                      : "No Reviews"
                  }
                />
                <Typography
                  className={classes.ratingDescription}
                  variant="caption"
                >
                  {listing.ratings
                    ? `${(listing.ratings.averageAverage / 2.0).toFixed(
                        1
                      )} by ${listing.ratings.averageCount} review${
                        listing.ratings.averageCount === 1 ? "" : "s"
                      }`
                    : "NO REVIEWS"}
                </Typography>
              </div>

              <div className={classes.hours}>
                <div className={classes.clock}>
                  <AccessTimeIcon />
                </div>
                <Typography
                  className={classNames(
                    classes.ratingDescription,
                    listing.hours
                      ? isOpen
                        ? classes.openGreen
                        : null
                      : classes.noHours
                  )}
                  variant="caption"
                >
                  {listing.hours ? (isOpen ? "OPEN NOW" : "CLOSED NOW") : "N/A"}
                </Typography>
              </div>
            </div>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Button
              color="primary"
              variant="raised"
              onClick={onNavigateToListing(listing)}
              fullWidth
            >
              View Profile
            </Button>
          </CardActions>
        </Card>
      </Popover>
    );
  }
}

export default withStyles(styles)(ListingPopover);
