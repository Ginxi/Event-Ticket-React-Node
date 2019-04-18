import React, { Component } from 'react';
import Progress from './Progress';
import Error from './Error';
import NoRecords from './NoRecords';
import Table from './Table';

const tkbaseUrl = "https://app.ticketmaster.com/discovery/v2/events.json?sort=date,asc&";
const tkkey = "&apikey=cQppy0BL2X6IKe0BoORnc8PVCEiulcA9";
const gokey = "&key=AIzaSyCxyzKWkJrLjsFtOfU4oRntze4V8G9Djl4";
const gobaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

export default class ResList extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      currentID: "",
      reslist: [],
      hasError: null,
      hasRecords: null,
    });
  }

  componentWillMount() {
    this.getResList();

  }

  componentWillReceiveProps() {
    this.setState({
      currentID: "",
      reslist: [],
      hasError: null,
      hasRecords: null
    });
    this.getResList();
  }

  handleError() {
    this.setState({
      hasRecords: false,
      hasError: true
    });
  }

  getResList() {
    console.log("get list");
    var component = this;
    if (this.props.form.isCurloc) {
      const currentPosUrl = "https://ipapi.co/json";
      fetch(currentPosUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (result) {
            try {
              const latlon = result.latitude + "," + result.longitude;
              var url = "";
              if (component.props.form.category === "all") {
                url = tkbaseUrl + "keyword=" + component.props.form.keyword + "&radius=" + component.props.form.distance + "&unit=" + component.props.form.distype + "&latlong=" + latlon + tkkey;
              } else {
                url = tkbaseUrl + "keyword=" + component.props.form.keyword + "&classificationName=" + component.props.form.category + "&radius=" + component.props.form.distance + "&unit=" + component.props.form.distype + "&latlong=" + latlon + tkkey;
              }
              fetch(url).then(function (response) {
                if (response.ok) {
                  response.json().then(function (resultlist) {
                    try {
                      var mylist = [];
                      if (!("_embedded" in resultlist)) {
                        component.setState({
                          hasRecords: false,
                          hasError: false
                        });
                      } else {
                        for (var event in resultlist._embedded.events) {
                          var myid = resultlist._embedded.events[event].id;
                          var mydate = resultlist._embedded.events[event].dates.start.localDate;
                          var myname = resultlist._embedded.events[event].name;
                          var myhref = resultlist._embedded.events[event].url;
                          var mycategory = resultlist._embedded.events[event].classifications[0].genre.name + "-" + resultlist._embedded.events[event].classifications[0].segment.name;
                          var myvenue = resultlist._embedded.events[event]._embedded.venues[0].name;
                          var mytrimname = myname;
                          if (mytrimname.length > 35) {
                            mytrimname = mytrimname.substring(0, 36);
                            mytrimname = mytrimname.substring(0, mytrimname.lastIndexOf(" ")) + " ...";
                          }
                          var artistsList = resultlist._embedded.events[event]._embedded.attractions;
                          var myartists = "";
                          if (artistsList.length > 0) {
                            for (var i = 0; i < artistsList.length; i++) {
                              myartists += artistsList[i].name + " | "
                            }
                            myartists = myartists.slice(0, -3);
                          }
                          var formatDate = new Date(mydate);
                          var strDate = formatDate.toDateString().slice(4);
                          strDate = strDate.slice(0, 6) + ',' + strDate.slice(6, 11);
                          var mytime = strDate + ' ' + resultlist._embedded.events[event].dates.start.localTime;
                          var mytype = mycategory.split('-')[1] + " | " + mycategory.split('-')[0];
                          var myprice = null;
                          try {
                            myprice = '$' + resultlist._embedded.events[event].priceRanges[0].min + " ~ " + '$' + resultlist._embedded.events[event].priceRanges[0].max;
                          } catch (e) {

                          }
                          var myticket = resultlist._embedded.events[event].dates.status.code;
                          var myseat=null;
                          try {
                            myseat = resultlist._embedded.events[event].seatmap.staticUrl;
                          } catch(e) {
                            
                          }
                          var myaddress = resultlist._embedded.events[event]._embedded.venues[0].address.line1;
                          var mycity = resultlist._embedded.events[event]._embedded.venues[0].city.name + ", " + resultlist._embedded.events[event]._embedded.venues[0].state.name;
                          var myphone = null;
                          var myhours = null;
                          var mygrule = null;
                          var mycrule = null;
                          try {
                            myphone = resultlist._embedded.events[event]._embedded.venues[0].boxOfficeInfo.phoneNumberDetail;
                            myhours = resultlist._embedded.events[event]._embedded.venues[0].boxOfficeInfo.openHoursDetail;
                            mygrule = resultlist._embedded.events[event]._embedded.venues[0].generalInfo.generalRule;
                            mycrule = resultlist._embedded.events[event]._embedded.venues[0].generalInfo.childRule;
                          } catch (e) {

                          }
                          var mycenter = {lat:parseFloat(resultlist._embedded.events[event]._embedded.venues[0].location.latitude), lng:parseFloat(resultlist._embedded.events[event]._embedded.venues[0].location.longitude)};
                          mylist.push({ id: myid, date: mydate, name: myname, href: myhref, category: mycategory, venue: myvenue, trim: mytrimname, isFav: false, artists: myartists, time: mytime, type: mytype, price: myprice, ticket: myticket, seat: myseat, address: myaddress, city: mycity, phone: myphone, open: myhours, grule: mygrule, crule: mycrule, center: mycenter });
                        }
                        component.setState({
                          reslist: mylist,
                          hasRecords: true,
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
            } catch (e) {
              //deal error
              component.handleError();
              console.log(e);
            }

          })
        } else {
          // deal error
          component.handleError();
          console.log("fuck");
        }
      }
      ).catch((e) => {
        // deal error
        component.handleError();
        console.log(e);
      });
    } else {
      const posUrl = gobaseUrl + "address=" + this.props.form.position + gokey;
      fetch(posUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (result) {
            try {
              const latlon = result.results[0].geometry.location.lat + "," + result.results[0].geometry.location.lng;
              var url = "";
              if (component.props.form.category === "all") {
                url = tkbaseUrl + "keyword=" + component.props.form.keyword + "&radius=" + component.props.form.distance + "&unit=" + component.props.form.distype + "&latlong=" + latlon + tkkey;
              } else {
                url = tkbaseUrl + "keyword=" + component.props.form.keyword + "&classificationName=" + component.props.form.category + "&radius=" + component.props.form.distance + "&unit=" + component.props.form.distype + "&latlong=" + latlon + tkkey;
              }
              fetch(url).then(function (response) {
                if (response.ok) {
                  response.json().then(function (resultlist) {
                    try {
                      var mylist = [];
                      if (!("_embedded" in resultlist)) {
                        component.setState({
                          hasRecords: false,
                          hasError: false
                        });
                      } else {
                        for (var event in resultlist._embedded.events) {
                          var myid = resultlist._embedded.events[event].id;
                          var mydate = resultlist._embedded.events[event].dates.start.localDate;
                          var myname = resultlist._embedded.events[event].name;
                          var myhref = resultlist._embedded.events[event].url;
                          var mycategory = resultlist._embedded.events[event].classifications[0].genre.name + "-" + resultlist._embedded.events[event].classifications[0].segment.name;
                          var myvenue = resultlist._embedded.events[event]._embedded.venues[0].name;
                          var mytrimname = myname;
                          if (mytrimname.length > 35) {
                            mytrimname = mytrimname.substring(0, 36);
                            mytrimname = mytrimname.substring(0, mytrimname.lastIndexOf(" ")) + " ...";
                          }
                          var artistsList = resultlist._embedded.events[event]._embedded.attractions;
                          var myartists = "";
                          if (artistsList.length > 0) {
                            for (var i = 0; i < artistsList.length; i++) {
                              myartists += artistsList[i].name + " | "
                            }
                            myartists = myartists.slice(0, -3);
                          }
                          var formatDate = new Date(mydate);
                          var strDate = formatDate.toDateString().slice(4);
                          strDate = strDate.slice(0, 6) + ',' + strDate.slice(6, 11);
                          var mytime = strDate + ' ' + resultlist._embedded.events[event].dates.start.localTime;
                          var mytype = mycategory.split('-')[1] + " | " + mycategory.split('-')[0];
                          var myprice = null;
                          try {
                            myprice = '$' + resultlist._embedded.events[event].priceRanges[0].min + " ~ " + '$' + resultlist._embedded.events[event].priceRanges[0].max;
                          } catch (e) {

                          }
                          var myticket = resultlist._embedded.events[event].dates.status.code;
                          var myseat=null;
                          try {
                            myseat = resultlist._embedded.events[event].seatmap.staticUrl;
                          } catch(e) {

                          }
                          var myaddress = resultlist._embedded.events[event]._embedded.venues[0].address.line1;
                          var mycity = resultlist._embedded.events[event]._embedded.venues[0].city.name + ", " + resultlist._embedded.events[event]._embedded.venues[0].state.name;
                          var myphone = null;
                          var myhours = null;
                          var mygrule = null;
                          var mycrule = null;
                          try {
                            myphone = resultlist._embedded.events[event]._embedded.venues[0].boxOfficeInfo.phoneNumberDetail;
                            myhours = resultlist._embedded.events[event]._embedded.venues[0].boxOfficeInfo.openHoursDetail;
                            mygrule = resultlist._embedded.events[event]._embedded.venues[0].generalInfo.generalRule;
                            mycrule = resultlist._embedded.events[event]._embedded.venues[0].generalInfo.childRule;
                          } catch (e) {

                          }
                          var mycenter = { lat: parseFloat(resultlist._embedded.events[event]._embedded.venues[0].location.latitude), lng: parseFloat(resultlist._embedded.events[event]._embedded.venues[0].location.longitude) };
                          mylist.push({ id: myid, date: mydate, name: myname, href: myhref, category: mycategory, venue: myvenue, trim: mytrimname, isFav: false, artists: myartists, time: mytime, type: mytype, price: myprice, ticket: myticket, seat: myseat, address: myaddress, city: mycity, phone: myphone, open: myhours, grule: mygrule, crule: mycrule, center: mycenter });
                        }
                        component.setState({
                          reslist: mylist,
                          hasRecords: true,
                          hasError: false
                        });
                      }

                      //  console.log(component.state);
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
    }
  }

  addFavorite() {

  }

  onDetailClick() {

  }

  onRowClicked(event) {
    // console.log(event.target.id);
    if (this.state.currentID !== "") {
      this.refs[this.state.currentID].className = "";
    }
    this.setState({ currentID: event.target.id });
    this.refs[event.target.id].className = "table-warning";
  }

  render() {
    return (
      <div>
        <div hidden={!(this.state.hasRecords === null && this.state.hasError === null)}>
          <Progress />
        </div>
        <div hidden={!(this.state.hasError === true && this.state.hasRecords !== null)}>
          <Error />
        </div>
        <div hidden={!(this.state.hasRecords === false && this.state.hasError === false)}>
          <NoRecords />
        </div>
        <div>
          {(this.state.hasRecords && !this.state.hasError)
            ? <Table reslist={this.state.reslist} isFav={false} />
            : null
          }

        </div>
      </div>
    );
  }
}
