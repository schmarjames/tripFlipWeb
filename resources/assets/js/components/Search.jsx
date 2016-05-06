import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';
import Select from 'react-select';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Search extends React.Component {
  constructor(props) {
    super(props);
var self = this;
    this.state = {
      display : false,
      paramsKeyLength : 0,
      searchOptions : []
    };

  }

  componentWillMount() {
    if (this.props.searchOptions.length != 0) {
      this.prepareSearchBar(this.props.location.query);
    }
  }

  componentWillReceiveProps(nextProps) {
    var params = nextProps.location.query;
    if (this.props.searchOptions.length != 0) {
      this.prepareSearchBar(params);
    }
  }

  prepareSearchBar(params) {
    // hidden search bar
    if (Object.keys(params).length == 0) {
      this.setState({display : false});
    }

    else if (Object.keys(params).length > 0) {
      if (params.albumFilter && this.filterExist(params.albumFilter)) {

        // filter search options for states, cities, & countries
        if (params.albumFilter == 'categories') {
          if (params.id) {
            this.filterOptionsForCountries();
          } else {
            this.setState({display : false});
          }

        } else if (params.albumFilter == 'countries') {
          if (params.id) {
            this.filterOptionsForSpecificLocationsInCountry();
          } else {
            this.filterOptionsForCountries();
          }
        } else {
          this.setState({display : false});
        }
      }
    }
  }

  filterExist(newFilter) {
    var exist = false;
    this.props.galleryFilterList.forEach((filter) => {
      if (filter == newFilter.toUpperCase()) {
        exist = true;
      }
    });
    return exist;
  }

  filterOptionsForCountries() {
    var newOptions = [];

    this.props.searchOptions.forEach((opt) => {

      var countryObj = {
        name : opt.country,
        id : opt.country_id,
        type : 'country'
      };

      newOptions.push(countryObj);
    });
    console.log(newOptions);
    this.setState({searchOptions: newOptions, display: true});
  }

  filterOptionsForSpecificLocationsInCountry() {
    var newOptions = [];

    this.props.searchOptions.forEach((opt) => {
      var currentCountryId = this.props.location.query.id;

      if (currentCountryId == opt.country_id) {
        var cityObj = {
          name : opt.city + ', ' + opt.country,
          id : opt.city_id,
          type : 'city'
        };

        var stateObj = {
          name : opt.state_region + ', ' + opt.country,
          id : opt.state_region_id,
          type : 'state'
        };

        newOptions.push(cityObj, stateObj);
      }
    });
    console.log(newOptions);
    this.setState({searchOptions: newOptions, display: true});
  }

  sortState(a, b, value) {
    return (
      a.name.toLowerCase().indexOf(value.toLowerCase()) >
      b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
    )
  }


  render() {
    var searchBar;
    if (this.state.display) {
      searchBar = <div>Searching .....</div>;
    } else {
      searchBar = <div>Not Searching .....</div>;
    }

    return (
      <div>
        {searchBar}
      </div>
    );
  }
}

export default Search;
