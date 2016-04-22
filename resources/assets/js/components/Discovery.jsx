import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';

@connectToStores
class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.storeState = PhotoGalleryStore.getState();
  }

  componentWillMount() {
    this.transitionCheck();

    // get all categories
    Actions.getCategoryPhotos();

    if (this.storeState.currentDiscoveryList.length == 0) {
      // call action to aquire photos from feed
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : {
            "amount" : 10,
            "lastQueryId" : "",
            "latest" : 0
          }
      } , true);
    }
  }
  componentDidMount() {
    var self = this;
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        console.log("bottom");
        self.getMorePhotos(false);
      }
    });
  }

  getMorePhotos(freshFilter) {
    if (this.storeState.currentDiscoveryList) {
      var lastPhotoId = this.props.currentDiscoveryList[this.props.currentDiscoveryList.length-1].id,
          data = {
            "amount" : 10,
            "lastQueryId" : lastPhotoId,
            "latest" : 0
          };
      if (freshFilter) {
        data.lastQueryId = "";
      }
      if (this.props.viewDiscoveryFilter != 'all') {
        data.category = this.props.viewDiscoveryFilter;
      }
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : data
      } , freshFilter);
    }
  }

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  changeDiscoveryCategory(id) {
    //e.preventDefault();
    if (id) {
      Actions.setCurrentViewFilter({
        currentView: "discovery",
        filterId: id
      });
      setTimeout(() => {
        this.getMorePhotos(true);
      }, 3000);

    }
  }

  prepareCategoryNav() {
    var navButtons = this.props.discoveryCategoryFilterList.map((data) => {
      return (
        <Button bsStyle="primary" bsSize="small" onClick={this.changeDiscoveryCategory.bind(this, data.category_id)}>{data.category_name}</Button>
      );
    });
    return (
      <ButtonToolbar className="discovery-category-nav">
        {navButtons}
      </ButtonToolbar>
    );
  }

  likePhoto(id, e) {
    console.log(e);
    console.log(id);
    e.preventDefault();
    Actions.likePhoto(id);
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
  var categoryButtons = (this.props.discoveryCategoryFilterList.length == 0) ? <ul></ul> : this.prepareCategoryNav();

  if (this.props.currentDiscoveryList.length > 0) {
    var photos = this.props.currentDiscoveryList.map((photoData) => {
      return (
        <li className="photoEntry">
          <a href="" onClick={this.likePhoto.bind(this, photoData.id)}><span className="glyphicon glyphicon-heart" aria-hidden="true"></span></a>
          <img src={photoData.url}/>
        </li>
      );
    });
      return (
        <div>
          {categoryButtons}
          <Masonry
            className={'photo-list'}
            elementType={'ul'}
            options={{}}
            disableImagesLoaded={false}
          >
            {photos}
          </Masonry>
        </div>
      );
    } else {
      return (
        <div>LOADING.........</div>
      );
    }
  };
}

export default Discovery;
