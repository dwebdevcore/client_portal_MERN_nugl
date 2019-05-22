import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  topMargin: {
    marginTop: theme.spacing.unit
  }
});

const BusinessAddress = ({ classes, shop, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Shop Address
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      Where is your shop located?
    </Typography>
    <div className={classes.input}>
      <TextField
        id="address"
        label="Address"
        value={shop.address}
        onChange={onChange("address")}
        error={!!errors.address}
        helperText={errors.address}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="city"
        label="City"
        value={shop.city}
        onChange={onChange("city")}
        error={!!errors.city}
        helperText={errors.city}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="state"
        label="State"
        value={shop.state}
        onChange={onChange("state")}
        error={!!errors.state}
        helperText={errors.state}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="zip"
        label="Zip Code"
        value={shop.zip}
        onChange={onChange("zip")}
        error={!!errors.zip}
        helperText={errors.zip}
        margin="normal"
        fullWidth
      />
    </div>
  </div>
);

BusinessAddress.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    input: string
  }).isRequired,
  shop: shape({
    address: string,
    city: string,
    state: string,
    zip: string
  }).isRequired,
  errors: shape({
    address: string,
    city: string,
    state: string,
    zip: string
  }).isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessAddress);
