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
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import AlgoliaApi from "../../api/AlgoliaApi";
import { setCenterMapLocation } from "../../actions/mapActions";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    top: theme.spacing.unit * 6,
    left: -4,
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
    borderRadius: 0,
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down("sm")]: {
      flexGrow: 2
    }
  },
  textFieldRoot: {
    padding: `0`,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.down("sm")]: {
      flexGrow: 2,
      justifyContent: "space-between"
    }
  },
  textFieldInput: {
    color: theme.palette.grey["900"],
    minWidth: 300,
    [theme.breakpoints.down("md")]: {
      minWidth: 250
    }
  },
  searchIcon: {
    fill: theme.palette.grey[300]
  },
  searchAdornment: {
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
      <span
        dangerouslySetInnerHTML={{
          __html: suggestion.description || suggestion.suggestion
        }}
      />
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
  return Promise.all([AlgoliaApi.autoCompleteSearch(inputValue)]).then(
    results => {
      return Promise.resolve(results[0].filter(e => e !== null));
    }
  );
}

class NuglSearchBar extends React.Component {
  inputRef = null;
  state = {
    searchText: "",
    suggestions: []
  };

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
    if (suggestion.section === "Places") {
      this.props.setCenterMapLocation(
        {
          lat: suggestion.location.lat,
          lng: suggestion.location.lon
        },
        suggestion.id
      );
      this.setState({ searchText: suggestion.suggestion });
    }
    if (suggestion.section === "Brands") {
      this.setState({ searchText: suggestion.suggestion });
      this.props.history.push(`/brands/${suggestion.id}`);
    }
    if (this.props.location.pathname !== "/") {
      this.props.history.push("/");
    }
  };

  handleInputClick = event => {
    this.inputRef.setSelectionRange(0, this.inputRef.value.length);
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
      onInputClick,
      ...other
    } = inputProps;
    return (
      <FormControl className={classes.formControl}>
        <Input
          id="search-term"
          disableUnderline
          placeholder="Search anything 420..."
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
            <InputAdornment
              className={classes.searchAdornment}
              position="start"
            >
              <IconButton className={classes.searchButton} disabled>
                <SearchIcon className={classes.searchIcon} />
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
          onInputClick: this.handleInputClick
        }}
      />
    );
  }
}

NuglSearchBar.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    map: state.map
  };
}

export default withStyles(styles)(
  withRouter(connect(mapStateToProps, { setCenterMapLocation })(NuglSearchBar))
);
