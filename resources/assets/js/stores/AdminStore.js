import React from 'react';
import alt from '../alt';
import Actions from '../actions/adminActions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';
import ls from 'local-storage';

@decorate(alt)
class AdminStore {
  constructor() {
    this.state = {
      user : {},
      acceptedPhotos : [],
      rejectedPhotos : [],
      lastPhotoId : undefined
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

  @bind(Actions.listMorePhotosForAdmin);
  getMorePhotos(data) {
    if (data.results.hasOwnProperty('acceptedPhotos') || data.results.hasOwnProperty('rejectedPhotos')) {
      var photoUrl = "";
      var photoData,
          buttons;

      if (data.tableType == 'accepts') {
        photoData = data.results.acceptedPhotos;
      }
      else if (data.tableType == 'rejects') {
        photoData = data.results.rejectedPhotos;
      }

      for (var i=0; i<photoData.length; i++) {
            photoData[i].photo_data = JSON.parse(photoData[i].photo_data);
            photoUrl = "https://farm" + photoData[i].photo_data.farm + ".staticflickr.com/" + photoData[i].photo_data.server + "/" + photoData[i].photo_data.id + "_" + photoData[i].photo_data.secret + ".jpg";
            photoData[i].approved = (photoData[i].approved !== null) ? Boolean(photoData[i].approved) : false;
            photoData[i].photo_data = <div><img style={{width: "100%"}} src={photoUrl} /></div>;
            photoData[i].buttons = buttons;
            photoData[i].index = i;
            photoData[i].buttons = (data.tableType == 'accepts') ? 'accepts' : 'rejects';

            if (i === (photoData.length-1)) {
              this.setState({lastPhotoId : photoData[i].id});
            }
      }

      if (data.tableType == 'accepts') {
        if (data.freshFilter) {
          console.log(data.results);
          this.setState({
            acceptedPhotos : photoData,
            totalApproves: data.results.totalApproves
          });
          return;
        }
        this.setState({
          acceptedPhotos : this.state.acceptedPhotos.concat(photoData),
          totalApproves: data.results.totalApproves
        });
      }

      else if (data.tableType == 'rejects') {
        if (data.freshFilter) {
          this.setState({
            rejectedPhotos : photoData,
            totalApproves: data.results.totalApproves
          });
          return;
        }
        this.setState({
          rejectedPhotos : this.state.rejectedPhotos.concat(photoData)
        });
      }
    }
  }

  @bind(Actions.approvePhoto);
  approvePhoto(data) {
    var clone = this.state.acceptedPhotos.slice(0);
    clone.splice(data.index, 1);
    this.setState({acceptedPhotos: clone});
  }

  @bind(Actions.rejectPhoto);
  rejectPhoto(data) {
    var clone = this.state.acceptedPhotos.slice(0);
    clone.splice(data.index, 1);
    this.setState({acceptedPhotos: clone});
  }

  @bind(Actions.removePhoto);
  removePhoto(data) {
    var clone = this.state.rejectedPhotos.slice(0);
    clone.splice(data.index, 1);
    this.setState({rejectedPhotos: clone});
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
