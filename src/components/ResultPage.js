import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import Event from './Event';
import Venue from './Venue';
import Upcoming from './Upcoming';
import twitter from '../twitter.png';
import Artist from './Artist';

const apikey = "apikey=vBVcSxkjMtYAL4I7";
const venuebaseurl = "https://api.songkick.com/api/3.0/search/venues.json?query=";
const eventsbaseurl = "https://api.songkick.com/api/3.0/venues/";
const artisturl = "https://csci571-1544652199919.appspot.com";
const googlebaseurlp1 = "https://www.googleapis.com/customsearch/v1?q=";
const googlebaseurlp2 = "&cx=012637974253628533786:7_j_xs_zzpw&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyBU7iH76q2dOp-CgLlQ0zcrPyeF4W2HwKk";
var myartists = [];
var artistlist = [];
var imglist = [];

export default class ResultPage extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      showRes: <Event res={this.props.res} />,
      activeKey: 1,
      upcomingEvents: [],
      hasError: null,
      hasRecords: null,
      artistlist: [],
      imagelist: []
    });
    myartists = [];
    artistlist = [];
    imglist = [];
    myartists = this.props.res.artists.split('|');
  }

  handleError() {
    this.setState({
      hasRecords: false,
      hasError: true
    });
  }

  componentWillMount() {
    var venueurl = venuebaseurl + this.props.res.venue + '&' + apikey;
    var component = this;
    fetch(venueurl).then(function (response) {
      if (response.ok) {
        response.json().then(function (resultlist) {
          try {
            console.log("get upcoming events");
            if (resultlist.resultsPage.totalEntries > 0) {
              var venueID = resultlist.resultsPage.results.venue[0].id;
              var eventurl = eventsbaseurl + venueID + "/calendar.json?" + apikey;
              fetch(eventurl).then(function (response) {
                if (response.ok) {
                  response.json().then(function (resultlist) {
                    try {
                      // console.log(resultlist.resultsPage.results);
                      if (resultlist.resultsPage.totalEntries > 0) {
                        var mylist = [];
                        for (var res in resultlist.resultsPage.results.event) {
                          var myname = resultlist.resultsPage.results.event[res].displayName;
                          var myuri = resultlist.resultsPage.results.event[res].uri;
                          var myartist = resultlist.resultsPage.results.event[res].performance[0].artist.displayName;
                          var mydate = resultlist.resultsPage.results.event[res].start.date;
                          var formatDate = new Date(mydate);
                          var strDate = formatDate.toDateString().slice(4);
                          strDate = strDate.slice(0, 6) + ',' + strDate.slice(6, 11);
                          var mytime = strDate;
                          if (resultlist.resultsPage.results.event[res].start.time !== null) {
                            mytime += ' ' + resultlist.resultsPage.results.event[res].start.time;
                          }
                          var mytype = resultlist.resultsPage.results.event[res].type;
                          mylist.push({ name: myname, uri: myuri, artist: myartist, time: mytime, type: mytype });
                        }
                        component.setState({
                          hasRecords: true,
                          upcomingEvents: mylist,
                          hasError: false
                        });
                      } else {
                        component.setState({
                          hasRecords: false,
                          hasError: false
                        });
                      }
                    } catch (e) {
                      //deal error
                      console.log(e);
                      component.handleError();
                    }

                  })
                } else {
                  // deal error
                  console.log("fuck");
                  component.handleError();
                }
              }
                //  , function(error) {
                //      // deal error
                //    }
              ).catch((e) => {
                // deal error
                console.log(e);
                component.handleError();
              });
            } else {
              component.setState({
                hasRecords: false,
                hasError: false
              });
            }
          } catch (e) {
            //deal error
            console.log(e);
            component.handleError();
          }

        })
      } else {
        // deal error
        console.log("fuck");
        component.handleError();
      }
    }
      //  , function(error) {
      //      // deal error
      //    }
    ).catch((e) => {
      // deal error
      console.log(e);
      component.handleError();
    });

    myartists.forEach((item) => {
      if (item.slice(-1) === ' ') {
        this.getArtist(item.slice(0, -1));
      } else {
        this.getArtist(item);
      }
    })
  }

  getArtist(artist) {
    var component = this;
    fetch(artisturl, {
      body: JSON.stringify({name:artist}),
      headers: {'Content-Type':'application/json'},
      method: 'POST',
      mode: 'cors',
    }).then(function (response) {
      if (response.ok) {
        response.json().then(function (resultlist) {
          try {
            if (resultlist.artists.total > 0) {
              const myname = resultlist.artists.items[0].name;
              const myfollwersnum = resultlist.artists.items[0].followers.total;
              var myfollwers = myfollwersnum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              const mypopularity = resultlist.artists.items[0].popularity;
              const mycheck = resultlist.artists.items[0].external_urls.spotify;
              artistlist.push({ name: myname, follwers: myfollwers, popularity: mypopularity, check: mycheck });
              component.setState({
                artistlist: artistlist
              });
            } else {
              artistlist.push({ name: null, follwers: null, popularity: null, check: null });
              component.setState({
                artistlist: artistlist
              });
            }
          } catch (e) {
            //deal error
            console.log(e);
            artistlist.push({ name: null, follwers: null, popularity: null, check: null });
            component.setState({
              artistlist: artistlist
            });
          }

        })
      } else {
        // deal error
        console.log("fuck");
        artistlist.push({ name: null, follwers: null, popularity: null, check: null });
        component.setState({
          artistlist: artistlist
        });
      }
    }
      //  , function(error) {
      //      // deal error
      //    }
    ).catch((e) => {
      // deal error
      console.log(e);
      artistlist.push({ name: null, follwers: null, popularity: null, check: null });
      component.setState({
        artistlist: artistlist
      });
    });

    var imgurl = googlebaseurlp1 + artist + googlebaseurlp2;
    fetch(imgurl).then(function (response) {
      if (response.ok) {
        response.json().then(function (resultlist) {
          try {
            if (resultlist.searchInformation.totalResults > 0) {
              var myimglist = [];
              resultlist.items.forEach(element => {
                myimglist.push(element.link);
              });
              imglist.push({ name: artist, img: myimglist });
              component.setState({
                imagelist: imglist
              })
            } else {
              imglist.push({ name: artist, img: null });
              component.setState({
                imagelist: imglist
              })
            }
          } catch (e) {
            //deal error
            console.log(e);
            imglist.push({ name: artist, img: null });
            component.setState({
              imagelist: imglist
            })
          }

        })
      } else {
        // deal error
        console.log("fuck");
        imglist.push({ name: artist, img: null });
        component.setState({
          imagelist: imglist
        })
      }
    }
      //  , function(error) {
      //      // deal error
      //    }
    ).catch((e) => {
      // deal error
      console.log(e);
      imglist.push({ name: artist, img: null });
      component.setState({
        imagelist: imglist
      })
    });
  }

  handleSelect(key) {
    switch (key) {
      case 1:
        this.setState({
          activeKey: 1,
          showRes: <Event res={this.props.res} />
        })
        break;
      case 2:
        this.setState({
          activeKey: 2,
          showRes: <Artist artistlist={this.state.artistlist} imglist={this.state.imagelist} />
        })
        break;
      case 3:
        this.setState({
          activeKey: 3,
          showRes: <Venue res={this.props.res} />
        })
        break;
      case 4:
        this.setState({
          activeKey: 4,
          showRes: <Upcoming hasRecords={this.state.hasRecords} hasError={this.state.hasError} upcomingEvents={this.state.upcomingEvents} />
        })
        break;
    }
  }

  onBackClick() {
    this.props.showDetail();
  }

  onFavClick() {
    if (this.props.isFav) {
      this.props.addFavFromFav(parseInt(this.props.index.slice(1)), this.props.res);
    } else {
      this.props.addFavFromRes(parseInt(this.props.index.slice(1)));
    }
  }

  render() {
    return (
      <div className="container">
        <div >
          <h2 style={{ textAlign: "center" }}>{this.props.res.name}</h2>
        </div>
        <div>

          <button type="button" className="btn btn-light border col-1" onClick={() => {
            this.onBackClick()
          }}><i className="material-icons" style={{ verticalAlign: "middle" }}>
              keyboard_arrow_left
                </i> List</button>
          <img src={twitter} alt="twitter" height="50dp" width="60dp" className="btn btn-xs img-rounded offset-9" onClick={() => {
            this.onBackClick()
          }} />
          <button type="button" className="btn btn-light border" onClick={() => {
            this.onFavClick()
          }}><i className="material-icons" style={this.props.res.isFav ? { verticalAlign: "middle", color: "yellow" } : { verticalAlign: "middle" }}>
              {this.props.res.isFav ? "star" : "star_border"}
            </i></button>
        </div>
        <div className="row col-12">
          <Nav
            bsStyle="tabs"
            style={{ width: "100%", }}
            className="nav justify-content-end"
            activeKey={this.state.activeKey}
            onSelect={key => this.handleSelect(key)}
          >
            <NavItem eventKey={1}>
              Event
          </NavItem>
            <NavItem eventKey={2}>
              Artists/Teams
          </NavItem>
            <NavItem eventKey={3}>
              Venue
          </NavItem>
            <NavItem eventKey={4}>
              Upcoming Events
          </NavItem>
          </Nav>
        </div>
        {this.state.showRes}
      </div>
    );
  }
}
