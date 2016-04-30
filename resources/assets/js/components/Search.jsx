import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display : false,
      paramsKeyLength : 0,
      searchOptions : []
    };
  }

  componentWillMount() {
    if (this.state.searchOptions.length == 0) {
      this.setState({
        searchOptions: this.props.searchOptions
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    var params = nextProps.location.query;

    if (nextProps.searchOptions.length > 0 && nextProps.searchOptions.length != this.state.searchOptions.length) {
      this.setState({
        searchOptions: nextProps.searchOptions
      });
    }

    this.prepareSearchBar(params);

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
            this.setState({display : true});
            this.filterOptionsForAllLoctions();
          } else {
            this.setState({display : false});
          }

        } else if (params.albumFilter == 'countries') {
          if (params.id) {
            this.setState({display : true});
            this.filterOptionsForSpecificLocationsInCountry();
          } else {
            this.filterOptionsForAllLoctions();
          }
        } else {
          this.setState({display : false});
        }
      }
    }
  }

  filterExist(filter) {
    this.galleryFilterList.forEach((filter) => {
      if (filter == filter.toUpperCase()) {
        return true;
      }
    });
    return false;
  }

  filterOptionsForAllLoctions() {
    var newOptions = [];

    this.state.searchOptions.forEach((opt) => {
      var cityObj = {
        name : opt.city,
        id : opt.city_id
      };

      var stateObj = {
        name : opt.state_region,
        id : opt.state_region_id
      };

      var countryObj = {
        name : opt.country,
        id : opt.country_id
      };

      newOptions.push(cityObj, stateObj, coutryObj);
    });

    this.setState({searchOptions: newOptions});
  }

  filterOptionsForSpecificLocationsInCountry() {
    var newOptions = [];

    this.state.searchOptions.forEach((opt) => {
      var currentCountryId = nextProps.location.query.id;

      if (currentCountryId == opt.country_id) {
        var cityObj = {
          name : opt.city,
          id : opt.city_id
        };

        var stateObj = {
          name : opt.state_region,
          id : opt.state_region_id
        };

        newOptions.push(cityObj, stateObj);
      }
    });

    this.setState({searchOptions: newOptions});
  }

  render() {
    console.log(this.state.display);
    var searchBar = <div></div>;
    if (this.state.display) {
      searchBar = <div>Searching ...</div>;
    } else {
      searchBar = <div></div>;
    }

    return (
      <div>
        {searchBar}
      </div>
    );
  }
}

export default Search;
