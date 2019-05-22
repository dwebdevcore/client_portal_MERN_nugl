import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BrandPanel from "./BrandPanel";

const styles = theme => ({
  main: {
    margin: `${theme.spacing.unit * 4}px 15%`,
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  },
  heading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    margin: `${theme.spacing.unit * 2}px 0`
  }
});

const Brands = ({
  brands,
  onAddBrandDialogOpen,
  onPublishToggle,
  onSubmit,
  classes
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.heading}>
        <Typography variant="title">Your Brands</Typography>
        <Button
          variant="raised"
          color="primary"
          onClick={onAddBrandDialogOpen}
          className={classes.button}
        >
          Add a Brand
        </Button>
      </div>
      <div>
        {brands.map(brand => {
          return (
            <BrandPanel
              key={brand.id}
              brand={brand}
              onPublishToggle={onPublishToggle}
              onSubmit={onSubmit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(Brands);
