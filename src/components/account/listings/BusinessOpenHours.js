import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import DateRangeInput from "../../common/DateRangeInput";

const styles = theme => ({
  topMargin: {
    marginTop: theme.spacing.unit
  },
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  hoursSelections: {
    [theme.breakpoints.down("xs")]: {
      maxHeight: 320,
      overflowY: "auto",
      marginTop: 20
    }
  },
  error: {
    color: "red"
  }
});

const BusinessOpenHours = ({
  classes,
  shop,
  errors,
  onTimeChange,
  onClosedChecked
}) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Operating Hours
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      When is your business open for operation?
    </Typography>
    <div className={classes.hoursSelections}>
      {Object.keys(shop.hours).map(day => {
        return (
          <DateRangeInput
            key={day}
            dayOfWeek={day}
            open={!!shop.hours[day].open}
            fromValue={shop.hours[day].from}
            toValue={shop.hours[day].to}
            onTimeChange={onTimeChange}
            onClosedChecked={onClosedChecked}
          />
        );
      })}
    </div>
    {errors.hours && (
      <Typography
        variant="caption"
        className={classNames(classes.error, classes.topMargin)}
      >
        {errors.hours}
      </Typography>
    )}
  </div>
);

BusinessOpenHours.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    hoursSelections: string,
    error: string
  }).isRequired,
  shop: shape().isRequired,
  errors: shape().isRequired,
  onTimeChange: func.isRequired,
  onClosedChecked: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessOpenHours);
