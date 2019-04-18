import React, { Component } from 'react';

export default class Error extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="alert alert-danger" role="alert">
        Failed to get search results.
      </div>
    );
  }
}

