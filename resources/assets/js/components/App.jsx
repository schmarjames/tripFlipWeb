import React from 'react';
import Actions from '../actions';
import {RouteHandler} from 'react-router';

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

    /*Actions.listMorePhotos('explorer',{
        "urlType" : "randomcollection",
        "data" : {
          "views" : []
        }
    } , true);*/


      /*Actions.listMorePhotos('discovery',{
          "urlType" : "collection",
          "data" : {
            "amount" : 10,
            "category" : 1,
            "lastQueryId" : 194,
            "latest" : 0
          }
      } , true);*/
  }

/*  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }*/

  render() {

    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
}

export default App;
