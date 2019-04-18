import React, { Component } from 'react';

export default class Event extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th scope="row">Artist/Team(s)</th>
              <td>{this.props.res.artists}</td>
            </tr>
            <tr>
              <th scope="row">Venue</th>
              <td>{this.props.res.venue}</td>
            </tr>
            <tr>
              <th scope="row">Time</th>
              <td>{this.props.res.time}</td>
            </tr>
            <tr>
              <th scope="row">Category</th>
              <td>{this.props.res.type}</td>
            </tr>
            {
              this.props.res.price === null
                ?
                null
                :
                <tr>
                  <th scope="row">Price Range</th>
                  <td>{this.props.res.price}</td>
                </tr>

            }
            <tr>
              <th scope="row">Ticket Status</th>
              <td>{this.props.res.ticket}</td>
            </tr>
            <tr>
              <th scope="row">Buy Ticket At</th>
              <td><a href={this.props.res.href} target="_blank">Ticketmaster</a></td>
            </tr>
            {
              this.props.res.seat === null
                ?
                null :
                <tr>
                  <th scope="row">Seat Map</th>
                  <td><a href="#myModal" data-toggle="modal">View Seat Map Here</a></td>
                </tr>}
          </tbody>
        </table>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog" style={{ width: "300px" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" style={{ textAlign: "left" }}>View Seat Map</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                <a href={this.props.res.seat} target="_blank">
                  <img src={this.props.res.seat} height="200px" width="200px" />
                </a>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
