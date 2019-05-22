import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import PlaceIcon from "@material-ui/icons/Place";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import GoogleApi from "../../api/GoogleApi";
import {
  setCenterMapLocation,
  setCurrentLocation
} from "../../actions/mapActions";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    top: theme.spacing.unit * 6,
    left: -368,
    zIndex: 999,
    maxHeight: 400,
    overflowY: "auto",
    width: 740,
    [theme.breakpoints.down("sm")]: {
      top: 40,
      left: 4,
      width: "calc(100% - 8px)"
    }
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    margin: 4,
    // marginRight: 0, with search button
    borderRadius: 0,
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down("sm")]: {
      flexGrow: 2
    }
  },
  textFieldRoot: {
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      flexGrow: 2,
      justifyContent: "space-between"
    }
  },
  textFieldInput: {
    color: theme.palette.grey["900"],
    // minWidth: 168 // with search button
    minWidth: 168 + 88,
    [theme.breakpoints.down("md")]: {
      minWidth: 168 + 38
    }
  },
  placeIcon: {
    fill: theme.palette.grey[300]
  },
  locationIcon: {
    fill: theme.palette.primary.main
  },
  startAdornment: {
    marginRight: 0,
    marginTop: 2
  }
});

function renderSectionTitle(section) {
  return (
    <div>
      <Divider />
      <ListSubheader disableSticky component="div">
        {section.section}
      </ListSubheader>
      <Divider />
    </div>
  );
}

function getSectionSuggestions(section) {
  return section.suggestions;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  return (
    <MenuItem selected={isHighlighted} component="div">
      {suggestion.description || suggestion.suggestion}
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return String(suggestion.description);
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  if (inputLength <= 0) {
    return Promise.resolve([]);
  }
  return Promise.all([GoogleApi.autoCompleteSearch(inputValue)]).then(
    results => {
      let sections = [];
      sections.push({
        section: "Nearby",
        suggestions: results[0]
      });
      return Promise.resolve(sections);
    }
  );
}

class LocationSearchBar extends React.Component {
  inputRef = null;
  state = {
    searchText: "",
    suggestions: []
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.map.currentLocation.lat !==
        this.props.map.currentLocation.lat &&
      nextProps.map.currentLocation.lng !== this.props.map.currentLocation.lng
    ) {
      this.setState({
        searchText: `${nextProps.map.currentLocation.city}, ${
          nextProps.map.currentLocation.state
        }`
      });
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value).then(results => {
      this.setState({
        suggestions: results
      });
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleShouldRenderSuggestions = value => {
    return value.length > 0;
  };

  handleSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    if (sectionIndex === 0) {
      GoogleApi.geocodeSearch("place_id", suggestion.placeId).then(results => {
        if (results.length > 0) {
          const { location } = results[0];
          this.props.setCurrentLocation(location);
          this.props.setCenterMapLocation(location);
        }
        //this.setState({ searchText: suggestion.description });
      });
    }
    if (this.props.location.pathname !== "/") {
      this.props.history.push("/");
    }
  };

  handleInputClick = event => {
    this.inputRef.setSelectionRange(0, this.inputRef.value.length);
  };

  handleLocationClick = event => {
    this.props.setCurrentLocation();
    if (this.props.location.pathname !== "/") {
      this.props.history.push("/");
    }
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      searchText: newValue
    });
  };

  renderInput = inputProps => {
    const {
      classes,
      autoFocus,
      value,
      ref,
      placeholder,
      onChange,
      onLocationClick,
      onInputClick,
      ...other
    } = inputProps;

    return (
      <FormControl className={classes.formControl}>
        <Input
          id="location-term"
          disableUnderline
          placeholder="Near..."
          onChange={onChange}
          value={value}
          onClick={onInputClick}
          inputRef={e => {
            this.inputRef = e;
            return ref(e);
          }}
          classes={{
            root: classes.textFieldRoot,
            input: classes.textFieldInput
          }}
          startAdornment={
            <InputAdornment className={classes.startAdornment} position="start">
              <IconButton disabled>
                <PlaceIcon className={classes.placeIcon} />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment className={classes.startAdornment} position="end">
              <IconButton
                className={classes.searchButton}
                onClick={onLocationClick}
              >
                <MyLocationIcon className={classes.locationIcon} />
              </IconButton>
            </InputAdornment>
          }
          {...other}
        />
      </FormControl>
    );
  };

  render() {
    const { classes } = this.props;
    const { searchText } = this.state;
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        multiSection={true}
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        shouldRenderSuggestions={this.handleShouldRenderSuggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: false,
          classes,
          placeholder: "NUGL it",
          value: searchText || "",
          onChange: this.handleChange,
          onInputClick: this.handleInputClick,
          onLocationClick: this.handleLocationClick
        }}
      />
    );
  }
}

LocationSearchBar.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    map: state.map
  };
}

export default withStyles(styles)(
  withRouter(
    connect(mapStateToProps, { setCenterMapLocation, setCurrentLocation })(
      LocationSearchBar
    )
  )
);
