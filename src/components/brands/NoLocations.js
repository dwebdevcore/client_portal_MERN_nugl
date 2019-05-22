import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SellDialog from "./SellDialog";

const styles = theme => ({
  paper: {
    marginTop: "20px"
  },
  content: {
    padding: theme.spacing.unit * 2,
    height: "200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  title: {
    fontSize: "18px",
    textAlign: "center"
  },
  subTitle: {
    fontSize: "14px",
    textAlign: "center"
  }
});

class NoLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sellDialogOpen: false
    };
  }

  handleSellDialogOpen = open => () => {
    this.setState({ sellDialogOpen: open });
  };

  render() {
    const { classes } = this.props;
    const { sellDialogOpen } = this.state;

    return (
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <div>
            <Typography className={classes.title}>
              This brand has no current locations
            </Typography>
            <Typography className={classes.subTitle}>
              To list your business as a seller or distributor ot this brand
              please click button below.
            </Typography>
          </div>
          <Button
            variant="raised"
            small="true"
            color="primary"
            onClick={this.handleSellDialogOpen(true)}
          >
            SELL THIS BRAND
          </Button>
        </div>
        {sellDialogOpen && (
          <SellDialog
            open={sellDialogOpen}
            onClose={this.handleSellDialogOpen(false)}
            onSubmit={this.handleSubmitReview}
          />
        )}
      </Paper>
    );
  }
}

NoLocations.propTypes = {};

export default withStyles(styles, { withTheme: true })(NoLocations);
