import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

@connectToStores
class GalleryFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter : undefined,
      filters : []
    }
  }

  componentWillMount() {
    this.transitionCheck();
  }

  componentDidMount() {
    var self = this;
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (this.state.filters != 'CATAGORIES') {
          console.log("bottom");
          self.getMorePhotos(false);
        }
      }
    });
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
    return(<div>the gallery feed.</div>);
  };
}

export default GalleryFeed;
