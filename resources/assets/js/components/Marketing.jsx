import React from 'react';
import Slider from 'react-slick/lib';
import { default as Video, Controls, Play, Mute, Seek, Fullscreen, Time, Overlay } from 'react-html5video';

class Marketing extends React.Component {
  constructor() {
    super();

    this.state = {

    };

    this.slideContent = [
      "Explore beautiful travel photography across the globe.",
      "Save favorites to your personal photo album.",
      "Get directions to your favorite photos destination."
    ];
  }

  render() {
    const content = this.slideContent.map((text) => {
      return (
        <div>
          <p>{text}</p>
        </div>
      );
    });

    const settings = {
      autoplay: true,
      autoplaySpeed: 4000,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      arrows: false
    };

    return (
      <div>
        <div className="overlay"></div>
        <Slider {...settings}>
          {content}
        </Slider>
      </div>
    );
  };
}

export default Marketing;
