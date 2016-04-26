import alt from '../alt';
import Actions from '../actions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';
import ls from 'local-storage';

@decorate(alt)
class PhotoGalleryStore {
  constructor() {
    this.state = {
      user : {},
      what : "",
      photoAlbumSummary : [],
      viewGalleryFilter: 'CATAGORIES',
      galleryFilterList: [
        'CATAGORIES',
        'COUNTRIES'
      ],
      currentGalleryList: [],
      viewDiscoveryFilter: 'all',
      discoveryCategoryFilterList: [],
      currentDiscoveryList: [],
      photoCards : []
    }
  }

  @bind(Actions.logInUser);
  login(user) {
    if (typeof user === 'object') {
      this.setState({
        user: Object.assign(this.state.user, user)
      });
      ls.remove('userData');
      ls('userData', user);
    }
  }

  @bind(Actions.logOutUser);
  logout(status) {
    if (status) {
      this.resetState();
    }
  }

  @bind(Actions.getUserData);
  getUserData(user) {
    this.setState({
      user: Object.assign(this.state.user, user)
    });
  }

  @bind(Actions.listMorePhotos);
  listMorePhotos(data) {
    // missing token!
    if (data.badCredentials || data.unknownError) {
      this.resetState();
      return;
    }

    if (data.view == 'gallery') {
      if (data.filter) {
        this.setState({currentGalleryList : data.photos});
        return;
      }
      this.setState({
        currentGalleryList : this.state.currentGalleryList.concat(data.photos)
      });
    }

    if (data.view == 'discovery') {
      if (data.filter) {
        this.setState({currentDiscoveryList : data.photos});
        return;
      }
      this.setState({
        currentDiscoveryList : this.state.currentDiscoveryList.concat(data.photos)
      });
    }

    if (data.view == 'explorer') {
      if (data.filter) {
        this.setState({photoCards : data.photos});
        return;
      }
      this.setState({
        photoCards : this.state.photoCards.concat(data.photos)
      });
    }
  }

  @bind(Actions.getCategoryPhotos);
  getCategoryPhotos(data) {
    if (data.badCredentials || data.unknownError) {
      this.resetState();
      return;
    }

    this.setState({
      discoveryCategoryFilterList : this.state.discoveryCategoryFilterList.concat(data)
    });

  }

  @bind(Actions.getUserAlbumPhotos);
  getUserAlbumPhotos(data) {
    if (data.badCredentials || data.unknownError) {
      this.resetState();
      return;
    }

    this.setState({
      photoAlbumSummary : this.state.photoAlbumSummary.concat(data)
    });
  }

  @bind(Actions.likePhoto);
  likePhoto(photoId) {
    var self = this,
        lists = ['currentGalleryList', 'currentDiscoveryList'];

    lists.forEach((list) => {
      if (this.state[list].length > 0) {
        var index = this.state[list].findIndex((el, idx, array) => {
              if (el.id == photoId) { return true; }
                    return false;
            }),
            listCopy = JSON.parse(JSON.stringify(this.state[list]));

        if (listCopy[index].likedByUser) {
          listCopy[index].likes--;
          listCopy[index].likedByUser = false;
        } else {
          listCopy[index].likes++;
          listCopy[index].likedByUser = true;
        }

        self.setState({[list]: listCopy});
      }
    });

  }

  @bind(Actions.setCurrentViewFilter);
  setViewFilter(data) {
    var match,
        newFilter;
        console.log(data.currentView);
    if (data.currentView == 'gallery') {
      match = this.state.galleryFilterList.filter((galleryViewEntry) => {
        if (galleryViewEntry == data.filter) return galleryViewEntry;
      })[0];

      newFilter = (match) ? data.filter : 'CATAGORIES';
      this.setState({viewGalleryFilter: data.filter});
    } else if (data.currentView == 'discovery') {
      match = this.state.discoveryCategoryFilterList.filter((categoryEntry) => {
        if (categoryEntry.category_id == data.filterId) return categoryEntry;
      })[0];
      console.log(match);
      newFilter = (match) ? match.category_id : 'all';
      this.setState({viewDiscoveryFilter: newFilter});
      console.log('change filter');
      console.log(this.state.viewDiscoveryFilter);
    }
  }

  resetState() {
    ls.remove('userData');
    this.setState({
      user: {},
      currentGalleryList: [],
      currentDiscoveryList : []
    });
    window.location.hash ='/marketing';
  }
}

export default alt.createStore(PhotoGalleryStore);
