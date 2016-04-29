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

    }
  }

  componentWillMount() {
    this.transitionCheck();
    var newFilter = this.props.location.query.albumFilter;
    if (newFilter && (newFilter.toUpperCase() != this.state.selectedFilter)) {
      this.changeAlbumFilter(this.props);
    } else {
      this.setState({selectedFilter: this.state.galleryFilterList[0]}, () => {
        this.filterAlbumPhotos();
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

    var newFilter = nextProps.location.query.albumFilter;
    if (newFilter && (newFilter != this.state.selectedFilter)) {
      this.changeAlbumFilter(nextProps);
    }
  }

  changeAlbumFilter(currentProps) {
    var newFilter = currentProps.location.query.albumFilter;
    currentProps.galleryFilterList.forEach((filter) => {
      if (filter == newFilter.toUpperCase()) {
        this.setState({selectedFilter: newFilter}, () => {
          this.filterAlbumPhotos();
        });
      }
    });
  }

  componentDidMount() {}

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  filterAlbumPhotos() {
    Actions.getUserAlbumPhotos(this.state.selectedFilter);
  }

  preparePhotoAlbum() {
    var albumData = this.props.photoAlbumSummary,
        rowAmount = Math.ceil(this.props.photoAlbumSummary.length / 3),
        extra = this.props.photoAlbumSummary.length % 3,
        albumSections,
        rows = [];
console.log(rowAmount);

        var currentRow = 1;
        var currentPhoto = 0;
        for (var i = 0; i< rowAmount; i++) {
          var maxCount = 1;
          rows.push(
            <Row>
              {this.props.photoAlbumSummary.map((data, index) => {
                console.log('index ----' + index);
                console.log('currentPhoto ---' + currentPhoto);
                console.log('maxCount ---' + maxCount);
                if ((index >= currentPhoto) && !(maxCount > 3)) {
                  currentPhoto++;
                  maxCount++;
                  return (
                    <Col xs={4}><img src={data.url} /></Col>
                  );
                }
              })}
            </Row>
          );
        }

    return <Grid>{rows}</Grid>;
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    var summaryLayout = <Grid></Grid>;
      console.log(this.props.photoAlbumSummary);
    if (this.props.photoAlbumSummary.length > 0) {
      summaryLayout = this.preparePhotoAlbum();
      console.log(summaryLayout);
    }
    return(
      <div>{summaryLayout}</div>
    );
  };
}

export default Gallery;
