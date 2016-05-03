import React from 'react';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import AdminStore from '../stores/AdminStore';
var DataTable = require('react-data-components').DataTable;

var columns = [
  { title: 'City', prop: 'city'  },
  { title: 'State / Region', prop: 'state' },
  { title: 'Country', prop: 'country' },
  { title: 'Photo', prop: 'photo' },
  { title: '', prop: 'button'}
];

var data = [
  { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' }
  // It also supports arrays
  // [ 'name value', 'city value', 'address value', 'phone value' ]
];

@connectToStores
class Accepts extends React.Component {
  constructor() {
    super();

    this.state = {
      colunms : [
        { title: 'City', prop: 'city'  },
        { title: 'State / Region', prop: 'state' },
        { title: 'Country', prop: 'country' },
        { title: 'Photo', prop: 'photo' },
        { title: '', prop: 'button'}
      ]
    };
  }

  componentWillMount() {
    this.transitionCheck();

    if (this.props.acceptedPhotos.length == 0) {
      Actions.getMorePhotosForAdmin('accepts', null, {
        country : "",
        stateRegion : "",
        city : ""
      });
    }
  }

  transitionCheck() {
    var state = AdminStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  static getStores() {
    return [AdminStore];
  }

  static getPropsFromStores() {
    return AdminStore.getState();
  }

  render() {
    return (
      <DataTable
        className="container"
        keys={[ 'name', 'address' ]}
        columns={this.state.columns}
        initialData={data}
        initialPageLength={5}
        initialSortBy={{ prop: 'city', order: 'descending' }}
        pageLengthOptions={[ 5, 20, 50 ]}
      />
    );
  };
}

export default Accepts;
