import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Rating from "./Rating";
import RatingCategories from "../../const/RatingCategories";

const styles = theme => ({
  container: {
    display: "flex"
  },
  leftLabel: {
    height: 22,
    marginTop: 2,
    marginRight: theme.spacing.unit
  },
  rightLabel: {
    height: 22,
    marginTop: 2,
    marginLeft: theme.spacing.unit
  }
});

class Ratings extends React.Component {
  render() {
    const { ratings, classes } = this.props;
    return (
      <div>
        {Object.keys(ratings)
          .filter(e => e !== "average")
          .map(category => {
            return (
              <div className={classes.container}>
                <Typography variant="body2" className={classes.leftLabel}>
                  {(ratings[category] / 2).toFixed(1)}
                </Typography>
                <Rating rating={ratings[category]} />
                <Typography variant="body2" className={classes.rightLabel}>
                  {RatingCategories[category]}
                </Typography>
              </div>
            );
          })}
      </div>
    );
  }
}

Ratings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Ratings);
