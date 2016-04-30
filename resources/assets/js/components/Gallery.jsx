import React from 'react';
import { Link } from 'react-router';
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
      stateId : undefined,
      countryId : undefined,
      cityId : undefined
    }
  }

  componentWillMount() {
    this.transitionCheck();
    var newFilter = this.props.location.query.albumFilter;
    if (newFilter && (newFilter.toUpperCase() != this.state.selectedFilter)) {
      this.changeAlbumFilter(this.props);
    } else {
      this.setState({selectedFilter: this.props.galleryFilterList[0]}, () => {
        this.filterAlbumPhotos();
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

    var newFilter = nextProps.location.query.albumFilter;
    // if we have a new params
    if (newFilter && (newFilter != this.state.selectedFilter)) {
      this.changeAlbumFilter(nextProps);
    }

    // if we have a new search
    else if (this.searchHasChanged(nextProps.searchData)) {
      this.filterAlbumPhotos();
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

  searchHasChanged(obj) {
    var props = Object.getOwnPropertyNames(obj),
        hasChanged = false;

    for (var i = 0; i < props.length; i++) {
      var propName = props[i];

      if (obj[propName] != this.state[propName]) {
        this.setState({propName : obj[propName]});
        hasChanged = true;
      }
    }
    return hasChanged;
  }

  filterAlbumPhotos() {
    Actions.getUserAlbumPhotos(this.state.selectedFilter);
  }

  preparePhotoAlbum() {
    var rowAmount = Math.ceil(this.props.photoAlbumSummary.length / 3),
        rows = [],
        currentRow = 1,
        currentPhoto = 0,
        filterType = this.props.location.query.albumFilter;

    for (var i = 0; i< rowAmount; i++) {
        var maxCount = 1;
        rows.push(
          <Row key={i}>
            {this.props.photoAlbumSummary.map((data, index) => {
              if ((index >= currentPhoto) && !(maxCount > 3)) {
                currentPhoto++;
                maxCount++;

                return (
                  <Col lg={4} md={6} sm={12} key={index} className="album-entry">
                    <Link to="album-feed" query={{albumFilter : filterType, id : (filterType == 'categories' ? data.category_id : data.country_id)}}>
                      <Grid fluid className="summary-info">
                        <Col xs={12}>
                          {(filterType == 'categories') ? data.category_name : data.country}
                        </Col>
                        {(data.likeAmount) ? <Col xs={12}>data.likeAmount</Col> : null}
                      </Grid>
                      <img src={data.url} />
                    </Link>
                  </Col>
                );
              }
            })}
          </Row>
        );

        /*
        <Link to="album-feed" query={{albumFilter : filterType, id : (filterType == 'categories' ? data.category_id : data.country_id)}}>
          <Grid fluid className="summary-info">
            <Col xs={12}>
              {(filterType == 'categories') ? data.category_name : data.country}
            </Col>
            {(data.likeAmount) ? <Col xs={12}>data.likeAmount</Col> : null}
          </Grid>
          <img src={data.url} />
        </Link>
        */
    }

    return <Grid id="album-summary">{rows}</Grid>;
  }

  displayAlbumSection(id, e) {
    e.preventDefault();
    console.log(id);
    // check the current filter

    // get id

    // prepare data for specific filter type

    // run request for photos

    // pass photos to gallery feed component
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
