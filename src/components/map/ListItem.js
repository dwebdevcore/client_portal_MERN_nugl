import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Rating from "../common/Rating";
import { renderListingTypeIcon, getNuglIcon } from "../../util/IconUtil";
import { isCurrentlyOpen } from "../../util/ListingUtil";

const styles = theme => ({
  card: {
    cursor: "pointer",
    display: "flex",
    margin: theme.spacing.unit,
    transition: theme.transitions.create([
      "margin",
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    "&:hover": {
      marginLeft: theme.spacing.unit * 1,
      marginRight: theme.spacing.unit * 1,
      borderColor: "#72a4f7",
      borderSize: 1,
      backgroundColor: "#fafafa",
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1), 0 4px 8px 0 rgba(0,0,0,0.2)"
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row"
    }
  },
  cardHovered: {
    cursor: "pointer",
    display: "flex",
    margin: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
    borderColor: "#72a4f7",
    borderSize: 1,
    backgroundColor: "#fafafa",
    boxShadow:
      "0 1px 2px 0 rgba(114, 164, 247, 0.5), 0 4px 8px 0 rgba(114, 164, 247, 0.7)",
    //boxShadow: "0 1px 2px 0 rgba(142, 216, 114, 0.5), 0 4px 8px 0 rgba(142, 216, 114, 0.7)",
    transition: theme.transitions.create([
      "margin",
      "border-color",
      "background-color",
      "background",
      "box-shadow"
    ]),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row"
    }
  },
  details: {
    display: "flex",
    flex: 1,
    flexDirection: "row"
  },
  content: {
    position: "relative",
    display: "flex",
    width: "calc(100% - 168px)",
    flexShrink: 0,
    flexDirection: "column",
    paddingBottom: "16px !important"
  },
  topContent: {
    marginBottom: theme.spacing.unit,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  middleContent: {
    marginBottom: theme.spacing.unit,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between"
  },
  bottomContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  type: {
    display: "flex",
    alignItems: "center"
  },
  headingContainer: {},
  heading: {
    maxWidth: "calc(100% - 64px)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  cardButtons: {
    display: "flex",
    flexDirection: "row"
  },
  media: {
    display: "flex",
    width: 120,
    flexShrink: 0
  },
  cardButton: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing.unit
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

const SearchListing = ({
  listing,
  result,
  onMouseEnter,
  onMouseLeave,
  onClick,
  hovered,
  selected,
  classes
}) => {
  const distance = Number.parseFloat(result.distance[0]).toFixed(2);
  const isOpen = isCurrentlyOpen(listing);
  return (
    <Card
      className={hovered || selected ? classes.cardHovered : classes.card}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <CardMedia
        className={classes.media}
        image={
          listing.seed
            ? `${basePhotoUrl}/nugl/grey-logo.png`
            : `${basePhotoUrl}/listings/${listing.id}/logo.jpg`
        }
        title={listing.name}
        component={media => {
          return <div className={media.className} style={media.style} />;
        }}
      />
      <CardContent className={classes.content}>
        <div className={classes.topContent}>
          <Typography variant="subheading" className={classes.heading}>
            {listing.name}
          </Typography>

          {listing.type === "Dispensary" ? (
            <div className={classes.cardButtons}>
              <Tooltip
                id="tooltip-dispensary"
                title="Dispensary"
                placement="bottom"
              >
                <IconButton className={classes.cardButton}>
                  {renderListingTypeIcon(listing.type)}
                </IconButton>
              </Tooltip>
              {listing.services &&
                listing.services.indexOf("Delivery") >= 0 && (
                  <Tooltip
                    id="tooltip-delivery"
                    title="Delivery"
                    placement="bottom"
                  >
                    <IconButton className={classes.cardButton}>
                      {getNuglIcon("Delivery")}
                    </IconButton>
                  </Tooltip>
                )}
              {listing.services &&
                listing.services.indexOf("Store Front") >= 0 && (
                  <Tooltip
                    id="tooltip-store-front"
                    title="Store Front"
                    placement="bottom"
                  >
                    <IconButton className={classes.cardButton}>
                      {getNuglIcon("Store Front")}
                    </IconButton>
                  </Tooltip>
                )}
            </div>
          ) : (
            <div className={classes.cardButtons}>
              <Tooltip id="tooltip-service" title="Service" placement="bottom">
                <IconButton className={classes.cardButton}>
                  {renderListingTypeIcon(listing.type)}
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
        <div className={classes.middleContent}>
          <Typography variant="body2" color="textSecondary">
            {listing.city}, {listing.state}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {distance} miles away
          </Typography>
        </div>
        <div className={classes.bottomContent}>
          <Rating
            rating={listing.ratings ? listing.ratings.averageAverage : 0}
            tooltipText={
              listing.ratings
                ? `${(listing.ratings.averageAverage / 2.0).toFixed(1)} by ${
                    listing.ratings.averageCount
                  } review${listing.ratings.averageCount === 1 ? "" : "s"}`
                : "No Reviews"
            }
          />
          <Typography
            variant="body2"
            className={
              listing.hours
                ? isOpen
                  ? classes.openGreen
                  : null
                : classes.noHours
            }
          >
            {listing.hours ? (isOpen ? "OPEN NOW" : "CLOSED NOW") : "N/A"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(SearchListing);
