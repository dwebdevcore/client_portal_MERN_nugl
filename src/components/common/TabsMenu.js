import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PlaceIcon from "@material-ui/icons/Place";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

const styles = theme => ({
  tabs: {
    backgroundColor: theme.palette.common.white,
    borderTop: `solid 1px ${theme.palette.grey["200"]}`,
    borderBottom: `solid 1px ${theme.palette.grey["200"]}`
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  }
});

const paths = [
  "/account/profile",
  "/account/listings",
  "/account/brands",
  "/account/favorites"
];

class TabMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }

  componentWillMount() {
    const { pathname } = this.props.location;
    this.setState({ tabIndex: paths.indexOf(pathname) });
  }

  handleChangeTab = (event, value) => this.props.history.push(paths[value]);

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <Tabs
          value={this.state.tabIndex}
          onChange={this.handleChangeTab}
          className={classes.tabs}
          centered
          fullWidth
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Profile" icon={<AccountBoxIcon />} />
          <Tab label="Listings" icon={<PlaceIcon />} />
          <Tab label="Brands" icon={<LocalOfferIcon />} />
          {/*<Tab label="Favorites" icon={<FavoriteIcon />} disabled />*/}
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(TabMenu));
