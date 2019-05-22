import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SelectField from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/icons/Menu";
import LocationOn from "@material-ui/icons/LocationOn";
import NoLocations from "./NoLocations";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  container: {
    borderBottom: `solid 1px ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  row: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    paddingBottom: "10px"
  },
  findText: {
    fontSize: "18px"
  },
  btn: {
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  select: {
    marginLeft: "20px",
    width: "100px",
    borderBottom: "none"
  }
});

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: "-1",
      sort: "-1"
    };
  }

  handleSelect = e => console.log(e.target.value);

  render() {
    const { classes } = this.props;
    const { distance, sort } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <Typography className={classes.findText}>Find Near Me</Typography>
        </div>
        <div className={classes.row}>
          <Button
            className={classes.btn}
            variant="raised"
            small="true"
            color="primary"
          >
            <Menu />
            LIST
          </Button>
          <Button className={classes.btn} variant="raised" small="true">
            <LocationOn />
            MAP
          </Button>
          <SelectField
            value={distance}
            onChange={this.handleSelect}
            className={classes.select}
          >
            <MenuItem value={"-1"} disabled>
              Distance
            </MenuItem>
            <MenuItem value={"test"}>test</MenuItem>
          </SelectField>
          <SelectField
            value={sort}
            onChange={this.handleSelect}
            className={classes.select}
            underlineStyle={{ background: "white" }}
          >
            <MenuItem value={"-1"} disabled>
              Sort by
            </MenuItem>
            <MenuItem value={"test"}>test</MenuItem>
          </SelectField>
        </div>
        <NoLocations />
      </div>
    );
  }
}

Locations.propTypes = {};

export default withStyles(styles, { withTheme: true })(Locations);
