import React from 'react';
import Actions from '../actions/AuthActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';

@connectToStores
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [
        'hi there how are you',
        'what is that'
      ]
    }

    Actions.logInUser({
      email: "Rob@gmail.com",
      password: "Impala96"
    });
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    var view = <div>waiting.....</div>;

    if (this.props.user) {
      console.log(this.props.user);
    }
    return (
      <div>{this.state.messages[0]}</div>
    );
  }
}

export default App;
