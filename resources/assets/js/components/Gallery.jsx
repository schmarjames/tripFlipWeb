import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Masonry from 'react-masonry-component';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';


class Gallery extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }
  componentDidMount() {

  }

  render() {
    return(<div>the gallery.</div>);
  };
}

export default Gallery;
