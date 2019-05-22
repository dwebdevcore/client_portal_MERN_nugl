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
import logo from "../../static/images/logo.png";
import { signIn, signInWithProvider } from "../../actions/userActions";

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
  forgotPassword: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  actions: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttons: {},
  providerButton: {
    marginRight: theme.spacing.unit,
    border: 0
  }
});

class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSignIn = () => {
    const { email, password } = this.state;
    if (this.isValid()) {
      this.props
        .signIn(email, password)
        .then(result => {
          this.props.push("/");
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
    if (!this.state.password || this.state.password === "") {
      isValid = false;
      errors.password = "Password is Required";
    }
    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }
    return isValid;
  };

  handleSubmit = event => {
    event.preventDefault();
    this.handleSignIn();
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
            <form onSubmit={this.handleSubmit}>
              <Typography variant="title">Sign In</Typography>
              <Typography variant="body1" className={classes.hint}>
                with your NUGL account
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
              <div className={classes.input}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  error={!!this.state.errors.password}
                  helperText={this.state.errors.password}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div className={classes.forgotPassword}>
                <Typography variant="body1">
                  <Link to="forgot-password">Forgot password?</Link>
                </Typography>
              </div>
              <div className={classes.actions}>
                <Typography className={classes.flexGrow}>
                  <Link to="sign-up">Create an account</Link>
                </Typography>
                <div className={classes.buttons}>
                  <Button
                    className={classes.button}
                    color="primary"
                    onClick={this.handleSignIn}
                    variant="raised"
                    type="submit"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

SignInPage.propTypes = {};

export default withStyles(styles)(
  connect(null, { push, signIn, signInWithProvider })(SignInPage)
);
