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

      setTimeout(() => {
        Actions.listMorePhotos('discovery',{
            "urlType" : "collection",
            "data" : {
              "amount" : 10,
              "category" : 1,
              "lastQueryId" : 194,
              "latest" : 0
            }
        } , false);
      }, 4000);
    }
  }
  componentDidMount() {
    if (this.state.masonryList) {
      // detect screen position
      $(window).on('scroll', () => {
        if ($(window).scrollTop() + $(window).height() == $(document.height())) {
          console.log("bottom");
        }
      });
    }

  }

  componentDidUpdate() {
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
