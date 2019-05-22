import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import FileUploadIcon from "@material-ui/icons/FileUpload";
import { rename } from "../../util/FileUtil";

const styles = theme => ({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  fileInput: {
    zIndex: -1,
    position: "absolute",
    display: "none"
  }
});

class Upload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.inputElement = "";
  }

  handleUploadClick = () => {
    this.inputElement.click();
  };

  handleFileInputChange = event => {
    const file = rename(event.target.files[0], this.props.fileName);
    if (!this.hasExtension(file.name)) {
      this.props.onError({ code: "InvalidFileType" });
      return;
    }

    const reader = new FileReader();

    const _this = this;

    reader.onload = (function() {
      return function(e) {
        const result = e.target.result;
        if (typeof _this.props.onFileLoad === "function") {
          _this.props.onFileLoad(file, result);
        }
      };
    })(file);

    reader.readAsDataURL(file);
  };

  hasExtension = fileName => {
    return new RegExp(
      "(" + this.props.fileTypes.join("|").replace(/\./g, "\\.") + ")$"
    ).test(fileName.toLowerCase());
  };

  render() {
    const { classes, buttonComponent } = this.props;
    return (
      <div className={classes.main}>
        {buttonComponent ? (
          React.cloneElement(buttonComponent, {
            onClick: this.handleUploadClick
          })
        ) : (
          <Button
            className={classes.button}
            variant="raised"
            color="primary"
            onClick={this.handleUploadClick}
          >
            Upload
            <FileUploadIcon className={classes.rightIcon} />
          </Button>
        )}
        <input
          type="file"
          className={classes.fileInput}
          ref={input => (this.inputElement = input)}
          name={this.props.name}
          onChange={this.handleFileInputChange}
          multiple
          accept="accept=image/*"
        />
      </div>
    );
  }
}

Upload.defaultProps = {
  fileTypes: [".jpg", ".gif", ".png", ".gif"]
};

Upload.propTypes = {
  name: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileTypes: PropTypes.array.isRequired,
  onFileLoad: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default withStyles(styles)(Upload);
