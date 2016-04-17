import React from 'react';
import Actions from '../actions';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';

class Discovery extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.transitionCheck();
  }

  transitionCheck() {
    var state = PhotoGalleryStore.getState();
    if (!state.user.token) {
      window.location.hash ='/marketing';
    }
  }


  render() {
    return (
      <div>
        <p>This is the discovery page.</p>
      </div>
    );
  };
}

export default Discovery;
