import React from "react";
import { shape, string, func, arrayOf } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

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

const BusinessVerifyAddress = ({
  classes,
  shop,
  errors,
  verifiedAddresses,
  onCheckAddress
}) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Verify Address
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>Verify your address.</Typography>
    <FormControl
      component="fieldset"
      required
      error={errors.verifiedAddress}
      className={classes.formControl}
    >
      <RadioGroup
        aria-label="verifiedAddress"
        name="verifiedAddress"
        className={classes.group}
        value={shop.formattedAddress}
        onChange={onCheckAddress}
      >
        {verifiedAddresses.map(address => (
          <FormControlLabel
            key={address.formattedAddress}
            value={address.formattedAddress}
            control={<Radio />}
            label={address.formattedAddress}
          />
        ))}
      </RadioGroup>
      {errors.formattedAddress && (
        <FormHelperText>{errors.formattedAddress}</FormHelperText>
      )}
    </FormControl>
  </div>
);

BusinessVerifyAddress.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    formControl: string,
    group: string
  }).isRequired,
  shop: shape({
    formattedAddress: string
  }).isRequired,
  errors: shape({
    formattedAddress: string
  }).isRequired,
  verifiedAddresses: arrayOf(shape()).isRequired,
  onCheckAddress: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessVerifyAddress);
