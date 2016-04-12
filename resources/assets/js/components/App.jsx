import React from 'react';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import ls from 'local-storage';

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
    Actions.getUserData();
    /*Actions.logInUser({
      email: "rob@gmail.com",
      password: "Impala96"
    });*/

    //Actions.logOutUser();

    Actions.listMorePhotos('discovery',{
        "urlType" : "collection",
        "data" : {
          "amount" : 10,
          "category" : 1,
          "lastQueryId" : "",
          "latest" : 0
        }
    } , true);

    setTimeout(() => {
      Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : {
            "amount" : 10,
            "category" : 1,
            "lastQueryId" : 194,
            "latest" : 0
          }
      } , true);
    }, 4000);
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
      console.log(this.props.currentDiscoveryList);
    } else {
      console.log(this.props.user);
    }
    return (
      <div>{this.state.messages[0]}</div>
    );
  }
}

export default App;
