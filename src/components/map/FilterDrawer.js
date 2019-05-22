import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Divider from "@material-ui/core/Divider";
import BusinessTypes, { Subtypes } from "../../const/BusinessTypes";
import { getNuglIcon, renderListingTypeIcon } from "../../util/IconUtil";

const styles = theme => ({
  main: {
    width: 300
  },
  field: {
    padding: theme.spacing.unit
  },
  collapsableSubheader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 4
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  list: {
    width: "100%"
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
      openPanels: {
        type: true,
        subtype: true,
        services: true
      },
      filters: {
        type: [],
        services: []
      }
    };
  }

  handleTypeCheckChange = name => (event, checked) => {
    const types = checked
      ? [...this.state.filters.type, event.target.value]
      : [...this.state.filters.type.filter(e => e !== event.target.value)];
    const filters = { ...this.state.filters, type: types };
    this.setState({ filters });
    this.props.updateFilter(filters);
  };

  handleServiceCheckChange = name => (event, checked) => {
    const services = checked
      ? [...this.state.filters.services, event.target.value]
      : [...this.state.filters.services.filter(e => e !== event.target.value)];
    const filters = { ...this.state.filters, services };
    this.setState({ filters });
    this.props.updateFilter(filters);
  };

  handleCheckChange = name => event => {
    let filters = { ...this.state.filters };
    filters[name] = event.target.checked;
    this.setState({ filters });
    this.props.updateFilter(filters);
  };

  handleCollapseClick = name => () => {
    const openPanels = { ...this.state.openPanels };
    openPanels[name] = !openPanels[name];
    this.setState({ openPanels });
  };

  render() {
    const { open, onToggleDrawer, classes } = this.props;
    return (
      <Drawer
        open={open}
        anchor="right"
        onClose={onToggleDrawer(false)}
        classes={{
          paper: classes.main
        }}
      >
        <div tabIndex={0} role="button">
          <List className={classes.list} dense={true}>
            <ListSubheader
              disableSticky
              className={classes.collapsableSubheader}
              onClick={this.handleCollapseClick("type")}
            >
              <span>Business Type</span>
              <IconButton>
                {this.state.openPanels.type ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </ListSubheader>
            <Collapse
              in={this.state.openPanels.type}
              timeout="auto"
              unmountOnExit
            >
              {Subtypes.map(e => {
                const type = e.type;
                return (
                  <ListItem key={type} dense={true} button>
                    {renderListingTypeIcon(type)}
                    <ListItemText primary={type} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={
                          this.state.filters.type.indexOf(type) >= 0 || true
                        }
                        onChange={this.handleTypeCheckChange(type)}
                        value={type}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </Collapse>
          </List>
          <Divider />
          <List className={classes.list} dense={true}>
            <ListSubheader
              disableSticky
              className={classes.collapsableSubheader}
              onClick={this.handleCollapseClick("subtype")}
            >
              <span>Dispensary Type</span>
              <IconButton>
                {this.state.openPanels.subtype ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </ListSubheader>
            <Collapse
              in={this.state.openPanels.subtype}
              timeout="auto"
              unmountOnExit
            >
              {Subtypes.filter(e => e.type === BusinessTypes.DISPENSARY).map(
                e => {
                  const subtypes = e.subtypes;
                  return subtypes.map(subtype => {
                    return (
                      <ListItem key={subtype} dense={true} button>
                        {getNuglIcon(subtype)}
                        <ListItemText primary={subtype} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            checked={
                              this.state.filters.services.indexOf(subtype) >=
                                0 || true
                            }
                            onChange={this.handleServiceCheckChange(subtype)}
                            value={subtype}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  });
                }
              )}
            </Collapse>
          </List>
          <Divider />
          <List dense={true} className={classes.list} button>
            <ListSubheader
              disableSticky
              className={classes.collapsableSubheader}
              onClick={this.handleCollapseClick("services")}
            >
              <span>Service Type</span>
              <IconButton>
                {this.state.openPanels.services ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </ListSubheader>
            <Collapse
              in={this.state.openPanels.services}
              timeout="auto"
              unmountOnExit
            >
              {Subtypes.filter(
                e => e.type === BusinessTypes.SERVICE
              )[0].subtypes.map(subtype => {
                return (
                  <ListItem key={subtype}>
                    <ListItemText primary={subtype} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={
                          this.state.filters.services.indexOf(subtype) >= 0 ||
                          true
                        }
                        onChange={this.handleServiceCheckChange(subtype)}
                        value={subtype}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </Collapse>
          </List>
        </div>
      </Drawer>
    );
  }
}

MapFilters.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapFilters);
