import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import logo from "../../static/images/logo.png";
import { success } from "../../actions/messageActions";
import { sendPasswordResetEmail } from "../../actions/userActions";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "80vh",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      minHeight: 0
    }
  },
  flexGrow: {
    flexGrow: 2
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
  actions: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {}
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmitEmail = () => {
    const { email } = this.state;
    if (this.isValid()) {
      this.props
        .sendPasswordResetEmail(email)
        .then(() => {
          this.props.push("/sign-in");
          this.props.success("An email has been sent.");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  isValid = () => {
    let isValid = true;
    let errors = {};
    if (!this.state.email || this.state.email === "") {
      isValid = false;
      errors.email = "Email Address is Required";
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
            <Typography variant="title">Recover Password</Typography>
            <Typography variant="body1" className={classes.hint}>
              Enter your email address and a recovery link will be sent.
            </Typography>
            <div className={classes.input}>
              <TextField
                id="email"
                label="Email Address"
                value={this.state.email}
                onChange={this.handleChange("email")}
                error={!!this.state.errors.email}
                helperText={this.state.errors.email}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={classes.actions}>
              <Button
                className={classes.button}
                color="primary"
                onClick={this.handleSubmitEmail}
                variant="raised"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

ForgotPasswordPage.propTypes = {};

export default withStyles(styles)(
  connect(null, { push, sendPasswordResetEmail, success })(ForgotPasswordPage)
);
