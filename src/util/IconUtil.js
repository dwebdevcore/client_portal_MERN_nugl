import React from "react";
import BusinessTypes from "../const/BusinessTypes";

export const ServiceMarker = () => {
  return (
    <img
      src={require("../static/images/pins/service.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Service"
    />
  );
};

export const ChurchMarker = () => {
  return (
    <img
      src={require("../static/images/pins/church.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Church"
    />
  );
};

export const BrandMarker = () => {
  return (
    <img
      src={require("../static/images/pins/brand.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Brand"
    />
  );
};

export const ShopMarker = () => {
  return (
    <img
      src={require("../static/images/pins/dispensary.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Dispensary"
    />
  );
};

export const LeafIcon = () => {
  return (
    <img
      src={require("../static/images/ic-leaf.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Dispensary"
    />
  );
};

export const ManIcon = () => {
  return (
    <img
      src={require("../static/images/ic-man.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Service"
    />
  );
};

export const VanIcon = () => {
  return (
    <img
      src={require("../static/images/ic-van.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Delivery"
    />
  );
};

export const ShopIcon = () => {
  return (
    <img
      src={require("../static/images/ic-shop.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Delivery"
    />
  );
};

export const ChurchIcon = () => {
  return (
    <img
      src={require("../static/images/categories/church.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Church"
    />
  );
};

export const OnlineShopIcon = () => {
  return (
    <img
      src={require("../static/images/ic-online.svg")} // eslint-disable-line
      style={{ height: 24, width: 24 }}
      alt="Online"
    />
  );
};

export const getNuglIcon = type => {
  switch (type) {
    case "Dispensary":
      return <LeafIcon />;
    case "Service":
      return <ManIcon />;
    case "Store Front":
      return <ShopIcon />;
    case "Delivery":
      return <VanIcon />;
    case "Online Shop":
      return <OnlineShopIcon />;

    case "Doctor":
      return <ManIcon />;
    case "Lawyer":
      return <ManIcon />;
    case "Consultant":
      return <ManIcon />;
    case "Investor":
      return <ManIcon />;
    case "Marketing":
      return <ManIcon />;
    case "Security":
      return <ManIcon />;
    case "Other":
      return <ManIcon />;

    default:
      return <LeafIcon />;
  }
};

export const renderListingTypeMarker = (type, hover, selected) => {
  if (hover) {
    switch (type) {
      case BusinessTypes.DISPENSARY:
        return <ShopMarker />;
      case BusinessTypes.SERVICE:
        return <ServiceMarker />;
      case BusinessTypes.BRAND:
        return <BrandMarker />;
      case BusinessTypes.CANNABIS:
        return <ShopMarker />;
      case BusinessTypes.CHURCH:
        return <ChurchMarker />;
      default:
        return <ShopMarker />;
    }
  } else {
    switch (type) {
      case BusinessTypes.DISPENSARY:
        return <ShopMarker />;
      case BusinessTypes.SERVICE:
        return <ServiceMarker />;
      case BusinessTypes.BRAND:
        return <BrandMarker />;
      case BusinessTypes.CANNABIS:
        return <ShopMarker />;
      case BusinessTypes.CHURCH:
        return <ChurchMarker />;
      default:
        return <ShopMarker />;
    }
  }
};

export const renderListingTypeIcon = (type, hover, selected) => {
  if (hover) {
    switch (type) {
      case BusinessTypes.DISPENSARY:
        return <LeafIcon />;
      case BusinessTypes.SERVICE:
        return <ManIcon />;
      case BusinessTypes.BRAND:
        return <LeafIcon />;
      case BusinessTypes.CANNABIS:
        return <LeafIcon />;
      case BusinessTypes.CHURCH:
        return <ChurchIcon />;
      default:
        return <LeafIcon />;
    }
  } else {
    switch (type) {
      case BusinessTypes.DISPENSARY:
        return <LeafIcon />;
      case BusinessTypes.SERVICE:
        return <ManIcon />;
      case BusinessTypes.BRAND:
        return <LeafIcon />;
      case BusinessTypes.CANNABIS:
        return <LeafIcon />;
      case BusinessTypes.CHURCH:
        return <ChurchIcon />;
      default:
        return <LeafIcon />;
    }
  }
};

export default {
  renderListingTypeIcon
};
