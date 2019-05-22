import React, { Component } from "react";
import { connect } from "react-redux";
import Imgix from "react-imgix";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import StoreIcon from "@material-ui/icons/Store";
import StarIcon from "@material-ui/icons/Star";
import MenuIcon from "@material-ui/icons/Menu";
import LocationOn from "@material-ui/icons/LocationOn";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Rating from "../common/Rating";
import SellDialog from "./SellDialog";
import Reviews from "./Reviews";
import Locations from "./Locations";
import { addReview } from "../../actions/reviewActions";
import { firestore } from "../../firebase";
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
    marginTop: "-65px",
    marginLeft: "10%",
    marginRight: "10%",
    paddingLeft: 200 + theme.spacing.unit * 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    minHeight: "120px",
    position: "relative",
    zIndex: "999"
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  ratingText: {
    marginTop: 2,
    marginLeft: theme.spacing.unit,
    color: "white"
  },
  content: {
    margin: `${theme.spacing.unit * 8}px 10% ${theme.spacing.unit * 4}px`,
    display: "flex",
    [theme.breakpoints.down("md")]: {
      margin: `${theme.spacing.unit * 8}px 10%`
    },
    [theme.breakpoints.down("sm")]: {
      margin: `${theme.spacing.unit * 8}px 5%`,
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

class BrandsPage extends Component {
  constructor(props) {
    super(props);
    this.defaultCenter = { lat: 34.048432, lng: -118.443075 };
    this.state = {
      tabIndex: 0,
      brand: {},
      sellDialogOpen: false,
      errors: {}
    };
  }

  componentDidMount() {
    const brandUrlId = this.props.match.params.id;
    console.log(brandUrlId);
    Promise.all([
      firestore
        .collection("brands")
        .doc(brandUrlId)
        .get()
        .then(doc => {
          const brand = {
            ...doc.data(),
            id: doc.id
          };
          if (brand.seed) {
            brand.logo = `${
              process.env.REACT_APP_IMGIX_HOST
            }/nugl/grey-logo.png`;
            brand.banner = `${
              process.env.REACT_APP_IMGIX_HOST
            }/nugl/banner.jpg`;
          } else {
            brand.logo = `${process.env.REACT_APP_IMGIX_HOST}/brands/${
              doc.id
            }/logo.jpg`;
            brand.banner = `${process.env.REACT_APP_IMGIX_HOST}/brands/${
              doc.id
            }/banner.jpg`;
          }
          return brand;
        })
      // firestore
      //   .collection("reviews")
      //   .where("brandId", "==", brandUrlId)
      //   .orderBy("createdOn", "desc")
      //   .limit(10)
      //   .get()
      //   .then(snapshot => {
      //     let reviews = [];
      //     snapshot.forEach(doc => {
      //       reviews.push({
      //         id: doc.id,
      //         ...doc.data()
      //       });
      //     });
      //     return reviews;
      //   })
    ]).then(results => {
      this.setState({ brand: results[0], reviews: results[1] });
    });
  }

  handleChangeTab = (event, value) => this.setState({ tabIndex: value });

  handleSellDialogOpen = open => () => {
    this.setState({ sellDialogOpen: open });
  };

  handleSubmitReview = review => {
    this.props
      .addReview(this.state.brand.id, review)
      .then(() => {
        this.props.success("Your review has been submitted.");
      })
      .catch(error => {
        if (error.code === "ALREADY_REVIEWED") {
          this.props.error("You have already reviewed this brand.");
        } else {
          this.props.error("There was an error submitting your review.");
        }
      });
  };

  render() {
    const { user, classes } = this.props;
    const { tabIndex, brand, sellDialogOpen } = this.state;
    console.log(brand);
    return (
      <div>
        <Imgix
          className={classes.banner}
          src={brand.banner || ""}
          entropy={false}
          fit="crop"
          crop="edges"
          type="bg"
        >
          <div className={classes.gradient} />
          <Avatar className={classes.avatar}>
            <Imgix
              className={classes.logo}
              src={brand.logo || ""}
              height={200}
              width={200}
              fit="crop"
            />
          </Avatar>
          <div className={classes.header} />
        </Imgix>

        <div className={classes.title}>
          <div>
            <Typography variant="title" gutterBottom style={{ color: "white" }}>
              {brand.name}
            </Typography>
            <div className={classes.ratingContainer}>
              <Rating
                rating={brand.ratings ? brand.ratings.averageAverage : 0}
                tooltipText={
                  brand.ratings
                    ? `${(brand.ratings.averageAverage / 2.0).toFixed(1)} by ${
                        brand.ratings.averageCount
                      } review${brand.ratings.averageCount === 1 ? "" : "s"}`
                    : "No Reviews"
                }
              />
              <Typography variant="caption" className={classes.ratingText}>
                {brand.ratings
                  ? `${(brand.ratings.averageAverage / 2.0).toFixed(1)} BY ${
                      brand.ratings.averageCount
                    } REVIEW${brand.ratings.averageCount === 1 ? "" : "S"}`
                  : "NO REVIEWS"}
              </Typography>
            </div>
          </div>

          {user && (
            <Button
              onClick={this.handleSellDialogOpen(true)}
              variant="raised"
              small="true"
              color="primary"
            >
              SELL THIS BRAND
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
              <Tab label="Locations" icon={<LocationOn />} />
              <Tab label="Menu" icon={<MenuIcon />} disabled />
              <Tab label="Reviews" icon={<StarIcon />} />
            </Tabs>
            <div>
              {tabIndex === 0 && (
                <div className={classes.tabContainer}>
                  {brand.phone && (
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
                        <a className={classes.link} href={`tel:${brand.phone}`}>
                          {brand.phone}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {brand.email && <Divider className={classes.divider} light />}
                  {brand.email && (
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
                          href={`mailto:${brand.email}`}
                        >
                          {brand.email}
                        </a>
                      </Typography>
                    </div>
                  )}
                  {brand.description && (
                    <Divider className={classes.divider} light />
                  )}
                  {brand.description && (
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
                        {brand.description}
                      </Typography>
                    </div>
                  )}
                  <Divider className={classes.divider} light />
                  {brand.website && (
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
                          href={brand.website}
                          target="_blank"
                        >
                          {brand.website}
                        </a>
                      </Typography>
                    </div>
                  )}
                </div>
              )}
              {tabIndex === 1 && <Locations />}
              {tabIndex === 3 && <Reviews reviews={this.state.reviews || []} />}
            </div>
          </Paper>
        </div>
        {sellDialogOpen && (
          <SellDialog
            open={sellDialogOpen}
            onClose={this.handleSellDialogOpen(false)}
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
  connect(mapStateToProps, { success, error, addReview })(BrandsPage)
);
