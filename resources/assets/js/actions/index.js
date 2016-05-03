import alt from '../alt';
import Auth from '../sources/AuthSource';
import Photos from '../sources/PhotoSource';
import Location from '../sources/LocationSource';
import VisiblityFilter from '../sources/VisibilitySource';
import ls from 'local-storage';

class Actions {
  logInUser(credentials) {
    return (dispatch) => {
      Auth.login(credentials)
        .then((tokenResult) => {
        // Get user data
        console.log(tokenResult);
        Auth.getUserData(tokenResult.token, true, (user) => {
          dispatch(Object.assign(user, {token: 'Bearer ' + tokenResult.token}));
          window.location.hash ='/discovery';
        });
      })
      .catch((err) => {
        return;
      });
    }
  }

  logOutUser() {
    return (dispatch) => {
      ls.remove('userData');

      // if removed
      if (ls.get('userData') === null) {
        dispatch(true);
        window.location.hash ='/marketing';
      }
    }
  }

  getUserData() {
    return (dispatch) => {
      dispatch(ls.get('userData'));
    }
  }

  setCurrentViewFilter(viewData) {
    return (dispatch) => {
      // based on gallery or discover view
      dispatch(viewData);
    }
  }

  listMorePhotos(currentView, data, newFilter) {
    return (dispatch) => {
      Photos.queryPhotos(data, (res) => {
        currentView, res, newFilter
        dispatch({
          view : currentView,
          photos : res,
          filter : newFilter
        });
      });
    }
  }

  likePhoto(photoId) {
    return (dispatch) => {
      dispatch(photoId);
      Photos.likePhoto(photoId);
    }
  }

  getCategoryPhotos() {
    return (dispatch) => {
      Photos.getCategoryPhotos((data) => {
        dispatch(data);
      });
    }
  }

  getUserAlbumPhotos(data) {
    return (dispatch) => {
      Photos.getUserAlbumPhotos(data, (res) => {
        dispatch(res);
      });
    }
  }

  getLocationSearchOptions() {
    return (dispatch) => {
      Location.getSearchOptions((res) => {
        dispatch(res);
      });
    }
  }

  /**********************************************
      ADMIN ACTIONS
   *********************************************/
  logInAdminUser(credentials) {
    return (dispatch) => {
      Auth.adminLogin(credentials)
        .then((tokenResult) => {
        // Get user data
        console.log(tokenResult);
        Auth.getUserData(tokenResult.token, false, (user) => {
          dispatch(Object.assign(user, {token: 'Bearer ' + tokenResult.token}));
          window.location.hash ='/admin/accepts';
        });
      })
      .catch((err) => {
        return;
      });
    }
  }

  getMorePhotosForAdmin(tableType, lastId, locations) {
    Photos.getMorePhotosForAdmin(tableType, lastId, locations, (res) => {
      console.log(res);
    });
  }
}

export default alt.createActions(Actions);
