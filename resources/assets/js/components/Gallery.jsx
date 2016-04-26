import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

@connectToStores
class Gallery extends React.Component {
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

  componentWillReceiveProps(nextProps) {

    // store filters
    if (this.state.filters.length == 0) {
      this.setState({
        filters: this.state.filters.concat(nextProps.galleryFilterList)
      });
    }

    var newFilter = nextProps.locatoin.query.albumFilter;
    if (newFilter && (newFilter != this.state.selectedFilter)) {

      this.state.filters.forEach((filter) => {
        if (filter == newFilter.toUpperCase()) {
          this.setState({selectedFilter: newFilter}, () => {
            this.filterAlbumPhotos();
          });
        }
      });

    } else {
      this.setState({selectedFilter: this.state.filters[0]}, () => {
        this.filterAlbumPhotos();
      });
    }
  }

  componentDidMount() {}

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  filterAlbumPhotos() {
    Action.getUserAlbumPhotos(this.state.selectedFilter);
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    return(<div>the gallery.</div>);
  };
}

export default Gallery;
