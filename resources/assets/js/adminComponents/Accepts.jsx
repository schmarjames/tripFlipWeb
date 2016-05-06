import React from 'react';
import $ from 'jquery';
import Actions from '../actions/adminActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import AdminStore from '../stores/AdminStore';
var DataTable = require('react-data-components').DataTable;

@connectToStores
class Accepts extends React.Component {
  constructor() {
    super();

    this.state = {
      totalApproves : 0,
      recentTotal : 0,
      lastPhotoId : undefined,
      currentPageNum : undefined,
      columns : [
      { title: 'City', prop: 'city'  },
      { title: 'State / Region', prop: 'state_region' },
      { title: 'Country', prop: 'country' },
      { title: 'Photo', prop: 'photo_data' },
      { title: '', prop: 'buttons'}
      ],
      data : []
    };
  }

  componentWillMount() {
    this.transitionCheck();
  }

  componentDidMount() {
    var self = this;

    // initial load
    if (this.props.acceptedPhotos.length == 0) {
      Actions.listMorePhotosForAdmin({
        tableType : 'accepts',
        lastId : null,
        locations : {
          country : "",
          stateRegion : "",
          city : ""
        },
        freshFilter : true
      });
    }

    // capture current page number of data table
    $(document).on('click', 'ul.pagination a', function(e) {
      if ($(this).attr("aria-label") == undefined) {
        var currentPageNum = $(this).find('span').text();
        if (!isNaN(currentPageNum)) {
          self.setState({
            currentPageNum : parseInt(currentPageNum)
          });
        }
      }
    });

    // last pagination event - get more photos
    $(document).on('click', 'ul.pagination a[aria-label="Last"]', function(e) {

      Actions.listMorePhotosForAdmin({
        tableType : 'accepts',
        lastId : self.props.lastPhotoId,
        locations : {
          country : "",
          stateRegion : "",
          city : ""
        },
        freshFilter : false
      });
    });

    // accept / reject click events

    $(document).on('click', '.approve', function(e) {
      e.preventDefault();

      var id = parseInt($(this)[0].dataset.photoId),
          index = parseInt($(this)[0].dataset.index);
      Actions.approvePhoto({id : id, index: index});
    });

    $(document).on('click', '.reject', function(e) {
      e.preventDefault();

      var id = parseInt($(this)[0].dataset.photoId),
          index = parseInt($(this)[0].dataset.index);
      Actions.rejectPhoto({id : id, index: index});
    });
  }

  componentWillReceiveProps(nextProps) {

  }

  transitionCheck() {
    var state = AdminStore.getState();
    console.log(state.user.token);
    if (!state.user.hasOwnProperty('token')) {
      //window.location.hash ='/marketing';
    }
  }

  static getStores() {
    return [AdminStore];
  }

  static getPropsFromStores() {
    return AdminStore.getState();
  }

  render() {
    var acceptDom = <div></div>;
    if (this.props.acceptedPhotos.length > 0) {
      acceptDom = <DataTable
          className="container"
          keys={[ 'id' ]}
          columns={this.state.columns}
          initialData={this.props.acceptedPhotos}
          initialPageLength={5}
          initialSortBy={{ prop: 'city', order: 'descending' }}
          pageLengthOptions={[ 5, 20, 50 ]}
        />
    } else {
      acceptDom = <div>Loading ....</div>;
    }

    return (
      <div>
        {acceptDom}
      </div>
    );
  };
}

export default Accepts;
