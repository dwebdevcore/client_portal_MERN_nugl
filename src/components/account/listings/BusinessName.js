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

const BusinessName = ({ classes, shop, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Business Name
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      Start by giving us the name of your business.
    </Typography>
    <div className={classes.input}>
      <TextField
        id="name"
        label="Business Name"
        value={shop.name}
        onChange={onChange("name")}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="id"
        label="Url Friendly Name"
        value={shop.id}
        onChange={onChange("id")}
        error={!!errors.id}
        helperText={errors.id}
        margin="normal"
        fullWidth
      />
    </div>
  </div>
);

BusinessName.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    input: string
  }).isRequired,
  shop: shape({
    name: string,
    id: string
  }).isRequired,
  errors: shape({
    name: string,
    id: string
  }).isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessName);
