import React, { PureComponent } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import SearchIcon from "@material-ui/icons/Search";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PersonIcon from "@material-ui/icons/Person";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockOutlineIcon from "@material-ui/icons/LockOutline";

const styles = theme => ({
  main: {
    backgroundColor: "#111111"
  }
});

class FilterDrawer extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

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
      />
    );
  }
}

export default withStyles(styles)(NuglDrawer);
