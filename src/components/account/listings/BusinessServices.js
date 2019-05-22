import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider/Divider";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import BusinessTypes from "../../../const/BusinessTypes";
import { toCamelCase } from "../../../util/StringUtil";

const services = [
  {
    type: BusinessTypes.DISPENSARY,
    options: ["Store Front", "Delivery", "Online Shop"]
  },
  {
    type: BusinessTypes.CHURCH,
    options: ["Store Front", "Delivery", "Online Shop"]
  },
  {
    type: BusinessTypes.SERVICE,
    options: [
      "Doctor",
      "Lawyer",
      "Consultant",
      "Investor",
      "Marketing",
      "Security",
      "Other"
    ]
  }
];

const styles = theme => ({
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  serviceSelections: {
    maxHeight: 360,
    overflowY: "auto",
    marginTop: 20
  },
  topMargin: {
    marginTop: theme.spacing.unit
  },
  formControl: {
    marginLeft: theme.spacing.unit * 3
  }
});

const BusinessServices = ({ classes, shop, errors, onChangeService }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Services
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      Select the services your shop will be providing.
    </Typography>
    <div className={classes.serviceSelections}>
      {shop.type === BusinessTypes.DISPENSARY && (
        <FormControl error={!!errors.services} component="fieldset">
          {errors.services && (
            <FormHelperText>{errors.services}</FormHelperText>
          )}
          <FormGroup className={classes.formControl}>
            {services
              .filter(e => e.type === BusinessTypes.DISPENSARY)[0]
              .options.map(option => {
                const camelCaseOption = toCamelCase(option);
                return (
                  <FormControlLabel
                    key={camelCaseOption}
                    control={
                      <Checkbox
                        checked={shop.services[camelCaseOption]}
                        onChange={onChangeService(camelCaseOption)}
                        value={option}
                      />
                    }
                    label={option}
                  />
                );
              })}
          </FormGroup>
          {errors.services && (
            <FormHelperText>{errors.services}</FormHelperText>
          )}
        </FormControl>
      )}
      {shop.type === BusinessTypes.CHURCH && (
        <FormControl error={!!errors.services} component="fieldset">
          {errors.services && (
            <FormHelperText>{errors.services}</FormHelperText>
          )}
          <FormGroup className={classes.formControl}>
            {services
              .filter(e => e.type === BusinessTypes.CHURCH)[0]
              .options.map(option => {
                const camelCaseOption = toCamelCase(option);
                return (
                  <FormControlLabel
                    key={camelCaseOption}
                    control={
                      <Checkbox
                        checked={shop.services[camelCaseOption]}
                        onChange={onChangeService(camelCaseOption)}
                        value={option}
                      />
                    }
                    label={option}
                  />
                );
              })}
          </FormGroup>
          {errors.services && (
            <FormHelperText>{errors.services}</FormHelperText>
          )}
        </FormControl>
      )}
      {shop.type === BusinessTypes.SERVICE && (
        <FormControl error={!!errors.services} component="fieldset">
          <FormGroup className={classes.formControl}>
            {services
              .filter(e => e.type === BusinessTypes.SERVICE)[0]
              .options.map(option => {
                const camelCaseOption = toCamelCase(option);
                return (
                  <FormControlLabel
                    key={camelCaseOption}
                    control={
                      <Checkbox
                        checked={shop.services[camelCaseOption]}
                        onChange={onChangeService(camelCaseOption)}
                        value={option}
                      />
                    }
                    label={option}
                  />
                );
              })}
          </FormGroup>
          {errors.services && (
            <FormHelperText>{errors.services}</FormHelperText>
          )}
        </FormControl>
      )}
    </div>
  </div>
);

BusinessServices.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    serviceSelections: string,
    formControl: string
  }).isRequired,
  shop: shape({
    type: string,
    services: shape()
  }).isRequired,
  errors: shape({
    type: string,
    services: shape()
  }).isRequired,
  onChangeService: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessServices);
