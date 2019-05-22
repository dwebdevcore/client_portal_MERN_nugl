import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import Upload from "../../common/Upload";

const styles = theme => ({
  main: {
    margin: `${theme.spacing.unit * 4}px 15%`,
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  },
  paper: {
    padding: theme.spacing.unit * 4
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.unit * 4
  },
  avatar: {
    marginBottom: theme.spacing.unit * 2,
    width: 125,
    height: 125
  },
  personIcon: {
    width: 100,
    height: 100
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.unit * 2
  },
  lastSection: {
    marginBottom: 0
  },
  sectionForm: {
    flexGrow: 2
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  marginNormal: {
    marginTop: 16,
    marginBottom: 8
  },
  sideMargins: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit
  },
  bottomMargin: {
    marginBottom: theme.spacing.unit
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end ",
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2
  },
  submitButton: {
    // width: "25%"
  }
});

const ProfileForm = ({
  user,
  profile,
  updatePassword,
  onProfileTextChange,
  onPasswordTextChange,
  onFileLoad,
  onFileError,
  onProfileSubmit,
  onPasswordSubmit,
  errors,
  classes
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.photoSection}>
        {user &&
          (user.photoURL ? (
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
              className={classes.avatar}
            />
          ) : (
            <Avatar alt={user.displayName} className={classes.avatar}>
              <PersonIcon className={classes.personIcon} />
            </Avatar>
          ))}
        <Upload
          name="uploadProfileImage"
          fileName="profile"
          onFileLoad={onFileLoad}
          onError={onFileError}
          fileTypes={[".jpg", ".gif", ".png"]}
          buttonComponent={
            <Button color="primary">Update Profile Photo</Button>
          }
        />
      </div>
      <Paper className={classes.paper}>
        <div className={classes.sideMargins}>
          <Typography variant="title" gutterBottom>
            Basic Info
          </Typography>
          <Divider className={classes.bottomMargin} light />
        </div>
        <div className={classes.section}>
          <div className={classes.sectionForm}>
            <div className={classes.inputContainer}>
              <TextField
                id="firstName"
                label="First Name"
                className={classes.sideMargins}
                value={profile.firstName}
                onChange={onProfileTextChange("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                margin="normal"
                fullWidth
              />
              <TextField
                id="lastName"
                label="Last Name"
                className={classes.sideMargins}
                value={profile.lastName}
                onChange={onProfileTextChange("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                id="displayName"
                label="Display Name"
                className={classes.sideMargins}
                value={profile.displayName}
                onChange={onProfileTextChange("displayName")}
                error={!!errors.displayName}
                helperText={errors.displayName}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                id="phone"
                label="Phone Number"
                className={classes.sideMargins}
                value={profile.phone}
                onChange={onProfileTextChange("phone")}
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
            <div className={classes.inputContainer}>
              <TextField
                id="birthday"
                label="Birthday"
                className={classes.sideMargins}
                value={profile.birthday}
                onChange={onProfileTextChange("birthday")}
                placeholder={"01-21-2001"}
                error={!!errors.birthday}
                helperText={errors.birthday}
                margin="normal"
                fullWidth
                InputProps={{
                  type: "tel"
                }}
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                id="zip"
                label="Zip Code"
                className={classes.sideMargins}
                value={profile.zip}
                onChange={onProfileTextChange("zip")}
                error={!!errors.zip}
                helperText={errors.zip}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={classes.actions}>
              <Button
                variant="raised"
                color="primary"
                className={classes.submitButton}
                onClick={onProfileSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className={classes.sideMargins}>
          <Typography variant="title" gutterBottom>
            Update Password
          </Typography>
          <Divider className={classes.bottomMargin} light />
        </div>
        <div className={classNames(classes.section, classes.lastSection)}>
          <div className={classes.sectionForm}>
            <div className={classes.inputContainer}>
              <TextField
                id="currentPassword"
                label="Current Password"
                className={classes.sideMargins}
                value={updatePassword.currentPassword}
                onChange={onPasswordTextChange("currentPassword")}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                margin="normal"
                type="password"
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                id="newPassword"
                label="New Password"
                className={classes.sideMargins}
                value={updatePassword.newPassword}
                onChange={onPasswordTextChange("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                margin="normal"
                type="password"
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                className={classes.sideMargins}
                value={updatePassword.confirmPassword}
                onChange={onPasswordTextChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
                type="password"
                fullWidth
              />
            </div>

            <div className={classes.actions}>
              <Button
                variant="raised"
                color="primary"
                className={classes.submitButton}
                onClick={onPasswordSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileForm);
