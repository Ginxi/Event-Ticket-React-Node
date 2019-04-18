import React, { Component } from 'react';

export default class NoRecords extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="alert alert-warning" role="alert">
        No records.
      </div>
    );
  }
}

