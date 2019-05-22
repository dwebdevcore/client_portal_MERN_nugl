import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Popover from "./Popover";
import { renderListingTypeMarker } from "../../util/IconUtil";

const styles = theme => ({
  marker: {
    cursor: "pointer"
  },
  selectedIcon: {
    fill: theme.palette.secondary.main
  }
});

class NuglMarker extends Component {
  constructor(props) {
    super(props);
    this.anchorEl = null;
  }
  render() {
    const {
      result,
      $hover,
      hover,
      selected,
      onPopoverClose,
      onNavigateToListing,
      classes
    } = this.props;
    return (
      <div>
        <div ref={node => (this.anchorEl = node)} className={classes.marker}>
          {renderListingTypeMarker(
            result.listing.type,
            $hover || hover,
            selected
          )}
        </div>
        {selected && (
          <Popover
            open={true}
            result={result}
            onPopoverClose={onPopoverClose}
            anchorEl={this.anchorEl}
            onNavigateToListing={onNavigateToListing}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(NuglMarker);
