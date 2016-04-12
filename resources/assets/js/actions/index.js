import alt from '../alt';
import Auth from '../sources/AuthSource';
import Photos from '../sources/PhotoSource';
import VisiblityFilter from '../sources/VisibilitySource';
import ls from 'local-storage';

class Actions {
  logInUser(credentials) {
    return (dispatch) => {
      Auth.login(credentials)
        .then((tokenResult) => {
        // Get user data
        Auth.getUserData(tokenResult.token, (user) => {
          dispatch(Object.assign(user, {token: 'Bearer ' + tokenResult.token}));
          // Store token and user data in localstorage
          /*AsyncStorage.multiSet([
            [authKey, tokenResult.token],
            [userKey, JSON.stringify(user)]
          ], (err) => {
            if (err) {
              throw err;
            }
            return cb({success : true});
          });*/

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
      dispatch({
        currentView : viewData.currentView,
        filter : VisiblityFilter[viewData.currentView][viewData.filter]
      });
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
}

export default alt.createActions(Actions);
