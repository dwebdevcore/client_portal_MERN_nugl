import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Rating from "../common/Rating";
import BusinessTypes, { Subtypes } from "../../const/BusinessTypes";
import { getNuglIcon, renderListingTypeIcon } from "../../util/IconUtil";

const styles = theme => ({
  main: {
    margin: theme.spacing.unit
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: 0
  },
  filter: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 80,
    justifyContent: "center",
    padding: theme.spacing.unit * 3,
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: 0,
      paddingTop: theme.spacing.unit * 2
    }
  },
  fields: {
    display: "flex",
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    }
  },
  attached: {
    paddingTop: 0
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  list: {
    width: "100%"
  },
  checkboxIcon: {
    margin: theme.spacing.unit
  },
  textField: {
    margin: 0
  },
  textFieldRoot: {
    padding: 0,
    margin: 0
  },
  textFieldInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 12px",
    width: "calc(100% - 24px)",
    margin: 0,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  }
});

class MapFilters extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        types: [],
        subtypes: [],
        openNow: false
      }
    };
  }

  handleTypeCheckChange = name => (event, checked) => {
    const types = checked
      ? [...this.state.filters.types, event.target.value]
      : [...this.state.filters.types.filter(e => e !== event.target.value)];
    const filters = { ...this.state.filters, types };
    this.setState({ filters });
  };

  handleSubtypeCheckChange = name => (event, checked) => {
    const subtypes = checked
      ? [...this.state.filters.subtypes, event.target.value]
      : [...this.state.filters.subtypes.filter(e => e !== event.target.value)];
    const filters = { ...this.state.filters, subtypes };
    this.setState({ filters });
  };

  handleServiceSubtypeChange = event => {
    const subtypes = [
      ...this.state.filters.subtypes.filter(e => e !== event.target.value),
      event.target.value
    ];
    const filters = { ...this.state.filters, subtypes };
    this.setState({ filters });
  };

  handleCheckChange = name => event => {
    let filters = { ...this.state.filters };
    filters[name] = event.target.checked;
    this.setState({ filters });
  };

  render() {
    const { classes } = this.props;
    const serviceSubtypes = Subtypes.filter(
      s => s.type === BusinessTypes.SERVICE
    )[0].subtypes.map(s => s);
    const filteredServiceSubtypes = serviceSubtypes.filter(
      e => this.state.filters.subtypes.indexOf(e) > -1
    );
    return (
      <div className={classes.main}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Filters</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Type</Typography>
              </div>
              <div className={classes.fields}>
                <List className={classes.list} dense={true}>
                  {Subtypes.map(e => {
                    const type = e.type;
                    return (
                      <ListItem key={type} dense={true} button>
                        {renderListingTypeIcon(type)}
                        <ListItemText primary={type} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            checked={
                              this.state.filters.types.indexOf(type) >= 0
                            }
                            onChange={this.handleTypeCheckChange(type)}
                            value={type}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Subtypes</Typography>
              </div>
              <div className={classes.fields}>
                <List className={classes.list} dense={true}>
                  {Subtypes.filter(
                    e => e.type === BusinessTypes.DISPENSARY
                  ).map(e => {
                    const subtypes = e.subtypes;
                    return subtypes.map(subtype => {
                      return (
                        <ListItem key={subtype} dense={true} button>
                          {getNuglIcon(subtype)}
                          <ListItemText primary={subtype} />
                          <ListItemSecondaryAction>
                            <Checkbox
                              checked={
                                this.state.filters.subtypes.indexOf(subtype) >=
                                0
                              }
                              onChange={this.handleSubtypeCheckChange(subtype)}
                              value={subtype}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    });
                  })}
                </List>
              </div>
            </div>
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Service Types</Typography>
              </div>
              <div className={classes.fields}>
                <TextField
                  id="serviceSubtype"
                  value={""}
                  select
                  fullWidth
                  onChange={this.handleServiceSubtypeChange}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      root: classes.textFieldRoot,
                      input: classes.textFieldInput
                    }
                  }}
                >
                  {Subtypes.filter(e => e.type === BusinessTypes.SERVICE).map(
                    e => {
                      const subtypes = e.subtypes;
                      return subtypes.map(subtype => {
                        return (
                          <MenuItem key={subtype} value={subtype}>
                            {subtype}
                          </MenuItem>
                        );
                      });
                    }
                  )}
                </TextField>
              </div>
            </div>
            {filteredServiceSubtypes.length > 0 && (
              <div className={classes.filter}>
                <div className={classNames(classes.label, classes.attached)} />
                <div className={classNames(classes.fields, classes.attached)}>
                  <List dense={true} className={classes.list}>
                    {this.state.filters.subtypes
                      .filter(e => serviceSubtypes.indexOf(e) > -1)
                      .map(subtype => {
                        return (
                          <ListItem key={subtype}>
                            <ListItemText primary={subtype} />
                            <ListItemSecondaryAction>
                              <IconButton aria-label="Delete">
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
              </div>
            )}
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Rating</Typography>
              </div>
              <div className={classes.fields}>
                <Rating rating={0} />
              </div>
            </div>
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Keywords</Typography>
              </div>
              <div className={classes.fields}>
                <TextField
                  id="name"
                  value={""}
                  fullWidth
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      root: classes.textFieldRoot,
                      input: classes.textFieldInput
                    }
                  }}
                />
              </div>
            </div>
            <Divider />
            <div className={classes.filter}>
              <div className={classes.label}>
                <Typography variant="caption">Open Now</Typography>
              </div>
              <div className={classes.fields}>
                <Switch
                  checked={Boolean(this.state.filters.openNow)}
                  onChange={this.handleCheckChange("openNow")}
                  value={"openNow"}
                />
              </div>
            </div>
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            <Button size="small">Clear Filters</Button>
            <Button size="small" color="primary">
              Apply
            </Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );
  }
}

MapFilters.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapFilters);
