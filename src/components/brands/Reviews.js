import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Rating from "../common/Rating";
import Ratings from "../common/RatingsPopover";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  container: {
    borderBottom: `solid 1px ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  lastReview: {
    borderBottom: "none",
    marginBottom: 0,
    paddingBottom: 0
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  ratings: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  ratingSummary: {
    display: "flex",
    alignItems: "center",
    position: "relative"
  },
  ratingLabel: {
    height: 22,
    marginTop: 2,
    marginRight: theme.spacing.unit
  },
  comments: {
    marginTop: theme.spacing.unit
  }
});

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { reviews, classes } = this.props;
    return (
      <div className={classes.root}>
        {reviews.map((review, index) => {
          return (
            <div
              key={review.id}
              className={classNames(
                classes.container,
                index === reviews.length - 1 ? classes.lastReview : null
              )}
            >
              <div className={classes.row}>
                <Typography variant="body2">
                  By {review.userDisplayName || "Anonymous"}
                </Typography>
                <Typography variant="caption">5 days ago</Typography>
              </div>
              <div className={classes.ratings}>
                <div className={classes.ratingSummary}>
                  <Typography className={classes.ratingLabel} variant="body2">
                    {(review.ratings.average / 2).toFixed(1)}
                  </Typography>
                  <Rating rating={review.ratings.average} />
                </div>
                <Ratings ratings={review.ratings} />
              </div>

              <Typography variant="title">{review.title}</Typography>
              <Typography variant="body1" className={classes.comments}>
                {review.comments}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  }
}

Reviews.propTypes = {};

export default withStyles(styles, { withTheme: true })(Reviews);
