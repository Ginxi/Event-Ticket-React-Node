import React, { Component } from 'react';
import NoRecords from './NoRecords';
import Progress from './Progress';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class Artist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasRecords: null,
        };
    }

    componentWillMount() {
        if (this.props.artistlist.length > 0 || this.props.imglist.length > 0) {
            this.setState({ hasRecords: true });
        } else {
            this.setState({ hasRecords: false });
        }
    }

    componentWillReceiveProps() {
        if (this.props.artistlist.length > 0 || this.props.imglist.length > 0) {
            this.setState({ hasRecords: true });
        } else {
            this.setState({ hasRecords: false });
        }
    }

    render() {
        return (
            <div style={{ marginTop: "20px" }}>
                <div hidden={!(this.state.hasRecords === null)}>
                    <Progress />
                </div>
                <div hidden={!(this.state.hasRecords === false)}>
                    <NoRecords />
                </div>
                <div>
                    {this.state.hasRecords
                        ?
                        this.props.artistlist.map((item, index) => {
                            return (<div key ={"div"+index}>
                            {
                                this.props.imglist[index].name !== null
                                ?
                                <div style={{marginTop:"50px"}}>
                                <h4 align="center">{this.props.imglist[index].name}</h4>
                                </div>
                                :
                                null
                            }
                                {
                                    item.name !== null ?
                                        <table className="table table-striped">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Name</th>
                                                    <td>{item.name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Follwers</th>
                                                    <td>{item.follwers}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Popularity</th>
                                                    <td>
                                                        <div style={{ width: "40px" }}>
                                                            <CircularProgressbar
                                                                percentage={item.popularity}
                                                                text={`${item.popularity}%`}
                                                                initialAnimation={true}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Check At</th>
                                                    <td><a href={item.check} target="_blank">Spotify</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        :
                                        null}
                             {
                                 this.props.imglist[index].img !== null 
                                 ?
                                 <div>
                                    <ul className="clearfix">
                                        {
                                            this.props.imglist[index].img.map((item, index) => {
                                                return (<li key={"k" + index} className="imgli"><a href={item} target="_blank"><img className="liimg" src={item} onError={() => { this.parentNode.parentNode.removeChild(this.parentNode) }} /></a></li>)
                                            })
                                        }
                                    </ul>
                                </div>
                                :
                                null
                                }
                            </div>)
                        })
                        : null}
                </div>
            </div>
        );
    }
}
