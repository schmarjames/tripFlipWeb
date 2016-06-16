import React from 'react';
import $ from 'jquery';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Modal from 'react-modal/lib/';
import { Grid, Row, Col } from 'react-bootstrap';
import { GoogleMapLoader, GoogleMap, Circle, InfoWindow } from 'react-google-maps';
import { default as raf } from "raf";

@connectToStores
class PhotoDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data : undefined,
      content : undefined,
      center : undefined,
      radius : 6000
    }
  }

  componentDidMount() {

  }



  componentWillReceiveProps(nextProps) {
    var self = this;

    if (nextProps.open) {
      console.log(nextProps.data);
      this.setState({
        data : nextProps.data,
        open : nextProps.open,
        center : {
          lat : parseFloat(nextProps.data.lat),
          lng : parseFloat(nextProps.data.long)
        },
        content : nextProps.data.city + ', ' + nextProps.data.country
      }, () => {
        $("#photo-details-modal, .modal-backdrop").fadeIn(500, function() {
          this.prepareMap.bind(this);
        });
      });

    }
  }

  prepareModal() {
    const { center, radius, content } = this.state;
    let contents = [];

    if (center) {
      contents = contents.concat([
        (<InfoWindow key="info" position={center} content={content} />),
        (<Circle key="circle" center={center} radius={radius} options={{
          fillColor: `red`,
          fillOpacity: 0.20,
          strokeColor: `red`,
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
        />),
        ]);
    }

    return (
        <Col lg={12} md={12} sm={12} className="photo-detail-section">

          <Col lg={12} md={12} sm={12} className="photo-details-photo">
            <a href="" className="closeModal" onClick={this.closeModal.bind(this)}>
              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
            <Grid fluid className="summary-info">
              <Col xs={10}>
                Likes: {this.state.data.likes}
              </Col>
              <Col className="weather-data" xs={2}>
                {this.state.data.weather.description} <br/>
                {Math.floor(this.state.data.weather.temp)} °F
              </Col>
            </Grid>
            <img src={this.state.data.url} />
          </Col>
          <GoogleMapLoader
              containerElement={
                <div
                  className="photo-detail-map"
                />
              }

              googleMapElement={
                <GoogleMap
                  defaultZoom={12}
                  center={center}
                  markers={[{
                    position:center,
                    key:'Carouge',
                    defaultAnimation:2,
                  }]}>
                  {contents}
                </GoogleMap>
              }
            />
        </Col>
    );
  }

  prepareMap() {
    const tick = () => {
      this.setState({radius : Math.max(this.state.radius - 20, 0) });

      if (this.state.radius > 200) {
        raf(tick);
      }
    };
    raf(tick);
  }

  closeModal(e) {
    e.preventDefault();
    var self = this;
    $("#photo-details-modal, .modal-backdrop").fadeOut(500, () => {
      //self.props.closeModal();
    });
    //this.setState({open : false});
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
      modal = <div id="photo-details-modal">
            {this.prepareModal()}
          </div>;
    }

    return (
      <div>
        <div className="modal-backdrop"></div>
        {modal}
      </div>
    );
  };
}

export default PhotoDetails;
