import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Map from "./Map";
import ListItem from "./ListItem";
import Marker from "./Marker";
import FilterDrawer from "./FilterDrawer";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";

const styles = theme => ({
  main: {
    position: "absolute",
    height: "calc(100% - 64px)",
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100% - 140px)"
    }
  },
  insetShadow: {
    position: "absolute",
    height: 5,
    width: "calc(100% - 0px)",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)",
    opacity: 0.3,
    zIndex: 1
  },
  grid: {
    flex: "1 1 auto",
    display: "flex",
    overflow: "hidden",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  left: {
    overflowY: "scroll",
    width: "500px",
    height: "100%",
    flexShrink: 0,
    order: 2,
    [theme.breakpoints.down("sm")]: {
      order: 2,
      height: "calc(100% - 300px)",
      width: "100%",
      flexShrink: 1,
      overflowY: "auto"
    },
    [theme.breakpoints.down("xs")]: {
      height: "calc(100% - 200px)"
    }
  },
  right: {
    flex: "1 1 auto",
    order: 1,
    [theme.breakpoints.down("sm")]: {
      order: 1,
      height: "200px"
    }
  },
  listHeader: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  noResults: {
    height: "50vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      height: "auto"
    }
  },
  noResultsImage: {
    width: 150,
    marginBottom: theme.spacing.unit * 2
  }
});

const GridContainer = ({
  map,
  results,
  selectedResult,
  hoveredResultId,
  defaultCenter,
  onMarkerMouseEnter,
  onMarkerMouseLeave,
  onBoundsChange,
  onMarkerClick,
  onListingClick,
  onPopoverClose,
  onNavigateToListing,
  onToggleFilterDrawer,
  updateFilter,
  ready,
  loading,
  filtersOpen,
  classes
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.grid}>
        <div className={classes.left}>
          <div className={classes.listHeader}>
            <div style={{ width: 48, height: 48 }} />
            <Typography variant="subheading" className={classes.heading}>
              {results.length} Result{results.length === 1 ? "" : "s"}
            </Typography>
            <IconButton onClick={onToggleFilterDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          </div>
          {results.length > 0 ? (
            <div>
              {results.map((result, index) => {
                return (
                  <ListItem
                    key={result.id}
                    listing={result.listing}
                    result={result}
                    onMouseEnter={() => onMarkerMouseEnter(result.id)}
                    onMouseLeave={() => onMarkerMouseLeave(result.id)}
                    hovered={hoveredResultId === result.id}
                    selected={Boolean(
                      selectedResult && selectedResult.id === result.id
                    )}
                    onClick={onListingClick(result)}
                  />
                );
              })}
            </div>
          ) : (
            <div className={classes.noResults}>
              <img
                className={classes.noResultsImage}
                src={require("../../static/images/search.gif")}
                alt="No Results Found"
              />
              <Typography variant="title" gutterBottom>
                Please look carefully.
              </Typography>
              <Typography variant="subheading" gutterBottom>
                No Dispensary, Delivery or Service found!
              </Typography>
            </div>
          )}
          <FilterDrawer
            open={filtersOpen}
            updateFilter={updateFilter}
            onToggleDrawer={onToggleFilterDrawer}
          />
        </div>
        <div className={classes.right}>
          <div className={classes.insetShadow}> </div>
          <Map
            center={map.center}
            defaultCenter={defaultCenter}
            onBoundsChange={onBoundsChange}
            markers={results}
            hoveredResultId={hoveredResultId}
            selectedResult={selectedResult}
            onMarkerClick={onMarkerClick}
            onMarkerMouseEnter={onMarkerMouseEnter}
            onMarkerMouseLeave={onMarkerMouseLeave}
          >
            {results.map((result, index) => {
              const selected = Boolean(
                selectedResult && selectedResult.id === result.id && !loading
              );
              return (
                <Marker
                  key={`${result.id}`}
                  lat={result.listing.location.lat}
                  lng={result.listing.location.lon}
                  ready={ready}
                  hover={hoveredResultId === result.id}
                  result={result}
                  selected={selected}
                  onPopoverClose={onPopoverClose}
                  onNavigateToListing={onNavigateToListing}
                />
              );
            })}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(GridContainer);
