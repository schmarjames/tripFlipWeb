import alt from '../alt';
import Actions from '../actions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';

@decorate(alt)
class PhotoGalleryStore {
  constructor() {
    this.state = {
      user : {
        photoAlbum : undefined
      },
      photoList : undefined,
      photoCards : undefined
    }
  }

  @bind(Actions.logInUser);
  login(user) {
    if (typeof user === 'object') {
      this.setState({user: Object.assign(this.state.user, user)});
      ls.remove('userData');
      ls('userData', user);
      console.log(this.state);
    }
  }

  @bind(Actions.getUserData);
  getUserData(user) {
    this.setState({user: Object.assign(this.state.user, user)});
  }

  @bind(Actions.setPhotoListVisiblityFilter);
  setPhotoListVisiblityFilter(data) {

  }
}

export default alt.createStore(PhotoGalleryStore);
