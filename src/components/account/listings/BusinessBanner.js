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
  bannerPreviewCropped: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px 0`,
    width: 300,
    height: 150,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 150px",
    borderColor: "#80bdff"
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

const BusinessBanner = ({
  classes,
  bannerImage,
  errors,
  onError,
  onUpload
}) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Upload Banner
    </Typography>
    <Divider />
    <div className={classes.uploadContainer}>
      {bannerImage ? (
        <div
          className={classes.bannerPreviewCropped}
          style={{
            backgroundImage: `url(${bannerImage.dataUrl})`
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
        Recommended size for your banner: 600 x 1200px
      </Typography>
      {errors.bannerImage && (
        <Typography
          className={classes.error}
          variant="caption"
          gutterBottom
          align="center"
        >
          {errors.bannerImage}
        </Typography>
      )}
      <Upload
        name="bannerImage"
        fileName="banner"
        onFileLoad={onUpload("bannerImage")}
        onError={onError("bannerImage")}
        fileTypes={[".jpg", ".gif", ".png"]}
      />
    </div>
  </div>
);

BusinessBanner.propTypes = {
  classes: shape({
    stepContent: string,
    uploadContainer: string,
    bannerPreviewCropped: string,
    preview: string,
    error: string
  }).isRequired,
  bannerImage: shape({
    dataUrl: string
  }),
  errors: shape({
    bannerImage: string
  }).isRequired,
  onUpload: func.isRequired,
  onError: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessBanner);
