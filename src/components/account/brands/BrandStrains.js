import React from "react";
import { shape, string, func } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import { strains } from "../../../const/BrandServices";
import { toCamelCase } from "../../../util/StringUtil";

const styles = theme => ({
  stepContent: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  topMargin: {
    marginTop: theme.spacing.unit
  },
  strainSelections: {
    maxHeight: 260,
    overflowY: "auto",
    marginTop: 20
  },
  formControl: {
    marginLeft: theme.spacing.unit * 3
  }
});

const BrandStrains = ({ classes, brand, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Strains
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      What strains does your brand offer?
    </Typography>
    <div className={classes.strainSelections}>
      <FormControl error={!!errors.strains} component="fieldset">
        {errors.strains && <FormHelperText>{errors.strains}</FormHelperText>}
        <FormLabel className={classes.formLabel} component="legend">
          Flower
        </FormLabel>
        <FormGroup className={classes.formControl}>
          {strains.filter(e => e.category === "Flower").map(option => {
            const strain = option.name;
            const camelCaseStrain = toCamelCase(strain);
            return (
              <FormControlLabel
                key={camelCaseStrain}
                control={
                  <Checkbox
                    checked={brand.strains[camelCaseStrain]}
                    onChange={onChange(camelCaseStrain)}
                    value={strain}
                  />
                }
                label={strain}
              />
            );
          })}
        </FormGroup>
        <FormLabel
          className={classNames(classes.formLabel, classes.topMargin)}
          component="legend"
        >
          Extract
        </FormLabel>
        <FormGroup className={classes.formControl}>
          {strains.filter(e => e.category === "Extract").map(option => {
            const strain = option.name;
            const camelCaseStrain = toCamelCase(strain);
            return (
              <FormControlLabel
                key={camelCaseStrain}
                control={
                  <Checkbox
                    checked={brand.strains[camelCaseStrain]}
                    onChange={onChange(camelCaseStrain)}
                    value={strain}
                  />
                }
                label={strain}
              />
            );
          })}
        </FormGroup>
        <FormLabel
          className={classNames(classes.formLabel, classes.topMargin)}
          component="legend"
        >
          Other
        </FormLabel>
        <FormGroup className={classes.formControl}>
          {strains.filter(e => !e.category).map(option => {
            const strain = option.name;
            const camelCaseStrain = toCamelCase(strain);
            return (
              <FormControlLabel
                key={camelCaseStrain}
                control={
                  <Checkbox
                    checked={brand.strains[camelCaseStrain]}
                    onChange={onChange(camelCaseStrain)}
                    value={strain}
                  />
                }
                label={strain}
              />
            );
          })}
        </FormGroup>
        {errors.strains && <FormHelperText>{errors.strains}</FormHelperText>}
      </FormControl>
    </div>
  </div>
);

BrandStrains.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    strainSelections: string,
    formControl: string
  }).isRequired,
  brand: shape().isRequired,
  errors: shape().isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BrandStrains);
