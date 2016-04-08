import alt from '../alt';
import Auth from '../sources/AuthSource';
import Photo from '../sources/PhotoSource';
import ls from 'local-storage';

class Actions {
  logInUser(credentials) {
    return (dispatch) => {
      Auth.login(credentials)
        .then((tokenResult) => {
        // Get user data
        Auth.getUserData(tokenResult.token, (user) => {
          dispatch(user);
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

  getUserData() {
    return (dispatch) => {
      dispatch(ls.getItem('userData'));
    }
  }

  setCurrentViewState(currentView) {
    return (dispatch) => {
      dispatch(currentView);
    }
  }

  getMorePhotos() {

  }
}

export default alt.createActions(Actions);
