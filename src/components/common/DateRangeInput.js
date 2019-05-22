import React from "react";
import { TimePicker } from "material-ui-pickers";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import DateRangeIcon from "@material-ui/icons/DateRange";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";

const styles = theme => ({
  dateRange: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 2
    }
  },
  dayLabel: {
    width: 100,
    [theme.breakpoints.down("xs")]: {
      order: 0,
      marginBottom: 0,
      flexBasis: "50%"
    }
  },
  dateRangeAdornment: {
    marginRight: theme.spacing.unit * 2
  },
  dateInput: {
    width: 140,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 16px)",
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      order: 2
    }
  },
  dateRangeLabel: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  daySwitch: {
    [theme.breakpoints.down("xs")]: {
      order: 1
    }
  },
  switchPlaceholder: {
    minWidth: 62
  }
});

const DateRangeInput = ({
  all,
  dayOfWeek,
  open,
  fromValue,
  toValue,
  onTimeChange,
  onClosedChecked,
  classes
}) => {
  const day = all
    ? "Every day"
    : dayOfWeek.replace(/^(.)/g, function($1) {
        return $1.toUpperCase();
      });
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className={classes.dateRange}>
        <Typography
          className={classes.dayLabel}
          variant="subheading"
          gutterBottom
        >
          {day}:
        </Typography>
        <TimePicker
          id={`${dayOfWeek}Open`}
          className={classes.dateInput}
          keyboard
          keyboardIcon={<DateRangeIcon />}
          mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /a|p/i, "M"]}
          placeholder="00:00 AM"
          value={fromValue || ""}
          onChange={onTimeChange(dayOfWeek, "from")}
          disabled={!open && !all}
        />
        <Typography
          className={classes.dateRangeLabel}
          variant="caption"
          gutterBottom
        >
          to
        </Typography>
        <TimePicker
          id={`${dayOfWeek}Close`}
          className={classes.dateInput}
          keyboard
          keyboardIcon={<DateRangeIcon />}
          mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /a|p/i, "M"]}
          placeholder="00:00 PM"
          value={toValue || ""}
          onChange={onTimeChange(dayOfWeek, "to")}
          disabled={!open && !all}
        />
        {all ? (
          <div className={classes.switchPlaceholder} />
        ) : (
          <Switch
            className={classes.daySwitch}
            checked={open}
            onChange={onClosedChecked(dayOfWeek)}
          />
        )}
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles)(DateRangeInput);
