import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { push } from "react-router-redux";
import { withRouter } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
import { signOut } from "../../actions/userActions";
import NuglSearchBar from "./NuglSearchBar";
import LocationSearchBar from "./LocationSearchBar";
import NuglDrawer from "./NuglDrawer";
import {
  setCenterMapLocation,
  setCurrentLocation
} from "../../actions/mapActions";

const styles = theme => ({
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: 16,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0
    }
  },
  logo: {
    width: 360,
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing.unit
    }
  },
  side: {
    flexBasis: "25%",
    [theme.breakpoints.down("sm")]: {
      order: 0,
      paddingLeft: theme.spacing.unit,
      flexBasis: "calc(50% - 8px)"
    }
  },
  flexEnd: {
    display: "flex",
    justifyContent: "flex-end"
  },
  toolBar: {
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
      alignItems: "center",
      padding: 0
    }
  },
  searchArea: {
    display: "flex",
    flex: 2,
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      order: 1
    }
  },
  searchBox: {
    backgroundColor: "rgba(255,255,255,0.5)",
    display: "flex",
    padding: 4,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      flexGrow: 2
    }
  },
  signInButton: {
    color: theme.palette.common.white
  },
  searchButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    padding: 0,
    margin: 4,
    marginLeft: 0,
    height: 32,
    width: 80,
    borderRadius: 0,
    fontSize: ".7em"
  },
  photoButton: {
    marginLeft: theme.spacing.unit * 1,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  button: {
    margin: `0 ${theme.spacing.unit}px`
  },
  buttonIcon: {
    height: theme.spacing.unit * 2,
    width: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      drawerOpen: false
    };
  }

  handleChangeTab = (event, value) => {
    this.setState({ tabIndex: value });
  };

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignIn = () => {
    this.props.push("/sign-in");
  };

  handleSignOut = () => {
    this.props.signOut();
    this.props.push("/");
  };

  handleToggleDrawer = open => () => {
    this.setState({
      drawerOpen: open
    });
  };

  goto = path => () => {
    this.props.history.push(path);
  };

  changeWindowLocation = url => () => {
    window.location = url;
  };

  getCurrentPosition = () => {
    this.props.setCurrentLocation();
    if (this.props.location.pathname !== "/") {
      this.props.history.push("/");
    }
  };

  render() {
    const { authenticated, classes } = this.props;
    const { drawerOpen } = this.state;
    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolBar}>
          <div className={classes.side}>
            <a href="http://www.nugl.com">
              <img
                src={require("../../static/images/nav-brand-outline.svg")} // eslint-disable-line
                style={{ height: 32, marginTop: 5 }}
                alt="NUGL"
              />
            </a>
          </div>
          <div className={classes.searchArea}>
            <div className={classes.searchBox}>
              <NuglSearchBar />
              <LocationSearchBar />
              {/*<Button className={classes.searchButton} color="secondary">
                Search
    </Button>*/}
            </div>
          </div>
          {this.props.authenticated && (
            <div className={classNames(classes.side, classes.flexEnd)}>
              <IconButton
                onClick={() => this.props.push("/account/profile")}
                color="inherit"
                className={classes.photoButton}
              >
                {this.props.user.photoURL ? (
                  <Avatar
                    alt={this.props.user.displayName}
                    src={this.props.user.photoURL}
                  />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )}
              </IconButton>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.handleToggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}
          {!this.props.authenticated && (
            <div className={classNames(classes.side, classes.flexEnd)}>
              {/*<Button
              className={classes.signInButton}
                onClick={this.handleSignIn}
                color="default"
              >
                Sign In
              </Button>*/}
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.handleToggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}
        </Toolbar>
        <NuglDrawer
          open={drawerOpen}
          authenticated={authenticated}
          onToggleDrawer={this.handleToggleDrawer}
          onSignIn={this.handleSignIn}
          onSignOut={this.handleSignOut}
          onLinkClicked={this.goto}
          onExternalLinkClicked={this.changeWindowLocation}
        />
      </AppBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    authenticated: state.user && state.user.authenticated
  };
}

export default withStyles(styles)(
  withRouter(
    connect(mapStateToProps, {
      push,
      signOut,
      setCenterMapLocation,
      setCurrentLocation
    })(Header)
  )
);
