import React, { Component } from "react";
import { connect } from "react-redux";
import GridContainer from "./GridContainer";
import AlgoliaApi from "../../api/AlgoliaApi";
import { setCenterMapLocation } from "../../actions/mapActions";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.defaultCenter = props.map.center;
    this.state = {
      searchText: null,
      popoverEl: null,
      tabIndex: 0,
      mapRef: {},
      results: [],
      hoveredResultId: null,
      selectedResult: null,
      filtersOpen: false,
      filters: {}
    };
  }

  componentWillUpdate() {
    if (!this.state.selectedResult) {
      // This fixed the issue where you have to blur then focus back on
      // search bar to get autocomplete to work after activating popover.
      document.activeElement.blur();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.pointsAreEqual(this.props.map.center, nextProps.map.center)) {
      const { markerId } = this.props.map;
      if (markerId && nextProps.map.markerId !== markerId) {
        this.handleMarkerClick(markerId);
      }
    }
  }

  handleFilterChanged = filters => {
    this.setState({ filters });
  };

  handleBoundsChanged = ({ bounds, center, ...other }) => {
    const currentLocation = this.props.map.currentLocation;
    const filters = this.state.filters;
    AlgoliaApi.geoSearch(bounds.nw, bounds.se, currentLocation, filters).then(
      results => {
        const { markerId } = this.props.map;
        this.props.setCenterMapLocation({
          lat: parseFloat(center.lat.toFixed(9)),
          lng: parseFloat(center.lng.toFixed(9))
        });
        this.setState({ results, loading: false });
        if (markerId) {
          this.handleMarkerClick(markerId);
        }
      }
    );
  };

  handleMarkerClick = id => {
    const result = this.state.results.filter(e => e.id === id)[0];
    this.setState({ selectedResult: result, loading: false });
  };

  handleMarkerMouseEnter = id => this.setState({ hoveredResultId: id });

  handleMarkerMouseLeave = id => this.setState({ hoveredResultId: null });

  handleListingClick = result => () => {
    this.selectAndCenterOnMarker(result);
  };

  handlePopoverClose = () => this.setState({ selectedResult: null });

  handleNavigateToListing = listing => () => {
    this.props.history.push(`/listings/${listing.id}`);
  };

  selectAndCenterOnMarker = result => {
    this.props.setCenterMapLocation({
      lat: result.listing.location.lat,
      lng: result.listing.location.lon
    });
    this.setState({ selectedResult: result, loading: true });
  };

  pointsAreEqual = (bounds1, bounds2) => {
    if (!bounds1 || !bounds2) {
      return false;
    }
    const toPrecise = e => Number.parseFloat(e).toPrecision(9);
    const areEqual =
      toPrecise(bounds1.lat) === toPrecise(bounds2.lat) &&
      toPrecise(bounds1.lng) === toPrecise(bounds2.lng);
    return areEqual;
  };

  handleToggleFilterDrawer = open => () => {
    this.setState({ filtersOpen: open });
  };

  render() {
    const { map } = this.props;
    const {
      results,
      selectedResult,
      hoveredResultId,
      loading,
      ready,
      filtersOpen
    } = this.state;
    return (
      <GridContainer
        map={map}
        results={results}
        ready={ready}
        loading={loading}
        filtersOpen={filtersOpen}
        selectedResult={selectedResult}
        hoveredResultId={hoveredResultId}
        defaultCenter={this.defaultCenter}
        onMarkerMouseEnter={this.handleMarkerMouseEnter}
        onMarkerMouseLeave={this.handleMarkerMouseLeave}
        onBoundsChange={this.handleBoundsChanged}
        onMarkerClick={this.handleMarkerClick}
        onListingClick={this.handleListingClick}
        onPopoverClose={this.handlePopoverClose}
        onNavigateToListing={this.handleNavigateToListing}
        onToggleFilterDrawer={this.handleToggleFilterDrawer}
        updateFilter={this.handleFilterChanged}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    map: state.map,
    authenticated: state.user && state.user.authenticated
  };
}

export default connect(mapStateToProps, { setCenterMapLocation })(MapPage);
