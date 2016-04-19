import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';

@connectToStores
class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masonryList : undefined
    }
    this.storeState = PhotoGalleryStore.getState();
  }

  componentWillMount() {
    this.transitionCheck();

    if (this.storeState.currentDiscoveryList.length == 0) {
      // call action to aquire photos from feed
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : {
            "amount" : 10,
            "category" : 1,
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
        self.getMorePhotos();
      }
    });
  }

  componentDidUpdate() {
  }

  getMorePhotos() {
    console.log(this.state);
    if (this.storeState.currentDiscoveryList) {
      var lastPhotoId = this.props.currentDiscoveryList[this.props.currentDiscoveryList.length-1].id;
console.log(lastPhotoId);
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : {
            "amount" : 10,
            "category" : 1,
            "lastQueryId" : 194,
            "latest" : 0
          }
      } , false);
    }
  }

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {

if (this.props.currentDiscoveryList.length > 0) {
  console.log(this.props.currentDiscoveryList);
  console.log(this.props.currentDiscoveryList[this.props.currentDiscoveryList.length - 1]);
  var photos = this.props.currentDiscoveryList.map((photoData) => {
    return(
      <li className="photoEntry">
        <img src={photoData.url}/>
      </li>
    );
  });
      return (
        <Masonry
          className={'photo-list'}
          elementType={'ul'}
          options={{}}
          disableImagesLoaded={false}
        >
          {photos}
        </Masonry>
      );
    } else {
      return (
        <div>LOADING.........</div>
      );
    }
  };
}

export default Discovery;
