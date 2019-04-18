import React, { Component } from 'react';
import NoRecords from './NoRecords';
import Error from './Error';
import Progress from './Progress';

export default class Upcoming extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            rankType: "default",
            ordering: "asc",
            isDefault: true,
            isShowMore: true,
            showButton: "Show More",
            upcomingEvents: this.props.upcomingEvents,
            shortEvents: this.props.upcomingEvents.slice(0,5),
            hasError: this.props.hasError,
            hasRecords: this.props.hasRecords
        })
    }

    // componentWillReceiveProps() {
    //     this.setState({
    //         upcomingEvents: this.props.upcomingEvents,
    //         shortEvents: this.props.upcomingEvents.slice(0,5),
    //         hasError: this.props.hasError,
    //         hasRecords: this.props.hasRecords
    //     });
    // }

    handleRankTypeChange(event) {
        this.setState({
            rankType: event.target.value,
            isDefault: event.target.value === "default"
        }, () => {
            this.sort();
        });
        
    }

    handleOrderChange(event) {
        this.setState({ ordering: event.target.value }, () => {
            this.sort();
        });
    }

    sort() {
        var events = this.props.upcomingEvents.concat();
        switch(this.state.rankType) {
            case "default" : {
                this.setState({
                    upcomingEvents: events,
                    shortEvents: events.slice(0,5)
                });
                break;
            }
            case "name" : {
                if (this.state.ordering==="asc"){
                    events.sort((a,b)=>{return a.name.localeCompare(b.name)});
                } else {
                    events.sort((a,b)=>{return b.name.localeCompare(a.name)});
                }
                this.setState({
                    upcomingEvents: events,
                    shortEvents: events.slice(0,5)
                });
                break;
            }
            case "time" : {
                if (this.state.ordering==="asc"){
                    events.sort((a,b)=>{return new Date(a.time)-(new Date(b.time))});
                } else {
                    events.sort((a,b)=>{return new Date(b.time)-(new Date(a.time))});
                }
                this.setState({
                    upcomingEvents: events,
                    shortEvents: events.slice(0,5)
                });
                break;
            }
            case "artist" : {
                if (this.state.ordering==="asc"){
                    events.sort((a,b)=>{return a.artist.localeCompare(b.artist)});
                } else {
                    events.sort((a,b)=>{return b.artist.localeCompare(a.artist)});
                }
                this.setState({
                    upcomingEvents: events,
                    shortEvents: events.slice(0,5)
                });
                break;
            }
            case "type" : {
                if (this.state.ordering==="asc"){
                    events.sort((a,b)=>{return a.type.localeCompare(b.type)});
                } else {
                    events.sort((a,b)=>{return b.type.localeCompare(a.type)});
                }
                this.setState({
                    upcomingEvents: events,
                    shortEvents: events.slice(0,5)
                });
                break;
            }
        }
    }

    onShowChange() {
        if (this.state.isShowMore) {
            this.setState({
                showButton: "Show Less",
                isShowMore: false
            });
        } else {
            this.setState({
                showButton: "Show More",
                isShowMore: true
            });
        }
    }

    render() {
        return (
            <div style={{ marginTop: "20px" }}>
                <div hidden={!(this.state.hasRecords === null && this.state.hasError === null)}>
                    <Progress />
                </div>
                <div hidden={!(this.state.hasError === true && this.state.hasRecords !== null)}>
                    <Error />
                </div>
                <div hidden={!(this.state.hasRecords === false && this.state.hasError === false)}>
                    <NoRecords />
                </div>
                {(this.state.hasRecords && !this.state.hasError) ? <div>
                    <div className="row">
                        <div className="col-3">
                            <select
                                className='form-control'
                                value={this.state.rankType}
                                onChange={(e) => {
                                    this.handleRankTypeChange(e)
                                }} >
                                <option value="default">Default</option>
                                <option value="name">Event Name</option>
                                <option value="time">Time</option>
                                <option value="artist">Artist</option>
                                <option value="type">Type</option>
                            </select>
                        </div>
                        <div className="col-3">
                            <select
                                className='form-control'
                                value={this.state.ordering}
                                disabled={this.state.isDefault}
                                onChange={(e) => {
                                    this.handleOrderChange(e)
                                }} >
                                <option value="asc">Ascending</option>
                                <option value="des">Descending</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: "20px"}}>
                        {
                            this.state.isShowMore
                            ?
                            this.state.shortEvents.map((item, index) => {
                                return (
                                    <div className="card" key={'r' + index} style={{ marginBottom: "10px" }}>
                                        <div className="card-body" style={{ marginLeft: "10px" }}>
                                            <div className="row">
                                                <a href={item.uri} target="_blank">{item.name}</a>
                                            </div>
                                            <div className="row">
                                                <p style={{color:"orange"}}>Artist: {item.artist}</p>
                                                <p style={{color:"grey"}}>&nbsp;{item.time}</p>
                                            </div>
                                            <div className="row">
                                                <p>Type: {item.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            this.state.upcomingEvents.map((item, index) => {
                                return (
                                    <div className="card" key={'r' + index} style={{ marginBottom: "10px" }}>
                                        <div className="card-body" style={{ marginLeft: "10px" }}>
                                            <div className="row">
                                                <a href={item.uri} target="_blank">{item.name}</a>
                                            </div>
                                            <div className="row">
                                                <p style={{color:"orange"}}>Artist: {item.artist}</p>
                                                <p style={{color:"grey"}}>&nbsp;{item.time}</p>
                                            </div>
                                            <div className="row">
                                                <p>Type: {item.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    }
                    </div>
                    <div style={{ textAlign: "center" }}>
                        {
                            this.state.upcomingEvents.length > 5
                                ?
                                <button className="btn btn-primary" onClick={() => {
                                    this.onShowChange()
                                }}>{this.state.showButton}</button>
                                :
                                null
                        }
                    </div>
                </div> : null}
            </div>
        );
    }
}
