import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import Upload from "../../common/Upload";

const styles = theme => ({
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  preview: {
    width: 150,
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    borderRadius: 0,
    borderColor: "#80bdff"
  },
  logoPreviewCropped: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    width: 150,
    height: 150,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 150px",
    borderColor: "#80bdff"
  },
  stepper: {
    maxWidth: 500,
    flexGrow: 1
  },
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  error: {
    color: "red"
  }
});

const BrandLogo = ({ classes, logoImage, errors, onError, onUpload }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Upload Logo
    </Typography>
    <Divider />
    <div className={classes.uploadContainer}>
      {logoImage ? (
        <div
          className={classes.logoPreviewCropped}
          style={{
            backgroundImage: `url(${logoImage.dataUrl})`
          }}
        />
      ) : (
        <img
          src={require("../../../static/images/logo-crop.gif")}
          className={classes.preview}
          alt="preview"
        />
      )}
      <Typography variant="caption" gutterBottom align="center">
        Recommended size for your logo: 150 x 150px
      </Typography>
      {errors.logoImage && (
        <Typography
          className={classes.error}
          variant="caption"
          gutterBottom
          align="center"
        >
          {errors.logoImage}
        </Typography>
      )}
      <Upload
        name="logoImage"
        fileName="logo"
        onFileLoad={onUpload("logoImage")}
        onError={onError("logoImage")}
        fileTypes={[".jpg", ".gif", ".png"]}
      />
    </div>
  </div>
);

BrandLogo.propTypes = {
  classes: shape({
    stepContent: string,
    uploadContainer: string,
    logoPreviewCropped: string,
    preview: string,
    error: string
  }).isRequired,
  logoImage: shape({
    dataUrl: string
  }),
  errors: shape({
    logoImage: string
  }).isRequired,
  onUpload: func.isRequired,
  onError: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BrandLogo);
