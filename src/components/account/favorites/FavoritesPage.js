import React, { Component } from "react";
import { connect } from "react-redux";
import TabMenu from "../../common/TabsMenu";

class FavoritesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <TabMenu />
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

export default connect(mapStateToProps, {})(FavoritesPage);
