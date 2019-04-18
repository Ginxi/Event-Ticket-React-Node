import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import NoRecords from './NoRecords';
import ResultPage from './ResultPage';

var storage = null;
var hasstorage = false;
var favlist = null;
export default class Table extends Component {

  constructor(props) {
    super(props);
    var newList = null;
    if (window.localStorage) {
      storage = window.localStorage;
      hasstorage = true;
      favlist = JSON.parse(storage.getItem("favlist"));
      if (!this.props.isFav) {
        newList = this.props.reslist;
        if (favlist !== null && favlist.length > 0) {
          for (var i = 0; i < favlist.length; i++) {
            newList.forEach((item) => { item.id === favlist[i].id ? item.isFav = true : void (0) });
          }
        }
      } else {
        newList = favlist;
      }
    }
    this.state = {
      currentID: "",
      currentItem: "",
      reslist: newList,
      hasRecords: !(newList === null),
      showDetail: false
    };
  }

  removeItem(id) {
    return favlist.filter(function (item) {
      if (item.id == id) {
        return false;
      }
      return true;
    });
  }

  addFavorite(index) {
    if (hasstorage) {
      var newList = this.state.reslist;
      if (newList[index].isFav === true) {
        newList[index].isFav = false;
        if (favlist !== null) {
          var temp = this.removeItem(newList[index].id);
          if (temp.length > 0) {
            favlist = temp;
          } else {
            favlist = null;
          }
        }
      } else {
        newList[index].isFav = true;
        if (favlist === null) {
          favlist = [newList[index]];
        } else {
          favlist.push(newList[index]);
        }
      }

      this.setState({
        reslist: newList
      });
      storage.setItem("favlist", JSON.stringify(favlist));
    }
  }

  addFavoriteFromDetail(index, res) {
    if (hasstorage) {
      if (res.isFav) {
        favlist[index].isFav = false;
        if (favlist !== null) {
          var temp = this.removeItem(favlist[index].id);
          if (temp.length > 0) {
            favlist = temp;
          } else {
            favlist = null;
          }
        }
      } else {
        res.isFav = true;
        if (favlist === null) {
          favlist = [res];
        } else {
          favlist.push(res);
        }
      }

      this.setState({
        reslist: favlist,
        hasRecords: !(favlist === null)
      });
      storage.setItem("favlist", JSON.stringify(favlist));
    }
  }

  deleteFavorite(index) {
    if (hasstorage) {
      var newList = this.state.reslist;
      if (favlist !== null) {
        var temp = this.removeItem(newList[index].id);
        if (temp.length > 0) {
          favlist = temp;
        } else {
          favlist = null;
        }
      }
      storage.setItem("favlist", JSON.stringify(favlist));
      this.setState({
        reslist: favlist,
        hasRecords: !(favlist === null)
      });
    }
  }

  onDetailClick() {
    this.setState({ showDetail: true });
  }

  showTable() {
    this.setState({ showDetail: false });
  }

  onRowClicked(id) {
    if (id !== "") {
      const curid = 'r' + id;
      const curitem = this.state.reslist[id];
      if (this.state.currentID !== "") {
        this.refs[this.state.currentID].className = "";
      }
      this.setState({ currentID: curid, currentItem: curitem });
      this.refs[curid].className = "table-warning";
    }
  }

  render() {
    return (
      <div>
        <div hidden={this.state.showDetail}>
          {
            this.state.hasRecords ?
              <div>
                <div style={{ textAlign: "right", marginBottom: "20px" }}>
                  <button type="button" className="btn btn-light border col-1" disabled={this.state.currentID === ""} onClick={() => {
                    this.onDetailClick()
                  }}>Details <i className="material-icons" style={{ verticalAlign: "middle" }}>
                      keyboard_arrow_right
                </i></button>
                </div>
                <table className="table table-hover border-top border-bottom">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Date</th>
                      <th scope="col">Event</th>
                      <th scope="col">Category</th>
                      <th scope="col">Venue Info</th>
                      <th scope="col">Favorite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.reslist.map((item, index) => {
                      return (<tr key={'r' + index} ref={'r' + index} onClick={(e) => {
                        this.onRowClicked(index)
                      }}>
                        <th scope="row" id={'r' + index}>{index + 1}</th>
                        <td id={'r' + index}>{item.date}</td>
                        <td id={'r' + index}><OverlayTrigger placement="bottom" overlay={<Tooltip id={'t' + index}>{item.name}</Tooltip>}><a href="#" onClick={() => { this.onDetailClick() }}>{item.trim}</a></OverlayTrigger></td>
                        <td id={'r' + index}>{item.category}</td>
                        <td id={'r' + index}>{item.venue}</td>
                        <td id={'r' + index}>
                          {this.props.isFav
                            ?
                            <button type="button" className="btn btn-light border" onClick={(e) => {
                              this.deleteFavorite(index)
                            }}><i className="material-icons" style={{ verticalAlign: "middle" }}>
                                delete
                              </i></button>
                            : <button type="button" className="btn btn-light border" onClick={(e) => {
                              this.addFavorite(index)
                            }}><i className="material-icons" style={item.isFav ? { verticalAlign: "middle", color: "yellow" } : { verticalAlign: "middle" }}>
                                {item.isFav ? "star" : "star_border"}
                              </i></button>}
                        </td>
                      </tr>)
                    })}
                  </tbody>
                </table>
              </div>
              : <NoRecords />}
        </div>
        <div>
          {
            this.state.showDetail ? <ResultPage showDetail={this.showTable.bind(this)} res={this.state.currentItem} isFav={this.props.isFav}  addFavFromRes={this.addFavorite.bind(this)} addFavFromFav={this.addFavoriteFromDetail.bind(this)} index={this.state.currentID}/> : null
          }
        </div>
      </div>
    );
  }
}
