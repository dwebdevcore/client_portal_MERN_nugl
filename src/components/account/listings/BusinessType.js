import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider/Divider";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import BusinessTypes from "../../../const/BusinessTypes";

const styles = theme => ({
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  topMargin: {
    marginTop: theme.spacing.unit
  },
  group: {
    margin: `${theme.spacing.unit}px 0 0 0`
  },
  formControl: {
    marginLeft: theme.spacing.unit * 3
  }
});

const BusinessType = ({ classes, shop, errors, onCheckType }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Business Type
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      What type of business are you adding?
    </Typography>
    <FormControl
      component="fieldset"
      required
      error={!!errors.type}
      className={classes.formControl}
    >
      <RadioGroup
        aria-label="type"
        name="type"
        className={classes.group}
        value={shop.type}
        onChange={onCheckType}
      >
        <FormControlLabel
          value={BusinessTypes.DISPENSARY}
          control={<Radio />}
          label={BusinessTypes.DISPENSARY}
        />
        <FormControlLabel
          value={BusinessTypes.CHURCH}
          control={<Radio />}
          label={BusinessTypes.CHURCH}
        />
        <FormControlLabel
          value={BusinessTypes.SERVICE}
          control={<Radio />}
          label={BusinessTypes.SERVICE}
        />
      </RadioGroup>
      {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
    </FormControl>
  </div>
);

BusinessType.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    formControl: string,
    group: string
  }).isRequired,
  shop: shape({
    type: string
  }).isRequired,
  errors: shape({
    type: string
  }).isRequired,
  onCheckType: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessType);
