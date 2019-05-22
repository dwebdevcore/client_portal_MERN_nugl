import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import TabMenu from "../../common/TabsMenu";
import ProfileForm from "./ProfileForm";
import moment from "moment";
import { mask } from "../../../util/MaskUtil";
import { getProfile, updateProfile } from "../../../actions/profileActions";
import {
  updateProfileImage,
  updatePassword
} from "../../../actions/userActions";
import { success, error } from "../../../actions/messageActions";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        firstName: "",
        lastName: "",
        displayName: "",
        birthday: "",
        phone: "",
        zip: ""
      },
      updatePassword: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.user &&
      !_.isEqual(nextProps.user, this.state.user) &&
      (nextProps.user && nextProps.user.uid)
    ) {
      this.setState({ user: nextProps.user });
    }
    if (
      nextProps.profile &&
      !_.isEqual(nextProps.profile, this.state.profile)
    ) {
      this.setState({ profile: nextProps.profile });
    }
  }

  componentWillMount() {
    const { profile } = this.props;
    if (profile) {
      this.setState({ profile });
    }
  }

  handleProfileTextChange = name => event => {
    let profile = { ...this.state.profile };
    profile[name] = mask(name, event.target.value);
    this.setState({ profile });
  };

  handlePasswordTextChange = name => event => {
    let updatePassword = { ...this.state.updatePassword };
    updatePassword[name] = event.target.value;
    this.setState({ updatePassword });
  };

  handleUploadFile = (file, dataUrl) => {
    this.props.updateProfileImage(file, dataUrl);
  };

  handleUploadError = error => {
    alert(error);
  };

  isValidProfile = () => {
    let isValid = true;
    let errors = {};

    const validateTextField = (field, message) => {
      if (!this.state.profile[field] || this.state.profile[field] === "") {
        isValid = false;
        errors[field] = message;
      }
    };

    const validateDateField = (field, message) => {
      const textDate = this.state.profile[field];
      const fieldMoment = moment(textDate, "MM-DD-YYYY");
      if (textDate && (textDate.length !== 10 || !fieldMoment.isValid())) {
        isValid = false;
        errors[field] = message;
      }
    };

    validateTextField("firstName", "First Name is Required");
    validateTextField("lastName", "Last Name is Required");
    validateTextField("displayName", "Display Name is Required");
    validateTextField("phone", "Phone Number is Required");
    validateTextField("birthday", "Birthday is Required");
    validateDateField("birthday", "Birthday is not a Valid Format");
    validateTextField("zip", "Zip Code is Required");

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  };

  handleProfileSubmit = () => {
    if (this.isValidProfile()) {
      const uid = this.props.user.uid;
      this.props
        .updateProfile(uid, {
          ...this.state.profile
        })
        .then(() => this.props.success("Profile successfully updated."))
        .catch(() => this.props.error("Failed to update profile."));
    }
  };

  isValidUpdatePassword = () => {
    let isValid = true;
    let errors = {};

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  };

  handlePasswordSubmit = () => {
    if (this.isValidUpdatePassword()) {
      this.props
        .updatePassword(
          this.state.updatePassword.currentPassword,
          this.state.updatePassword.newPassword
        )
        .then(() => {
          this.setState({
            updatePassword: {
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            }
          });
          this.props.success("Password successfully updated.");
        });
    }
  };

  render() {
    const { user } = this.props;
    const { profile, updatePassword } = this.state;
    return (
      <div>
        <TabMenu />
        <ProfileForm
          user={user}
          profile={profile}
          updatePassword={updatePassword}
          onProfileTextChange={this.handleProfileTextChange}
          onPasswordTextChange={this.handlePasswordTextChange}
          onFileLoad={this.handleUploadFile}
          onFileError={this.handleUploadError}
          onProfileSubmit={this.handleProfileSubmit}
          onPasswordSubmit={this.handlePasswordSubmit}
          errors={this.state.errors}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    profile: state.profile
  };
}

export default connect(mapStateToProps, {
  getProfile,
  updateProfile,
  updateProfileImage,
  updatePassword,
  success,
  error
})(ProfilePage);
