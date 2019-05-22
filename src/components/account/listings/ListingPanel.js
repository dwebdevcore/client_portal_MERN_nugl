import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import MapIcon from "@material-ui/icons/Map";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditDialog from "./EditDialog";
import { strains } from "./BusinessStrains";

const styles = theme => ({
  summary: {
    display: "flex",
    justifyContent: "space-between"
  },
  logo: {
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  banner: {
    width: "100%",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      height: 75
    }
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    flexGrow: 2,
    [theme.breakpoints.down("xs")]: {
      width: 50
    }
  },
  buttons: {
    display: "flex",
    alignItems: "center"
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  details: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  info: {
    paddingRight: theme.spacing.unit * 3,
    flexGrow: 2,
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0
    }
  },
  actions: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    flexBasis: "33%",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "auto",
      borderLeft: "none"
    }
  },
  logoPreviewCropped: {
    width: 75,
    height: 75,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 75px",
    borderColor: "#80bdff"
  },
  bannerPreviewCropped: {
    width: 300,
    height: 150,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 150px",
    borderColor: "#80bdff"
  },
  operatingHours: {
    display: "block",
    width: "50%"
  },
  socialMedia: {
    display: "block",
    width: "75%",
    overflowWrap: "break-word"
  },
  dividerMargin: {
    marginTop: "2px",
    marginBottom: "2px"
  }
});

class ListingPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      type: ""
    };
  }

  handleClick = type => () =>
    this.setState({
      editing: true,
      type
    });

  handleCloseDialog = () =>
    this.setState({
      editing: false,
      type: ""
    });

  render() {
    const {
      listing,
      onMapButtonClick,
      onPublishToggle,
      onSubmit,
      classes
    } = this.props;

    return (
      <Fragment>
        <EditDialog
          {...this.state}
          shop={listing}
          onClose={this.handleCloseDialog}
          onSubmit={onSubmit}
        />
        <ExpansionPanel>
          <ExpansionPanelSummary
            className={classes.summary}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={classes.logo}>
              <img
                src={`${listing.logo}?w=60&h=60&fit=crop`}
                title={listing.name}
                alt={listing.name}
              />
            </div>
            <div className={classes.heading}>
              <Typography variant="subheading">{listing.name}</Typography>
              <Typography variant="caption">{listing.type}</Typography>
            </div>
            <div className={classes.buttons}>
              <Tooltip
                id="tooltip-bottom"
                title={listing.formattedAddress}
                placement="bottom"
              >
                <IconButton
                  onClick={onMapButtonClick(listing.location, listing.id)}
                  disabled={Boolean(!listing.publish)}
                >
                  <MapIcon />
                </IconButton>
              </Tooltip>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <List>
              <ListItem>
                <ListItemText primary="Publish" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={listing.publish}
                    onChange={onPublishToggle(
                      listing,
                      Boolean(!listing.publish)
                    )}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Business Name"
                  secondary={
                    <Fragment>
                      Name: {listing.name}
                      <br />
                      Url: {listing.id}
                    </Fragment>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Business Info"
                  secondary={
                    <Fragment>
                      Description: {listing.description}
                      <br />
                      Phone: {listing.phone}
                      <br />
                      Email: {listing.email}
                      <br />
                      Website: {listing.website}
                    </Fragment>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Logo"
                  secondary={
                    <div
                      className={classes.logoPreviewCropped}
                      style={{
                        backgroundImage: `url(${listing.logo})`
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("logo")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Banner"
                  secondary={
                    <div
                      className={classes.logoPreviewCropped}
                      style={{
                        backgroundImage: `url(${listing.banner})`
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("banner")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className={"test-test"}
                  primary="Shop Address"
                  secondary={
                    <Fragment>
                      Address: {listing.address}
                      <br />
                      City: {listing.city}
                      <br />
                      State: {listing.state}
                      <br />
                      Zip Code: {listing.zip}
                    </Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("address")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Business Type"
                  secondary={listing.type}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("type")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Business Services"
                  secondary={listing.services.map(service => (
                    <Fragment key={service}>
                      {service}
                      <br />
                    </Fragment>
                  ))}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("services")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operating Hours"
                  secondary={
                    listing.hours && (
                      <Fragment>
                        <span className={classes.operatingHours}>
                          Monday:{" "}
                          {listing.hours.monday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.monday.from).format(
                            "hh:mm A"
                          )}{" "}
                          - {moment(listing.hours.monday.to).format("hh:mm A")}
                          <Divider className={classes.dividerMargin} />
                        </span>
                        <span className={classes.operatingHours}>
                          Tuesday:{" "}
                          {listing.hours.tuesday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.tuesday.from).format(
                            "hh:mm A"
                          )}{" "}
                          - {moment(listing.hours.tuesday.to).format("hh:mm A")}
                          <Divider className={classes.dividerMargin} />
                        </span>
                        <span className={classes.operatingHours}>
                          Wednesday:{" "}
                          {listing.hours.wednesday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.wednesday.from).format(
                            "hh:mm A"
                          )}{" "}
                          -{" "}
                          {moment(listing.hours.wednesday.to).format("hh:mm A")}
                          <Divider className={classes.dividerMargin} />
                        </span>
                        <span className={classes.operatingHours}>
                          Thursday:{" "}
                          {listing.hours.thursday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.thursday.from).format(
                            "hh:mm A"
                          )}{" "}
                          -{" "}
                          {moment(listing.hours.thursday.to).format("hh:mm A")}
                          <Divider className={classes.dividerMargin} />
                        </span>
                        <span className={classes.operatingHours}>
                          Friday:{" "}
                          {listing.hours.friday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.friday.from).format(
                            "hh:mm A"
                          )}{" "}
                          - {moment(listing.hours.friday.to).format("hh:mm A")}
                          <Divider className={classes.dividerMargin} />
                        </span>
                        <span className={classes.operatingHours}>
                          Saturday:{" "}
                          {listing.hours.saturday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.saturday.from).format(
                            "hh:mm A"
                          )}{" "}
                          -{" "}
                          {moment(listing.hours.saturday.to).format("hh:mm A")}
                          <Divider />
                        </span>
                        <span className={classes.operatingHours}>
                          Sunday:{" "}
                          {listing.hours.saturday.open ? "OPENED" : "CLOSED"}{" "}
                          <br />
                          {moment(listing.hours.sunday.from).format(
                            "hh:mm A"
                          )}{" "}
                          - {moment(listing.hours.sunday.to).format("hh:mm A")}
                        </span>
                      </Fragment>
                    )
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("operatingHours")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Strains"
                  secondary={listing.strains.map(strain => {
                    const temp = strains.find(s => s.name === strain);
                    return (
                      <Fragment key={strain}>
                        {temp.category || "Other"} - {temp.name || ""}
                        <br />
                      </Fragment>
                    );
                  })}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("strains")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Social Media"
                  secondary={
                    <Fragment>
                      <span className={classes.socialMedia}>
                        Facebook:{" "}
                        {`https://www.facebook.com/${listing.facebook || ""}`}
                      </span>
                      <span className={classes.socialMedia}>
                        Twitter:{" "}
                        {`https://www.twitter.com/${listing.twitter || ""}`}
                      </span>
                      <span className={classes.socialMedia}>
                        Instagram:{" "}
                        {`https://www.instagram.com/${listing.instagram || ""}`}
                      </span>
                    </Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleClick("socialMedia")}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {/* <ListItem>
                <ListItemText
                  primary="Delete"
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="raised"
                    color="secondary"
                  >
                    DELETE
                  </Button>
                </ListItemSecondaryAction>
              </ListItem> */}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Fragment>
    );
  }
}

ListingPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListingPanel);
