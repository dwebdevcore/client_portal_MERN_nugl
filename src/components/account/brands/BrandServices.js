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
import { services } from "../../../const/BrandServices";
import { toCamelCase } from "../../../util/StringUtil";

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

const BrandServices = ({ classes, brand, errors, onChangeService }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Services
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      How do customers acquire your product?
    </Typography>
    <div className={classes.serviceSelections}>
      <FormControl error={!!errors.services} component="fieldset">
        {errors.services && <FormHelperText>{errors.services}</FormHelperText>}
        <FormGroup className={classes.formControl}>
          {services.map(option => {
            const camelCaseOption = toCamelCase(option);
            return (
              <FormControlLabel
                key={camelCaseOption}
                control={
                  <Checkbox
                    checked={brand.services[camelCaseOption]}
                    onChange={onChangeService(camelCaseOption)}
                    value={option}
                  />
                }
                label={option}
              />
            );
          })}
        </FormGroup>
        {errors.services && <FormHelperText>{errors.services}</FormHelperText>}
      </FormControl>
    </div>
  </div>
);

BrandServices.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    serviceSelections: string,
    formControl: string
  }).isRequired,
  brand: shape({
    type: string,
    services: shape()
  }).isRequired,
  errors: shape({
    type: string,
    services: shape()
  }).isRequired,
  onChangeService: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BrandServices);
