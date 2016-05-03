import alt from '../alt';
import Actions from '../actions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';
import ls from 'local-storage';

@decorate(alt)
class AdminStore {
  constructor() {
    this.state = {
      user : {},
      acceptedPhotos : [],
      rejectedPhotos : []
    }
  }

  @bind(Actions.logInAdminUser);
  login(user) {
    if (typeof user === 'object') {
      this.setState({
        user: Object.assign(this.state.user, user)
      });
      ls.remove('userData');
      ls('userData', user);
    }
  }


  resetState() {
    ls.remove('userData');
    this.setState({
      user: {},
      acceptedPhotos : [],
      rejectedPhotos : []
    });
    window.location.hash ='/marketing';
  }
}

export default alt.createStore(AdminStore);
