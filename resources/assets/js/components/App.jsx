import React from 'react';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Navigation from './Nav.jsx';
import $ from 'jquery';

@connectToStores
class App extends React.Component {
  constructor() {
    super();
    Actions.getUserData();

    this.player;
  }

  componentDidMount() {
    var self = this;

    this.readyYoutube();

    $(window).scroll(function() {
       var hT = $('.m-video').height(),
           wS = $(this).scrollTop();
       if (wS > hT) {
          this.player.pauseVideo();
       }
       else {
          this.player.playVideo();
       }
    });

    $(window).on('resize', function() {
        self.resizeVideo();
    });
  }

  readyYoutube() {
    if((typeof YT !== "undefined") && YT && YT.Player) {
      this.player = new YT.Player('player', {
          playerVars: {
              'autoplay': 1,
              'controls': 0,
              'autohide': 1,
              'wmode': 'opaque',
              'showinfo': 0,
              'loop': 1,
              'mute': 1,
              //'start': 15,
              //'end': 110,
              'playlist': 'aRzJFOVDARg'
          },
          videoId: 'aRzJFOVDARg',
          events: {
              'onReady': this.onPlayerReady
          }
      });

      $("#player").css({
        width: "100%",
        height: "100%"
      });
      this.resizeVideo();


    }else{
      setTimeout(this.readyYoutube(), 100);
    }
}

callStack(e) {

  e.preventDefault();

  var countLater = setTimeout(function() {
          var counter = 0;

          counter++;
          if (counter == 3) {

          }
      }, 5000);
}

  resizeVideo() {
    if ($(document).find("#player").length > 0) {
      // Same code as on load
      var aspectRatio = 1.78;
      var video = $('#player');
      var videoHeight = video.outerHeight();
      var newWidth = videoHeight*aspectRatio;
      var halfNewWidth = newWidth/2;

      video.css({"width":newWidth+"px","left":"50%","margin-left":"-"+halfNewWidth+"px"});
    }
  }

  setMainBackground() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'];
    var displayMode = "none";

      if (unRestrictedPaths.indexOf(pathName) > -1) {
        displayMode = "block";
        if (this.player) {
            this.player.playVideo();
        }
      } else {
        displayMode = "none";
        if (this.player) {
            this.player.pauseVideo();
        }
      }

    return displayMode;
  }

  setNavSyles() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'];
    return (unRestrictedPaths.indexOf(pathName) > -1) ? 'marketing' : 'in-app';
  }

  onPlayerReady(event) {
    event.target.mute();
    $('#text').fadeIn(400);
    //why this? Well, if you want to overlay text on top of your video, you
    //will have to fade it in once your video has loaded in order for this
    //to work in Safari, or your will get an origin error.
}

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    var displayMode = this.setMainBackground();
    var navProps = {
      styles : this.setNavSyles()
    };

    if (this.props.user) {
      navProps = {
        user : this.props.user,
        discoveryCategoryFilterList : this.props.discoveryCategoryFilterList,
        location : this.props.location,
        searchOptions : this.props.searchOptions,
        galleryFilterList : this.props.galleryFilterList,
        styles : this.setNavSyles()
      };
    }
    return (
      <div className="mainWrap" style={{background: '#ffffff'}}>
        <div id="player" style={{display : displayMode}}></div>
        <Navigation {...navProps}/>
        {this.props.children}
      </div>
    );
  }
}

export default App;
