import React, { Component } from "react";
import GoogleMap from "google-map-react";

class NuglGoogleMap extends Component {
  static defaultProps = {
    markers: [],
    zoom: 12
  };

  createMapOptions = maps => {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: true
      //styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
    };
  };

  handleChildClick = e => {
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(e);
    }
  };

  handleChildMouseEnter = shopId => {
    if (this.props.onMarkerMouseEnter) {
      this.props.onMarkerMouseEnter(shopId);
    }
  };

  handleChildMouseLeave = shopId => {
    if (this.props.onMarkerMouseLeave) {
      this.props.onMarkerMouseLeave(shopId);
    }
  };

  handleBoundsChanged = info => {
    if (this.props.onBoundsChange) {
      this.props.onBoundsChange(info);
    }
  };

  render() {
    return (
      <GoogleMap
        options={this.createMapOptions}
        bootstrapURLKeys={{
          v: "3.30",
          key: `${process.env.REACT_APP_GOOGLE_API_KEY}`
        }}
        center={this.props.center}
        defaultCenter={this.props.defaultCenter}
        defaultZoom={this.props.zoom}
        onChange={this.handleBoundsChanged}
        onChildClick={this.handleChildClick}
        onChildMouseEnter={this.handleChildMouseEnter}
        onChildMouseLeave={this.handleChildMouseLeave}
      >
        {this.props.children}
      </GoogleMap>
    );
  }
}

export default NuglGoogleMap;
