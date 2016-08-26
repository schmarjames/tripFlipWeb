import React from 'react';
import $ from 'jquery';
import Actions from '../actions/adminActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import AdminStore from '../stores/AdminStore';
import PhotoData from './PhotoData.jsx';
import Griddle from 'griddle-react';

@connectToStores
class Rejects extends React.Component {
  constructor() {
    super();

    this.state = {
      totalApproves : 0,
      recentTotal : 0,
      lastPhotoId : undefined,
      currentPageNum : 0,
      maxPages: 5,
      externalResultsPerPage: 20,
      externalSetPageSize: 20,
      columnMetaData: [
        {
          "columnName" : "id",
          "visible" : false
        },
        {
          "columnName" : "city",
          "displayName" : "City"
        },
        {
          "columnName" : "state_region",
          "displayName" : "State / Region"
        },
        {
          "columnName" : "country",
          "displayName" : "Country"
        },
        {
          "columnName" : "photo_data",
          "displayName" : "Photo"
        },
        {
          "columnName" : "buttons",
          "displayName" : "",
          "customComponent" : PhotoData
        },
      ]
    };
  }

  componentWillMount() {
    this.transitionCheck();
  }

  componentDidMount() {
    var self = this;

    // initial load
    if (this.props.rejectedPhotos.length == 0) {
      this.getPhotoData(undefined, true);
    }

    // accept / reject click events
    $(document).on('click', '.approve', function(e) {
      e.preventDefault();

      var id = parseInt($(this)[0].dataset.photoId),
          index = parseInt($(this)[0].dataset.index);
      Actions.approvePhoto({id : id, index: index});
    });

    $(document).on('click', '.remove', function(e) {
      e.preventDefault();

      var id = parseInt($(this)[0].dataset.photoId),
          index = parseInt($(this)[0].dataset.index);
      Actions.removePhoto({id : id, index: index});
    });
  }

  setPage(index) {
    index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
    this.getPhotoData(index, false);
  }

  getPhotoData(page, isfreshFilter) {
    var self = this,
        page = page || 1;

    Actions.listMorePhotosForAdmin({
      tableType : 'rejects',
      lastId : self.props.lastPhotoId,
      locations : {
        country : "",
        stateRegion : "",
        city : ""
      },
      freshFilter : isfreshFilter
    });

    this.setState({
      currentPageNum: page-1
    });
  }

  transitionCheck() {
    var state = AdminStore.getState();
    console.log(state.user.token);
    if (!state.user.hasOwnProperty('token')) {
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
    var rejectDom = <div></div>;
    if (this.props.rejectedPhotos.length > 0) {
      rejectDom = <Griddle
          useExternal={true}
          results={this.props.rejectedPhotos}
          columns={["city", "state_region", "country", "photo_data", "buttons"]}
          columnMetadata={this.state.columnMetaData}
          showFilter={true}
          externalSetPage={this.setPage.bind(this)}
          externalCurrentPage={this.state.currentPageNum}
          externalMaxPage={this.state.maxPages}
          externalSetPageSize={function() {}}
          externalSortColumn={null}
          externalSortAscending={true}
          externalChangeSort={function() {}}
          externalSetFilter={function() {}}
          resultsPerPage={this.state.externalResultsPerPage}
          ></Griddle>
    } else {
      rejectDom = <div>Loading ....</div>;
    }

    return (
      <div>
        {rejectDom}
      </div>
    );
  };
}

export default Rejects;
