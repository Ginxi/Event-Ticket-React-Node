import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

export default class Venue extends Component {

  constructor(props) {
    super(props);
  }

  renderMarkers(map, maps) {
    let marker = new maps.Marker({
      position: this.props.res.center,
      map,
      title: 'Hello World!'
    });
  }

  render() {
    return (
      <div>
        <h4 style={{ textAlign: "center" }}>{this.props.res.venue}</h4>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th scope="row" className="th">Address</th>
              <td>{this.props.res.address}</td>
            </tr>
            <tr>
              <th scope="row" className="th">City</th>
              <td>{this.props.res.city}</td>
            </tr>
            {this.props.res.phone === null
              ?
              null
              :
              <tr>
                <th scope="row" className="th">Phone Number</th>
                <td>{this.props.res.phone}</td>
              </tr>}
            {this.props.res.open === null
              ?
              null
              :
              <tr>
                <th scope="row" className="th">Open Hours</th>
                <td>{this.props.res.open}</td>
              </tr>}
            {this.props.res.grule === null
              ?
              null
              :
              <tr>
                <th scope="row" className="th">General Rules</th>
                <td>{this.props.res.grule}</td>
              </tr>
            }
            {this.props.res.crule === null
              ?
              null
              :
              <tr>
                <th scope="row" className="th">Child Rule</th>
                <td>{this.props.res.crule}</td>
              </tr>
            }
          </tbody>
        </table>
        <div id="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyCxyzKWkJrLjsFtOfU4oRntze4V8G9Djl4"}}
          defaultCenter={this.props.res.center}
          defaultZoom={11}
          onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
        >
        </GoogleMapReact>
        </div>
      </div>
    );
  }
}
