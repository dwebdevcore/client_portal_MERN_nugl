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

const BusinessInfo = ({ classes, shop, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Business Info
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      Give us some basic info about your business.
    </Typography>
    <div className={classes.input}>
      <TextField
        id="description"
        label="Description"
        multiline
        value={shop.description}
        onChange={onChange("description")}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="phone"
        label="Business Phone"
        value={shop.phone}
        onChange={onChange("phone")}
        placeholder={"(999)999-9999"}
        error={!!errors.phone}
        helperText={errors.phone}
        margin="normal"
        fullWidth
        InputProps={{
          type: "tel"
        }}
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="email"
        label="Business Email"
        value={shop.email}
        onChange={onChange("email")}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="website"
        label="Website"
        value={shop.website}
        onChange={onChange("website")}
        placeholder="http://"
        margin="normal"
        fullWidth
      />
    </div>
  </div>
);

BusinessInfo.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    input: string
  }).isRequired,
  shop: shape({
    description: string,
    phone: string,
    email: string,
    website: string
  }).isRequired,
  errors: shape({
    description: string,
    phone: string,
    email: string,
    website: string
  }).isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessInfo);
