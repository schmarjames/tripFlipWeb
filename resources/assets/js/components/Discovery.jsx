import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

@connectToStores
class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory : undefined,
      categories : {}
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

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }

  changeDiscoveryCategory(id) {
    //e.preventDefault();
    console.log(id);
      console.log(id);
      Actions.setCurrentViewFilter({
        currentView: "discovery",
        filterId: id
      });
      setTimeout(() => {
        this.getMorePhotos(true);
      }, 3000);
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


  if (this.props.currentDiscoveryList.length > 0) {
    var photos = this.props.currentDiscoveryList.map((photoData) => {
      var heartState = "glyphicon"
      heartState += (photoData.likedByUser) ? ' glyphicon-heart' : ' glyphicon-heart-empty';
      return (
        <li className="photoEntry">
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

          <img src={photoData.url}/>
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
