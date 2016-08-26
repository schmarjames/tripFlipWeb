import React from 'react';
import { Link } from 'react-router';
import { ButtonToolbar, Button } from 'react-bootstrap';

class PhotoData extends React.Component {
  constructor() {
    super();
    this.state ={
      buttons: undefined
    };
  }

  componentDidMount() {
    if (this.props.rowData) {
      this.prepareForm();
    }
  }

  prepareForm() {
    if (this.props.rowData.type == "accepts") {
      this.setState({
        buttons: <div>
          <Button className="approve" data-photo-id={this.props.rowData.id} data-index={this.props.rowData.index}>Approve</Button>
          <Button className="reject" data-photo-id={this.props.rowData.id} data-index={this.props.rowData.index}>Reject</Button>
        </div>
      });
    } else {
      this.setState({
        buttons: <div>
            <Button className="approve" data-photo-id={this.props.rowData.id} data-index={this.props.rowData.index}>Approve</Button>
            <Button className="remove" data-photo-id={this.props.rowData.id} data-index={this.props.rowData.index}>Remove</Button>
          </div>
      });
    }
  }

  render() {
    return (
      <ButtonToolbar>
        {this.state.buttons}
      </ButtonToolbar>
    );
  };
}

export default PhotoData;
