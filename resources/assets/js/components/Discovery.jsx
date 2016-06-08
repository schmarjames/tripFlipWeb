import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import Lightbox from 'react-images';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import Spinner from 'react-spinner';

@connectToStores
class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory : undefined,
      categories : {},

      // light box state data
      lightBoxData : [],
      lightBoxIsOpen : false,
      currentLightBoxImage : 0
    };
    this.storeState = PhotoGalleryStore.getState();
  }

  componentWillMount() {
    this.transitionCheck();
  }

  componentWillReceiveProps(nextProps) {

      // store categories
      if (Object.keys(this.state.categories).length == 0) {
        this.setState({
          categories: Object.assign(this.state.categories, nextProps.discoveryCategoryFilterList)
        });
      }

      var newCategoryId = nextProps.location.query.categoryId;
      if (newCategoryId && (newCategoryId != this.state.selectedCategory)) {

        // all photos
        if (newCategoryId == "all") {
          this.setState({selectedCategory: "all"}, () => {
            this.getMorePhotos(true);
          });
        }

        // category specific photos
        else {
          $.each(this.state.categories, (index, category) => {
            if (category.category_id == newCategoryId) {
              this.setState({selectedCategory: newCategoryId}, () => {
                this.getMorePhotos(true);
              });

            }
          });
        }

      // initial photo load
      } else if (nextProps.currentDiscoveryList.length == 0 && this.state.selectedCategory == undefined) {
        this.setState({selectedCategory: "all"}, () => {
          this.getMorePhotos(true);
        });
      }

      //prepare lightbox data
      if (nextProps.currentDiscoveryList.length > 0) {
        this.prepareLightBoxData(nextProps.currentDiscoveryList);
      }
  }

  componentDidMount() {
    var self = this;
    $(window).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        self.getMorePhotos(false);
      }
    });
  }

  getMorePhotos(freshFilter) {
      var lastPhotoId = (this.props.currentDiscoveryList.length == 0) ? null : this.props.currentDiscoveryList[this.props.currentDiscoveryList.length-1].id,
          data = {
            "amount" : 10,
            "lastQueryId" : lastPhotoId,
            "latest" : 0
          };
      if (freshFilter) {
        data.lastQueryId = "";
      }
      if (this.state.selectedCategory) {
        data.category = (this.state.selectedCategory == "all") ? undefined : this.state.selectedCategory;
      }
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : data
      } , freshFilter);
  }

  prepareLightBoxData(data) {
    var lightBoxArr = data.map((photo) => {
      return {
        src: photo.url,
        caption: 'Author: ' + photo.author + ' -- ' + photo.city + ', ' + photo.country
      }
    });
    this.setState({lightBoxData : lightBoxArr});
  }

  openLightBox(index, e) {
    e.preventDefault();
    this.setState({
      currentLightBoxImage: index,
      lightBoxIsOpen: true
    });
  }

  closeLightBox() {
    this.setState({
      currentImage:0,
      lightBoxIsOpen:false
    });
  }

  goToPrevious() {
    this.setState({
      currentLightBoxImage: this.state.currentLightBoxImage -1
    });
  }

  goToNext() {
    this.setState({
      currentLightBoxImage: this.state.currentLightBoxImage +1
    });
  }

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  changeDiscoveryCategory(id) {
      Actions.setCurrentViewFilter({
        currentView: "discovery",
        filterId: id
      });
      setTimeout(() => {
        this.getMorePhotos(true);
      }, 3000);
  }

  likePhoto(id, e) {
    e.preventDefault();
    Actions.likePhoto(id);
    Actions.getLocationSearchOptions();
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    if (this.props.currentDiscoveryList.length > 0) {
      var photos = this.props.currentDiscoveryList.map((photoData, i) => {
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
            <a href={photoData.url} onClick={this.openLightBox.bind(this, i)}>
              <img src={photoData.url}/>
            </a>
          </li>
        );
      });
        return (
          <div>
            <Masonry
              className={'photo-list center-block'}
              elementType={'ul'}
              options={{}}
              disableImagesLoaded={false}
            >
              {photos}
            </Masonry>

            <Lightbox
                currentImage={this.state.currentLightBoxImage}
                images={this.state.lightBoxData}
                isOpen={this.state.lightBoxIsOpen}
                onClickPrev={this.goToPrevious.bind(this)}
                onClickNext={this.goToNext.bind(this)}
                onClose={this.closeLightBox.bind(this)}
              />
          </div>
        );
      } else {
        return (
          <Spinner />
        );
      }
  };
}

export default Discovery;
