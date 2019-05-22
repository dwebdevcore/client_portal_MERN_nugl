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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = theme => ({
  dialog: {
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      width: 500
    }
  }
});

class ReviewDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sell: ""
    };
  }

  handleCheck = e => this.setState({ sell: e.target.value });

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  render() {
    const { classes, ...other } = this.props;
    return (
      <Dialog aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="responsive-dialog-title">Sell this brand</DialogTitle>
        <DialogContent>
          <DialogContentText>Please make a selection below:</DialogContentText>

          <FormControl component="fieldset" required>
            <RadioGroup
              aria-label="type"
              name="type"
              value={this.state.sell}
              onChange={this.handleCheck}
            >
              <FormControlLabel
                value={"selling"}
                control={<Radio />}
                label="I am already selling or ditributing this brand"
              />
              <FormControlLabel
                value={"sell"}
                control={<Radio />}
                label="I would like to sell or ditribute this brand"
              />
            </RadioGroup>
          </FormControl>
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
