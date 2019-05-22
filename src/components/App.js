import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import NuglTheme from "./NuglTheme";
import Header from "./common/Header";
import Message from "./common/Message";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import MapPage from "./map/MapPage";
import ListingsPage from "./listings/ListingsPage";
import BrandsPage from "./brands/BrandsPage";
import AccountProfilePage from "./account/profile/ProfilePage";
import AccountListingsPage from "./account/listings/ListingsPage";
import AccountBrandsPage from "./account/brands/BrandsPage";
import AccountFavoritesPage from "./account/favorites/FavoritesPage";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={NuglTheme}>
        <ConnectedRouter history={this.props.history}>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={MapPage} />
              <Route exact path="/sign-in" component={SignInPage} />
              <Route exact path="/sign-up" component={SignUpPage} />
              <Route
                exact
                path="/forgot-password"
                component={ForgotPasswordPage}
              />
              <Route
                exact
                path="/account/profile"
                component={AccountProfilePage}
              />
              <Route
                exact
                path="/account/listings"
                component={AccountListingsPage}
              />
              <Route
                exact
                path="/account/brands"
                component={AccountBrandsPage}
              />
              <Route
                exact
                path="/account/favorites"
                component={AccountFavoritesPage}
              />
              <Route exact path="/listings/:id" component={ListingsPage} />
              <Route exact path="/brands/:id" component={BrandsPage} />
            </Switch>
          </div>
        </ConnectedRouter>
        <Message />
      </MuiThemeProvider>
    );
  }
}

export default App;
