import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import PhotoDetails from './PhotoDetails.jsx';
import Modal from 'react-modal/lib/';
import { ListGroup, ListGroupItem, Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

@connectToStores
class GalleryFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter : undefined,
      categoryId : undefined,
      stateId : undefined,
      countryId : undefined,
      cityId : undefined,
      showDetails : false,
      closeModal : () => {
        this.setState({ showDetails : false });
      },
      currentPhotoData : undefined
    }
  }

  componentWillMount() {
    this.transitionCheck();
    var params = this.props.location.query;

    console.log(params);

    if (params.albumFilter && !isNaN(params.id)) {
      this.prepareQueryData(params.albumFilter, params.id);
    } else {
      window.location.hash ='/album';
    }
  }

  newParamsExist(params) {
    if (params.albumFilter && params.id) {
      if (params.albumFilter.toUpperCase() != this.state.selectedFilter) {
        if (params.id != this.state.selectedId) {
          return true;
        }
      }
    }
    return false;
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

  componentDidMount() {
    var self = this;
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
          console.log("bottom");
          self.getMorePhotos(false);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    var params = this.props.location.query;

      // if we have a new params
      if (this.newParamsExist(params)) {
        this.prepareQueryData(params.albumFilter, params.id);
      }

      // if we have a new search
      else if (this.searchHasChanged(nextProps.searchData)) {
        this.getMorePhotos(true);
      }
  }

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  prepareQueryData(filterType, id) {
    if (filterType == 'categories' && (filterType != this.state.selectedFilter)) {
      this.setState({
        selectedFilter: filterType,
        categoryId: id,
        countryId : undefined,
        stateId : undefined,
        cityId : undefined
      }, () => {
        this.getMorePhotos(true);
      });
    } else if (filterType == 'countries' && (filterType != this.state.selectedFilter)) {
      this.setState({
        selectedFilter: filterType,
        categoryId: undefined,
        countryId: id,
        stateId : undefined,
        cityId : undefined
      }, () => {
        this.getMorePhotos(true);
      });
    }
  }

  prepareSearchData(data) {

  }

  getMorePhotos(freshFilter) {
      var lastPhotoId = (this.props.currentGalleryList.length == 0) ? null : this.props.currentGalleryList[this.props.currentGalleryList.length-1].id,
          data = {
            "amount" : 10,
            "lastQueryId" : lastPhotoId,
            "latest" : 0
          },
          queryType;

      if (this.state.selectedFilter == "countries") {
        queryType = "userlocationcollection";
        data = Object.assign(data, {
          countryId : (this.state.countryId) ? this.state.countryId : null,
          stateRegionId : (this.state.stateId) ? this.state.stateId : null,
          cityId : (this.state.cityId) ? this.state.cityId : null
        });
      } else if (this.state.selectedFilter = "categories") {
        var locations = {};

        if (this.state.countryId || this.state.stateId || this.state.cityId) {
          locations.countryId = this.state.countryId;
          locations.stateId = this.stte.stateId;
          locations.cityId = this.state.cityId;

          data['location'] = locations;
        }

        queryType = "usercategorycollection";
        data.category = this.state.categoryId;
      }

      if (freshFilter) {
        data.lastQueryId = "";
      }

      Actions.listMorePhotos('gallery', {
          "urlType" : queryType,
          "data" : data
      }, freshFilter);
  }

  likePhoto(id, e) {
    e.preventDefault();
    Actions.likePhoto(id);
    Actions.getLocationSearchOptions();
  }

  showPhotoDetails(photoData, e) {
    e.preventDefault();

    this.setState({
      currentPhotoData : photoData,
      showDetails : true
    });

  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    if (this.props.currentGalleryList.length > 0) {
      var tipMessage = <ListGroup>
                          <ListGroupItem bsStyle="info">Select a photo in your album to see further details about its location.</ListGroupItem>
                        </ListGroup>;
      var photos = this.props.currentGalleryList.map((photoData, i) => {
        var heartState = "glyphicon"
        heartState += (photoData.likedByUser) ? ' glyphicon-heart' : ' glyphicon-heart-empty';
        return (
          <li className="photoEntry" key={i}>
            <Grid fluid className="imageTitle">
              <Col md={10}>
                {photoData.city}, {photoData.country}
              </Col>
              <Col md={2}>
                <a href="" className="likeBtn" onClick={this.likePhoto.bind(this, photoData.id)}>
                  <span className={heartState} aria-hidden="true"></span>
                </a>
              </Col>
            </Grid>
            <a href="" onClick={this.showPhotoDetails.bind(this, photoData)}>
              <img src={photoData.url}/>
            </a>
          </li>
        );
      });
        return (
          <div>
            {tipMessage}
            <Masonry
              className={'photo-list center-block'}
              elementType={'ul'}
              options={{}}
              disableImagesLoaded={false}
            >
              {photos}
            </Masonry>
            <PhotoDetails
              closeModal={this.state.closeModal}
              open={this.state.showDetails}
              data={this.state.currentPhotoData}
              />
          </div>
        );
      } else {
        return (
          <div>LOADING.........</div>
        );
      }
  };
}

export default GalleryFeed;
