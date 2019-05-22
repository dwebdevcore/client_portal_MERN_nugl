import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import RatingSelect from "./RatingSelect";
import RatingCategories from "../../const/RatingCategories";

const styles = theme => ({
  content: {
    paddingTop: theme.spacing.unit * 2,
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      width: 500
    }
  },
  categoryContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#fafafa"
    }
  },
  titleContainer: {
    paddingBottom: theme.spacing.unit * 2
  },
  commentContainer: {
    paddingTop: theme.spacing.unit * 2
  },
  actions: {
    justifyContent: "space-between"
  },
  textFieldRoot: {
    padding: 0,
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  textFieldInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 12px",
    width: "calc(100% - 24px)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  }
});

const defaultReview = {
  ratings: {},
  title: "",
  comments: ""
};

class ReviewDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultReview,
      errors: {}
    };
  }

  calculateAverage = ratings => {
    const keys = Object.keys(ratings).filter(e => e !== "average");
    const total = keys.reduce(
      (accumulator, category) => accumulator + ratings[category],
      0
    );
    const average = total / keys.length;
    return average;
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleRatingClick = category => rating => {
    let ratings = { ...this.state.ratings };
    if (rating > 0) {
      ratings[category] = rating;
    } else {
      delete ratings[category];
    }
    ratings["average"] = this.calculateAverage(ratings);
    this.setState({ ratings });
  };

  isValid = () => {
    let isValid = true;
    let errors = {};

    if (Object.keys(this.state.ratings).length < 1) {
      isValid = false;
      errors.ratings = "You must rate at least 1 category";
    }

    if (!this.state.title) {
      isValid = false;
      errors.title = "Title is Required";
    }

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  };

  handleSubmit = () => {
    this.setState({ nextLoading: true });
    if (this.isValid()) {
      const { ratings, title, comments } = this.state;
      this.props.onSubmit({ ratings, title, comments });
      this.setState({ ratings: {}, title: "", comments: "" });
      this.handleClose();
    } else {
      this.setState({ nextLoading: false });
    }
  };

  render() {
    const { classes, theme, onClose, ...other } = this.props;
    const { errors } = this.state;
    return (
      <Dialog aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="responsive-dialog-title">
          {"Leave Feedback"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please rate your experience with this business:
          </DialogContentText>
          <div className={classes.content}>
            {Object.keys(RatingCategories).map(key => {
              return (
                <div key={key} className={classes.categoryContainer}>
                  <Typography variant="subheading">
                    {RatingCategories[key]}
                  </Typography>
                  <RatingSelect onClick={this.handleRatingClick(key)} />
                </div>
              );
            })}
            <div className={classes.commentContainer}>
              <TextField
                id="title"
                placeholder="Title"
                fullWidth
                onChange={this.handleChange("title")}
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textFieldRoot,
                    input: classes.textFieldInput
                  }
                }}
              />
            </div>
            <div className={classes.commentContainer}>
              <TextField
                id="comments"
                placeholder="Please enter comments here about your experience"
                multiline
                rowsMax="6"
                fullWidth
                onChange={this.handleChange("comments")}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textFieldRoot,
                    input: classes.textFieldInput
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={this.handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ReviewDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(
  withMobileDialog()(ReviewDialog)
);
