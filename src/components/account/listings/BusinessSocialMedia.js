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

const BusinessSocialMedia = ({ classes, shop, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Social Media
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      Link your social media accounts.
    </Typography>
    <div className={classes.input}>
      <TextField
        id="facebook"
        label="Facebook"
        value={shop.facebook}
        placeholder="facebook"
        onChange={onChange("facebook")}
        error={!!errors.facebook}
        helperText={
          errors.facebook || `https://www.facebook.com/${shop.facebook || ""}`
        }
        margin="normal"
        fullWidth
      />
    </div>

    <div className={classes.input}>
      <TextField
        id="twitter"
        label="Twitter"
        value={shop.twitter}
        placeholder="twitter"
        onChange={onChange("twitter")}
        error={!!errors.twitter}
        helperText={
          errors.twitter || `https://www.twitter.com/${shop.twitter || ""}`
        }
        margin="normal"
        fullWidth
      />
    </div>
    <div className={classes.input}>
      <TextField
        id="instagram"
        label="Instagram"
        value={shop.instagram}
        placeholder="instagram"
        onChange={onChange("instagram")}
        error={!!errors.instagram}
        helperText={
          errors.instagram ||
          `https://www.instagram.com/${shop.instagram || ""}`
        }
        margin="normal"
        fullWidth
      />
    </div>
  </div>
);

BusinessSocialMedia.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    input: string
  }).isRequired,
  shop: shape().isRequired,
  errors: shape().isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessSocialMedia);
