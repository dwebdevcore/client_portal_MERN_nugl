import React, { Component } from "react";
import { connect } from "react-redux";
import Imgix from "react-imgix";
import moment from "moment";
import GoogleMap from "google-map-react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import StoreIcon from "@material-ui/icons/Store";
import StarIcon from "@material-ui/icons/Star";
import MenuIcon from "@material-ui/icons/Menu";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Rating from "../common/Rating";
import ReviewDialog from "./ReviewDialog";
import Reviews from "./Reviews";
import { addReview } from "../../actions/reviewActions";
import { firestore } from "../../firebase";
import { getNuglIcon } from "../../util/IconUtil";
import { success, error } from "../../actions/messageActions";

const styles = theme => ({
  main: {},
  banner: {
    height: 200,
    width: "100%",
    position: "relative",
    backgroundPosition: "center center",
    [theme.breakpoints.down("md")]: {
      height: 200
    },
    [theme.breakpoints.down("sm")]: {
      height: 200
    }
  },
  gradient: {
    position: "absolute",
    height: "100%",
    width: "100%",
    background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5))"
  },
  avatar: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.grey[300]}`,
    borderRadius: 0,
    width: 200,
    height: 200,
    position: "absolute",
    left: "10%",
    bottom: "calc(0% - 100px)"
  },
  title: {
    marginLeft: "10%",
    marginRight: "10%",
    paddingLeft: 200 + theme.spacing.unit * 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    minHeight: 100
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  ratingText: {
    marginTop: 2,
    marginLeft: theme.spacing.unit
  },
  content: {
    margin: `${theme.spacing.unit * 2}px 10% ${theme.spacing.unit * 4}px`,
    display: "flex",
    [theme.breakpoints.down("md")]: {
      margin: `${theme.spacing.unit * 4}px 10%`
    },
    [theme.breakpoints.down("sm")]: {
      margin: `${theme.spacing.unit * 4}px 5%`,
      flexDirection: "column"
    }
  },
  paper: {
    flex: 1
  },
  tabContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`
  },
  tabs: {
    backgroundColor: theme.palette.common.white,
    borderBottom: `solid 1px ${theme.palette.grey["200"]}`
  },
  mapContainer: {
    width: "100%",
    height: 120,
    margin: `0 0 ${theme.spacing.unit * 2}px 0`
  },
  infoLine: {
    display: "flex",
    margin: `${theme.spacing.unit}px 0`
  },
  infoTitle: {
    flexBasis: "20%",
    flexShrink: 0,
    [theme.breakpoints.down("xs")]: {
      flexBasis: "25%"
    }
  },
  infoValue: {},
  infoField: {
    flexShrink: 0
  },
  divider: {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`
  },
  bottomMargin: {
    marginBottom: theme.spacing.unit
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

const Marker = ({ listing }) => <div>{getNuglIcon(listing.type)}</div>;

class ListingPage extends Component {
  constructor(props) {
    super(props);
    this.defaultCenter = { lat: 34.048432, lng: -118.443075 };
    this.state = {
      tabIndex: 0,
      listing: {},
      reviewDialogOpen: false,
      errors: {}
    };
  }

  componentDidMount() {
    const listingUrlId = this.props.match.params.id;
    Promise.all([
      firestore
        .collection("listings")
        .doc(listingUrlId)
        .get()
        .then(doc => {
          const listing = {
            ...doc.data(),
            id: doc.id
          };
          if (listing.seed) {
            listing.logo = `${
              process.env.REACT_APP_IMGIX_HOST
            }/nugl/grey-logo.png`;
            listing.banner = `${
              process.env.REACT_APP_IMGIX_HOST
            }/nugl/banner.jpg`;
          } else {
            listing.logo = `${process.env.REACT_APP_IMGIX_HOST}/listings/${
              doc.id
            }/logo.jpg`;
            listing.banner = `${process.env.REACT_APP_IMGIX_HOST}/listings/${
              doc.id
            }/banner.jpg`;
          }
          return listing;
        }),
      firestore
        .collection("reviews")
        .where("listingId", "==", listingUrlId)
        .orderBy("createdOn", "desc")
        .limit(10)
        .get()
        .then(snapshot => {
          let reviews = [];
          snapshot.forEach(doc => {
            reviews.push({
              id: doc.id,
              ...doc.data()
            });
          });
          return reviews;
        })
    ]).then(results => {
      this.setState({ listing: results[0], reviews: results[1] });
    });
  }

  handleChangeTab = (event, value) => this.setState({ tabIndex: value });

  handleReviewDialogOpen = open => () => {
    this.setState({ reviewDialogOpen: open });
  };

  handleSubmitReview = review => {
    this.props
      .addReview(this.state.listing.id, review)
      .then(() => {
        this.props.success("Your review has been submitted.");
      })
      .catch(error => {
        if (error.code === "ALREADY_REVIEWED") {
          this.props.error("You have already reviewed this listing.");
        } else {
          this.props.error("There was an error submitting your review.");
        }
      });
  };

  render() {
    const { user, classes } = this.props;
    const { tabIndex, listing, reviewDialogOpen } = this.state;
    const location = listing.location
      ? { lat: listing.location.latitude, lng: listing.location.longitude }
      : null;
    return (
      <div>
        <Imgix
          className={classes.banner}
          src={listing.banner}
          entropy={false}
          fit="crop"
          crop="edges"
          type="bg"
        >
          <div className={classes.gradient} />
          <Avatar className={classes.avatar}>
            <Imgix
              className={classes.logo}
              src={listing.logo}
              height={200}
              width={200}
              fit="crop"
            />
          </Avatar>
          <div className={classes.header} />
        </Imgix>

        <div className={classes.title}>
          <div>
            <Typography variant="title" gutterBottom>
              {listing.name}
            </Typography>
            <Typography variant="subheading" gutterBottom>
              {listing.city} {listing.state}
            </Typography>
            <div className={classes.ratingContainer}>
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
              <Typography variant="caption" className={classes.ratingText}>
                {listing.ratings
                  ? `${(listing.ratings.averageAverage / 2.0).toFixed(1)} BY ${
                      listing.ratings.averageCount
                    } REVIEW${listing.ratings.averageCount === 1 ? "" : "S"}`
                  : "NO REVIEWS"}
              </Typography>
            </div>
          </div>

          {user && (
            <Button
              onClick={this.handleReviewDialogOpen(true)}
              variant="raised"
              small
              color="secondary"
            >
              Leave Review
            </Button>
          )}
        </div>

        <div className={classes.content}>
          <Paper className={classes.paper}>
            <Tabs
              value={this.state.tabIndex}
              onChange={this.handleChangeTab}
              className={classes.tabs}
              centered
              fullWidth
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Details" icon={<StoreIcon />} />
              <Tab label="Hours" icon={<InsertInvitationIcon />} />
              <Tab label="Menu" icon={<MenuIcon />} disabled />
              <Tab label="Reviews" icon={<StarIcon />} />
            </Tabs>
            <div>
              {tabIndex === 0 && (
                <div className={classes.tabContainer}>
                  {location && (
                    <div className={classes.mapContainer}>
                      <GoogleMap
                        options={{
                          panControl: false,
                          mapTypeControl: false,
                          scrollwheel: false
                        }}
                        bootstrapURLKeys={{
                          v: "3.30",
                          key: `${process.env.REACT_APP_GOOGLE_API_KEY}`
                        }}
                        center={location}
                        defaultCenter={this.defaultCenter}
                        defaultZoom={12}
                      >
                        <Marker
                          key={`${listing.id}`}
                          lat={location.lat}
                          lng={location.lng}
                          listing={listing}
                        />
                      </GoogleMap>
                    </div>
                  )}
                  {listing.formattedAddress && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Address
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`http://maps.google.com/?q=${
                            listing.formattedAddress
                          }`}
                        >
                          {listing.formattedAddress}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {listing.phone && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Phone
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`tel:${listing.phone}`}
                        >
                          {listing.phone}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {listing.email && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Email
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`mailto:${listing.email}`}
                        >
                          {listing.email}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {listing.description && (
                    <Divider className={classes.divider} light />
                  )}
                  {listing.description && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        About Us
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        {listing.description}
                      </Typography>
                    </div>
                  )}
                  <Divider className={classes.divider} light />
                  {listing.website && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Website
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={listing.website}
                          target="_blank"
                        >
                          {listing.website}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {listing.facebook && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Facebook
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`https://www.facebook.com/${listing.facebook}`}
                          target="_blank"
                        >{`https://www.facebook.com/${listing.facebook}`}</a>
                      </Typography>
                    </div>
                  )}
                  {listing.twitter && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Twitter
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`https://www.twitter.com/${listing.twitter}`}
                          target="_blank"
                        >{`https://www.twitter.com/${listing.twitter}`}</a>
                      </Typography>
                    </div>
                  )}
                  {listing.instagram && (
                    <div className={classes.infoLine}>
                      <Typography
                        className={classes.infoTitle}
                        variant="body2"
                        gutterBottom
                      >
                        Instagram
                      </Typography>
                      <Typography
                        className={classes.infoValue}
                        variant="body1"
                        gutterBottom
                      >
                        <a
                          className={classes.link}
                          href={`https://www.instagram.com/${
                            listing.instagram
                          }`}
                          target="_blank"
                        >{`https://www.instagram.com/${listing.instagram}`}</a>
                      </Typography>
                    </div>
                  )}
                </div>
              )}

              {tabIndex === 1 && listing.hours ? (
                <div className={classes.tabContainer}>
                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Sunday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.sunday.open
                        ? `${moment(listing.hours.sunday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.sunday.to).format("LT")}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Monday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.monday.open
                        ? `${moment(listing.hours.monday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.monday.to).format("LT")}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Tuesday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.tuesday.open
                        ? `${moment(listing.hours.tuesday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.tuesday.to).format("LT")}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Wednesday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.wednesday.open
                        ? `${moment(listing.hours.wednesday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.wednesday.to).format(
                            "LT"
                          )}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Thursday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.thursday.open
                        ? `${moment(listing.hours.thursday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.thursday.to).format(
                            "LT"
                          )}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Friday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.friday.open
                        ? `${moment(listing.hours.friday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.friday.to).format("LT")}`
                        : "Closed"}
                    </Typography>
                  </div>

                  <div className={classes.infoLine}>
                    <Typography
                      className={classes.infoTitle}
                      variant="body2"
                      gutterBottom
                    >
                      Saturday
                    </Typography>
                    <Typography
                      className={classes.infoValue}
                      variant="body1"
                      gutterBottom
                    >
                      {listing.hours.saturday.open
                        ? `${moment(listing.hours.saturday.from).format(
                            "LT"
                          )} - ${moment(listing.hours.saturday.to).format(
                            "LT"
                          )}`
                        : "Closed"}
                    </Typography>
                  </div>
                </div>
              ) : (
                <div />
              )}

              {tabIndex === 3 && <Reviews reviews={this.state.reviews} />}
            </div>
          </Paper>
        </div>
        {reviewDialogOpen && (
          <ReviewDialog
            open={reviewDialogOpen}
            onClose={this.handleReviewDialogOpen(false)}
            onSubmit={this.handleSubmitReview}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    profile: state.profile
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, { success, error, addReview })(ListingPage)
);
