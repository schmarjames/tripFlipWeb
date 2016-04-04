import alt from '../alt';
import Actions from '../actions/AuthActions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';

@decorate(alt)
class PhotoGalleryStore {
  constructor() {
    this.state = {user: null};
  }

  @bind(Actions.logInUser);
  login(user) {
    console.log(user);
    this.setState({user: user});
  }
}

export default alt.createStore(PhotoGalleryStore);
