import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { strains } from "../listings/BusinessStrains";
import EditDialog from "./EditDialog";

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
  details: {
    display: "flex",
    justifyContent: "space-between",
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
    flexBasis: "100%"
  },
  logoPreviewCropped: {
    width: 75,
    height: 75,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 75px",
    borderColor: "#80bdff"
  }
});

class BrandPanel extends React.PureComponent {
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
    const { brand, classes, onPublishToggle, onSubmit } = this.props;
    console.log(brand);
    return (
      <Fragment>
        <EditDialog
          {...this.state}
          brand={brand}
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
                src={`${brand.logo}?w=60&h=60&fit=crop`}
                title={brand.name}
                alt={brand.name}
              />
            </div>
            <div className={classes.heading}>
              <Typography variant="subheading">{brand.name}</Typography>
              <Typography variant="caption">{brand.type}</Typography>
            </div>
            <div className={classes.buttons} />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <div className={classes.actions}>
              <List>
                <ListItem>
                  <ListItemText primary="Publish" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={brand.publish}
                      onChange={onPublishToggle(brand, Boolean(!brand.publish))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Brand Name"
                    secondary={
                      <Fragment>
                        Name: {brand.name}
                        <br />
                        Url: {brand.id}
                      </Fragment>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Brand Info"
                    secondary={
                      <Fragment>
                        Description: {brand.description}
                        <br />
                        Phone: {brand.phone}
                        <br />
                        Email: {brand.email}
                        <br />
                        Website: {brand.website}
                      </Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.handleClick("info")}
                    >
                      Edit
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Logo"
                    secondary={
                      <div
                        className={classes.logoPreviewCropped}
                        style={{
                          backgroundImage: `url(${brand.logo})`
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
                          backgroundImage: `url(${brand.banner})`
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
                    primary="Business Services"
                    secondary={brand.services.map(service => (
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
                    primary="Strains"
                    secondary={brand.strains.map(strain => {
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
              </List>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Fragment>
    );
  }
}

BrandPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BrandPanel);
