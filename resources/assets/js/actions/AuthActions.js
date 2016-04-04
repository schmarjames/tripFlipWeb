import alt from '../alt';
import Auth from '../Sources/AuthSource';

class AuthActions {
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
}

export default alt.createActions(AuthActions);
