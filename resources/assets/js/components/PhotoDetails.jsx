import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Modal from 'react-modal/lib/';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

@connectToStores
class PhotoDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data : undefined,
      content : undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.setState({
        data : nextProps.data,
        open : nextProps.open
      });

    }
  }

  prepareModal() {
    return (
        <Col lg={12} md={12} sm={12} className="photo-details-photo">
          <a href="" className="closeModal" onClick={this.closeModal.bind(this)}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </a>
          <Grid fluid className="summary-info">
            <Col xs={10}>
              {this.state.data.city}, {this.state.data.country} <br/>
              Likes: {this.state.data.likes}
            </Col>
            <Col className="weather-data" xs={2}>
              {this.state.data.weather.description} <br/>
              {Math.floor(this.state.data.weather.temp)} °F
            </Col>
          </Grid>
          <img src={this.state.data.url} />
        </Col>
    );
  }

  closeModal(e) {
    e.preventDefault();
    this.setState({open : false});
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    var modal = <div></div>;
    if (this.state.open) {
      modal = <Modal
            className="photo-details-modal"
            isOpen={this.state.open}>
            {this.prepareModal()}
          </Modal>;
    }

    return (
      <div>
        {modal}
      </div>
    );
  };
}

export default PhotoDetails;
