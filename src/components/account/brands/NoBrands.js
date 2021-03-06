import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  main: {
    margin: `${theme.spacing.unit * 4}px 15%`,
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  },
  paper: {
    padding: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  center: {
    textAlign: "center"
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing.unit * 4
  }
});

const NoListings = ({ onAddBrandDialogOpen, classes }) => {
  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography variant="headline" className={classes.center} gutterBottom>
          You don't have any brands yet.
        </Typography>
        <Typography
          variant="subheading"
          className={classes.center}
          gutterBottom
        >
          List your brand on NUGL by adding a brand to your profile.
        </Typography>
        <div className={classes.actions}>
          <Button
            variant="raised"
            color="secondary"
            onClick={onAddBrandDialogOpen}
            className={classes.button}
          >
            Add a Brand
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(NoListings);
