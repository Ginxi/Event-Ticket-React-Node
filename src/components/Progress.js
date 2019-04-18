import React, { Component } from 'react';

export default class Progress extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <div className="progress">
  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width: "50%"}}></div>
    </div>
    );
  }
}

