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
  },
  list: {
    width: 300,
    color: theme.palette.common.white
  },
  subheader: {
    color: "#959595"
  },
  menuItem: {
    color: theme.palette.common.white,
    borderLeft: "solid 4px transparent",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fill: theme.palette.common.white,
    "&:hover": {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
      borderLeft: `solid 4px ${theme.palette.primary.main}`,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }
  },
  listItemText: {
    paddingLeft: 0,
    color: "inherit"
  },
  firstItem: {
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },
  icon: {
    fill: "inherit"
  },
  version: {
    color: theme.palette.primary.main
  }
});

class NuglDrawer extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const {
      open,
      authenticated,
      onToggleDrawer,
      onSignIn,
      onSignOut,
      onLinkClicked,
      onExternalLinkClicked,
      classes
    } = this.props;
    return (
      <Drawer
        open={open}
        anchor="right"
        onClose={onToggleDrawer(false)}
        classes={{
          paper: classes.main
        }}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={onToggleDrawer(false)}
          onKeyDown={onToggleDrawer(false)}
        >
          <List className={classes.list}>
            <MenuItem
              className={classNames(classes.menuItem, classes.firstItem)}
              onClick={onExternalLinkClicked("http://www.nugl.com")}
            >
              Home
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={onLinkClicked("/")}>
              <ListItemIcon>
                <SearchIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary="Search NUGL"
                disableTypography
              />
            </MenuItem>
            {!authenticated && (
              <MenuItem
                className={classes.menuItem}
                onClick={onLinkClicked("/sign-up")}
              >
                <ListItemIcon>
                  <PersonIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Sign Up"
                  disableTypography
                />
              </MenuItem>
            )}
            {authenticated && (
              <MenuItem
                className={classes.menuItem}
                onClick={onLinkClicked("/account/profile")}
              >
                <ListItemIcon>
                  <AccountBoxIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Account"
                  disableTypography
                />
              </MenuItem>
            )}
            {!authenticated && (
              <MenuItem className={classes.menuItem} onClick={onSignIn}>
                <ListItemIcon>
                  <LockOpenIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Log In"
                  disableTypography
                />
              </MenuItem>
            )}
            {authenticated && (
              <MenuItem className={classes.menuItem} onClick={onSignOut}>
                <ListItemIcon>
                  <LockOutlineIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Log Out"
                  disableTypography
                />
              </MenuItem>
            )}
            <ListSubheader className={classes.subheader}>
              ABOUT US
            </ListSubheader>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked("http://www.nugl.com/about.html")}
            >
              What is NUGL?
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked(
                "http://www.nugl.com/about.html#team"
              )}
            >
              Meet our Team
            </MenuItem>
            <MenuItem
              className={classNames(classes.menuItem, classes.firstItem)}
              onClick={onExternalLinkClicked(
                "http://www.nugl.com/advertise.html"
              )}
            >
              Advertising with NUGL
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked("http://www.nugl.com/invest.html")}
            >
              Investment Opportunities
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked("http://www.nugl.com/press.html")}
            >
              NUGL in the Press
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked(
                "http://www.nugl.com/contact.html"
              )}
            >
              Contact Us
            </MenuItem>
            <ListSubheader className={classes.subheader}>
              CONNECT WITH US
            </ListSubheader>
            <MenuItem
              className={classNames(classes.menuItem, classes.firstItem)}
              onClick={onExternalLinkClicked(
                "https://www.facebook.com/justnuglit/"
              )}
            >
              Facebook
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={onExternalLinkClicked("https://twitter.com/JustNUGLit")}
            >
              Twitter
            </MenuItem>
            <MenuItem
              className={classNames(classes.menuItem, classes.firstItem)}
              onClick={onExternalLinkClicked(
                "https://www.instagram.com/justnuglit/"
              )}
            >
              Instagram
            </MenuItem>
            <ListSubheader className={classes.subheader}>
              2018 &copy; NUGL inc.&nbsp;&nbsp;&nbsp;<a
                className={classes.version}
                href="http://www.nugl.com/about.html#release_notes"
              >
                v1.1.0
              </a>
            </ListSubheader>
          </List>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(NuglDrawer);
