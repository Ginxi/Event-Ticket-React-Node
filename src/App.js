import React, { Component } from 'react';
import './App.css';
import Form from './components/Form';
import ResList from './components/ResList';
import Table from './components/Table';


class App extends Component {

  constructor() {
    super();
    this.state = ({
      form: null,
      isResultList: true,
      resListBtnClass: "btn btn-primary",
      favListBtnClass: "btn btn-light",
      // isFormComplete:false
      formDiv: null
    });
  }

  getFormRes(form) {
    if (form === null) {
      this.setState({
        // isFormComplete:false,
        form: null,
        formDiv: null
      });
    } else {
      this.setState({
        // isFormComplete:true,
        form: form,
        formDiv: <ResList form={form} />
      });
    }
  }

  onBtnGroupClick(event) {
    if (event.target.name === "res") {
      this.setState({
        isResultList: true,
        resListBtnClass: "btn btn-primary",
        favListBtnClass: "btn btn-light"
      })
    } else {
      this.setState({
        isResultList: false,
        resListBtnClass: "btn btn-light",
        favListBtnClass: "btn btn-primary"
      })
    }
  }

  render() {
    return (
      <div className="container">
        <Form form={this.getFormRes.bind(this)} />
        <div className="result-btn-group col-3">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" name="res" className={this.state.resListBtnClass} onClick={(e) => { this.onBtnGroupClick(e) }}>Results</button>
            <button type="button" name="fav" className={this.state.favListBtnClass} onClick={(e) => { this.onBtnGroupClick(e) }}>Favorites</button>
          </div>
        </div>
        <div hidden={!this.state.isResultList}>
          {/* {this.state.formDiv} */}
          {this.state.isResultList ?
            this.state.formDiv : null}
        </div>
        <div>
          {!this.state.isResultList
            // ? <Favorite />
            ? <Table isFav={true} />
            : null
          }
        </div>
        {/* <ResultPage/> */}
      </div>
    );
  }
}

export default App;
