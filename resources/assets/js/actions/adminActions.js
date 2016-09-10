import alt from '../alt';
import Auth from '../sources/AuthSource';
import Photos from '../sources/PhotoSource';
import Location from '../sources/LocationSource';
import VisiblityFilter from '../sources/VisibilitySource';
import ls from 'local-storage';

class Actions {

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

  logInAdminUser(credentials) {
    return (dispatch) => {
      Auth.adminLogin(credentials)
        .then((tokenResult) => {
        // Get user data
        Auth.getUserData(tokenResult.token, false, (user) => {
          dispatch(Object.assign(user, {token: 'Bearer ' + tokenResult.token}));
          window.location.hash ='/admin/photos?photoType=accepts';
        });
      })
      .catch((err) => {
        return;
      });
    }
  }

  listMorePhotosForAdmin(data) {
    return (dispatch) => {
      Photos.getMorePhotosForAdmin(data, (res) => {
        data.results = res;
          dispatch(data);
      });
    }
  }

  approvePhoto(data) {
    return (dispatch) => {
      Photos.approvePhoto(data.id, (res) => {
        res.index = data.index;
        dispatch(res);
      })
    }
  }

  rejectPhoto(data) {
    return (dispatch) => {
      Photos.rejectPhoto(data.id, (res) => {
        res.index = data.index;
        dispatch(res);
      })
    }
  }

  removePhoto(data) {
    return (dispatch) => {
      Photos.removePhoto(data.id, (res) => {
        res.index = data.index;
        dispatch(res);
      })
    }
  }
}

export default alt.createActions(Actions);
