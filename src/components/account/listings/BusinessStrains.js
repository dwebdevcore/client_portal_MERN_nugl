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
import { toCamelCase } from "../../../util/StringUtil";

export const strains = [
  { category: "Flower", name: "Indica" },
  { category: "Flower", name: "Sativa" },
  { category: "Flower", name: "Hybrid" },
  { category: "Extract", name: "Butter" },
  { category: "Extract", name: "Crumble" },
  { category: "Extract", name: "Oil" },
  { category: "Extract", name: "Sauce" },
  { category: "Extract", name: "Shatter" },
  { category: "Extract", name: "Sugar" },
  { category: "Extract", name: "Wax" },
  { name: "Drink" },
  { name: "Edible" },
  { name: "Pet Product" },
  { name: "Seed" },
  { name: "Tincture" },
  { name: "Topical" },
  { name: "Vape" }
];

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

const BusinessStrains = ({ classes, shop, errors, onChange }) => (
  <div className={classes.stepContent}>
    <Typography variant="title" gutterBottom>
      Strains
    </Typography>
    <Divider />
    <Typography className={classes.topMargin}>
      What strains does your business offer?
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
                    checked={shop.strains[camelCaseStrain]}
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
                    checked={shop.strains[camelCaseStrain]}
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
                    checked={shop.strains[camelCaseStrain]}
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

BusinessStrains.propTypes = {
  classes: shape({
    stepContent: string,
    topMargin: string,
    strainSelections: string,
    formControl: string
  }).isRequired,
  shop: shape().isRequired,
  errors: shape().isRequired,
  onChange: func.isRequired
};

export default withStyles(styles, { withTheme: true })(BusinessStrains);
