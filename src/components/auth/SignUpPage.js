import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "@material-ui/core/Modal";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import { signUp, sendEmailVerification } from "../../actions/userActions";
import { success } from "../../actions/messageActions";
import logo from "../../static/images/logo.png";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "90vh",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      minHeight: 0
    }
  },
  card: {
    minWidth: 500,
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
      boxShadow: "none"
    }
  },
  logo: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  logoImage: {
    width: 100
  },
  content: {
    paddingRight: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3
  },
  hint: {
    marginTop: theme.spacing.unit
  },
  input: {
    display: "flex"
  },
  agreement: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing.unit * 2
  },
  error: {
    color: theme.palette.common.red
  },
  actions: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  modal: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    [theme.breakpoints.down("sm")]: {
      width: 220
    }
  }
});

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userAgrees: false,
      termsModalOpen: false,
      errors: {}
    };
  }

  handleModalOpen = event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({ termsModalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ termsModalOpen: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleAgreeChecked = event =>
    this.setState({ userAgrees: event.target.checked });

  handleSignUp = () => {
    if (this.isValid()) {
      const { email, password } = this.state;
      this.props
        .signUp(email, password)
        .then(() => {
          this.props.sendEmailVerification();
          this.props.push("/account/profile");
          this.props.success("Your account has successfully been created.");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  isValid = () => {
    let isValid = true;
    let errors = {};
    if (!this.state.firstName || this.state.firstName === "") {
      isValid = false;
      errors.firstName = "First Name is Required";
    }
    if (!this.state.lastName || this.state.lastName === "") {
      isValid = false;
      errors.lastName = "Last Name is Required";
    }
    if (!this.state.email || this.state.email === "") {
      isValid = false;
      errors.email = "Email Address is Required";
    }
    if (!this.state.password || this.state.password === "") {
      isValid = false;
      errors.password = "Password is Required";
    }
    if (
      this.state.password &&
      this.state.password !== "" &&
      this.state.confirmPassword !== this.state.password
    ) {
      isValid = false;
      errors.confirmPassword = "Passwords Must Match";
    }
    if (!this.state.userAgrees) {
      isValid = false;
      errors.userAgrees = "You must agree to the Terms of Service";
    }
    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <div className={classes.logo}>
            <img src={logo} className={classes.logoImage} alt="NUGL" />
          </div>
          <CardContent className={classes.content}>
            <Typography variant="title">Sign Up</Typography>
            <Typography variant="body1" className={classes.hint}>
              for your free NUGL account
            </Typography>
            <div className={classes.input}>
              <TextField
                id="firstName"
                label="First Name"
                value={this.state.firstName}
                onChange={this.handleChange("firstName")}
                error={!!this.state.errors.firstName}
                helperText={this.state.errors.firstName}
                margin="normal"
                fullWidth
              />
            </div>

            <div className={classes.input}>
              <TextField
                id="lastName"
                label="Last Name"
                value={this.state.lastName}
                onChange={this.handleChange("lastName")}
                margin="normal"
                error={!!this.state.errors.lastName}
                helperText={this.state.errors.lastName}
                fullWidth
              />
            </div>

            <div className={classes.input}>
              <TextField
                id="email"
                label="Email Address"
                value={this.state.email}
                onChange={this.handleChange("email")}
                margin="normal"
                error={!!this.state.errors.email}
                helperText={this.state.errors.email}
                fullWidth
              />
            </div>
            <div className={classes.input}>
              <TextField
                id="password"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange("password")}
                margin="normal"
                error={!!this.state.errors.password}
                helperText={this.state.errors.password}
                fullWidth
              />
            </div>
            <div className={classes.input}>
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={this.state.confirmPassword}
                onChange={this.handleChange("confirmPassword")}
                error={!!this.state.errors.confirmPassword}
                helperText={this.state.errors.confirmPassword}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={classes.agreement}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.userAgrees}
                      onChange={this.handleAgreeChecked}
                      value="userAgrees"
                    />
                  }
                  label={
                    <div>
                      I agree to the{" "}
                      <a style={{ zIndex: 100 }} onClick={this.handleModalOpen}>
                        Terms of Service
                      </a>
                    </div>
                  }
                />
              </FormGroup>
              {!this.state.errors.userAgrees || (
                <FormGroup row>
                  <FormHelperText error={true}>
                    {this.state.errors.userAgrees}
                  </FormHelperText>
                </FormGroup>
              )}
            </div>
            <div className={classes.actions}>
              <Typography>
                Already have an account? <Link to="sign-in">Sign In</Link>
              </Typography>

              <Button
                className={classes.button}
                color="primary"
                onClick={this.handleSignUp}
                variant="raised"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
        <Modal
          aria-labelledby="terms-modal-title"
          aria-describedby="terms-modal-description"
          open={this.state.termsModalOpen}
          onClose={this.handleModalClose}
        >
          <div className={classes.modal}>
            <Typography variant="title" id="modal-title" gutterBottom>
              Terms of Service
            </Typography>
            <Typography
              variant="subheading"
              id="terms-modal-description"
              gutterBottom
            >
              I understand NUGL.com does not sell or handle marijuana or
              marijuana products. NUGL is a Software as a Service (SaaS) and
              directory that does not police licensing and compliance in any
              given city, state or nation, and it is my responsibility to follow
              these laws.
            </Typography>
            <Button
              color="secondary"
              onClick={this.handleModalClose}
              variant="raised"
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

SignUpPage.propTypes = {};

export default withStyles(styles)(
  connect(null, { push, signUp, sendEmailVerification, success })(SignUpPage)
);
