import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { pop } from "../../actions/messageActions";

class Message extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      message: props.message ? Object.assign({}, props.message) : null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message) {
      this.setState({
        message: nextProps.message ? Object.assign({}, nextProps.message) : null
      });
    }
  }

  handleClose = (event, reason) => {
    this.props.pop();
  };

  render() {
    return (
      <div>
        {this.state.message !== null && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={true}
            autoHideDuration={5000}
            onClose={this.handleClose}
            SnackbarContentProps={{
              "aria-describedby": "message-id"
            }}
            style={{ textAlign: "center" }}
            message={<span id="message-id">{this.state.message.text}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        )}
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object,
  pop: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  let message = null;
  if (state.messages.length > 0) {
    message = state.messages[0];
  }
  return {
    message: message
  };
}

export default connect(mapStateToProps, { pop })(Message);
