import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import Autocomplete from  'react-autocomplete';

const keywordBaseUrl="https://app.ticketmaster.com/discovery/v2/suggest?apikey=cQppy0BL2X6IKe0BoORnc8PVCEiulcA9&keyword=";
var form = {
    keyword:"",
    category:"all",
    distance:10,
    distype:"miles",
    isCurloc:true,
    position:"",
};
export default class Form extends Component { 

  constructor() {
    super();
        this.state = {
        keyword:"",
        category:"all",
        distance:10,
        distype:"miles",
        isCurloc:true,
        position:"",
        keywordValid: false,
        keywordClass: "form-control",
        keywordErr: true,
        positionValid: true,
        positionClass: "form-control",
        positionErr: true,
        autoKey:[]
    };
  }  
  getInput(keyword){
    this.setState({keyword:keyword});
    form.keyword=keyword;
  }

  handleInputOnBlur() {
      if(this.state.keyword===""){
          this.setState({
            keywordValid:false,
            keywordClass: "form-control is-invalid",
            keywordErr: false
          });
      }
  }

  handleInputChange(event) {
    this.setState({keyword: event.target.value});
    form.keyword=event.target.value;
    if (event.target.value.match(/^\s*$/)) {
        this.setState({keywordValid:false,
            keywordClass: "form-control is-invalid",
            keywordErr: false,
            autoKey:[]
        });
    } else {
        const url = keywordBaseUrl + event.target.value;
        var component = this;
        fetch(url).then(function(response){
            if (response.ok){
           response.json().then(function (result) { 
             try{
                 var curKey = [];
                 for(var attraction in result._embedded.attractions){
                     curKey.push({abbr:attraction,name:result._embedded.attractions[attraction].name});
                 }
                 component.setState({
                     autoKey:curKey
                 });
                 // console.log(this.state);
             } catch(e) {
                 //deal error
                 console.log(e); 
             }
 
            })
            } else {
                // deal error
            }
         }
        //  , function(error) {
        //      // deal error
        //    }
           ).catch((e)=>{
               // deal error
           });

        this.setState({keywordValid:true,
            keywordClass: "form-control",
            keywordErr: true
        });
    }
  }

  handleCategoryChange(event) {
    this.setState({category: event.target.value});
    form.category=event.target.value;
  }

  handleDistanceChange(event) {
    if(event.target.value===""){
        this.setState({distance: 10});
        form.distance=10;
    } else {
        this.setState({distance: event.target.value});
        form.distance=event.target.value;
    }
  }

  handleDistypeChange(event) {
    this.setState({distype: event.target.value});
    form.distype=event.target.value;
  }

  onRadioChange() {
    if (!this.state.isCurloc) {
        this.setState({position:"",
        positionValid: true,
        positionClass: "form-control",
        positionErr: true
    });
    form.position="";
    } else {
        if(this.state.position===""){
            this.setState({positionValid:false});
        }
    }
    this.setState({isCurloc: !this.state.isCurloc});
    form.isCurloc=!form.isCurloc;
  }

  onPositionChange(event) {
    this.setState({position: event.target.value});
    form.position=event.target.value;
    if (event.target.value.match(/^\s*$/)) {
        this.setState({positionValid:false,
            positionClass: "form-control is-invalid",
            positionErr: false
        });
    } else {
        this.setState({positionValid:true,
            positionClass: "form-control",
            positionErr: true
        });
    }
  }
  handlePositionOnBlur() {
    if(this.state.position===""){
        this.setState({positionValid:false,
            positionClass: "form-control is-invalid",
            positionErr: false
        });
    }
  }

  submitForm() {
    this.props.form(form);
  }

  clearForm() {
      this.setState({
        keyword:"",
        category:"",
        distance:10,
        distype:"miles",
        isCurloc:true,
        position:"",
        keywordValid: false,
        keywordClass: "form-control",
        keywordErr: true,
        positionValid: true,
        positionClass: "form-control",
        positionErr: true,
      });
      form={
        keyword:"",
        category:"all",
        distance:10,
        distype:"miles",
        isCurloc:true,
        position:"",
    };
      this.props.form(null);
  }

  render() {
    return (
      <div className="card" style={{marginTop:"20px"}}>
      <div className="card-header">
      <div style={{textAlign:"center"}}>
      <h2 width="100%">Entertainment Event Ticket Search</h2>
      </div>
      <div className="row">
      <form className="form-horizontal" style={{margin:"auto auto"}}>
        <div className="form-group row">
        <div className="col-3">
            <label htmlFor="keyword">Keyword <font color='red'>*</font></label>
            </div>
            <div className="col-6">
            <Autocomplete
            value={ this.state.keyword }
            inputProps={{ name: "keyword",
            type: "text",
                 className: this.state.keywordClass,
                 placeholder: "Enter Artist, Team or Event Name (eg. Lakers)",
                 value: this.state.keyword,
                 onBlur: this.handleInputOnBlur.bind(this)
                 }}
            wrapperStyle={{ position: 'relative', display: 'inline-block', width:'100%' }}
            items={ this.state.autoKey }
            getItemValue={ item => item.name }
            // onChange={(event, value) => this.setState({ value }) }
            onChange={(e) => {
                this.handleInputChange(e)
            }}
            onSelect={ value => {this.setState({keyword: value,
                keywordValid:true,
            keywordClass: "form-control",
            keywordErr: true
             }); form.keyword=value;} }
            renderMenu={ children => (
              <div className = "menu">
                { children }
              </div>
            )}
            renderItem={ (item, isHighlighted) => (
              <div
                className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                key={ item.abbr } >
                { item.name }
              </div>
            )}
          />
               </div>
            <div style={{color:"red"}}  hidden={this.state.keywordErr} className="col-6 offset-3">Please enter a keyword.</div>
        </div>
        <div className="form-group row">
            <div className="col-3">
                <label htmlFor="category">Category</label>
            </div>
            <div className="col-3">
                <select 
                    name="category"
                    className='form-control' 
                    value={this.state.category}
                    onChange={(e) => {
                        this.handleCategoryChange(e)
                    }} >
                    <option value="">All</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts & Theatre">Arts & Theatre</option>
                    <option value="Film">Film</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </div>
        </div>
        <div className="form-group row">
            <div className="col-3">
            <label htmlFor="distance">Distance</label>
            </div>
            <div className="col-3">
                <input
                    type="number"
                    className="form-control"
                    value={this.state.distance}
                    onChange={(e) => {
                        this.handleDistanceChange(e)
                    }}
                />
            </div>
            <div className="col-3">
                <select 
                    className='form-control' 
                    value={this.state.distype}
                    onChange={(e) => {
                        this.handleDistypeChange(e)
                    }} >
                    <option value="miles">Miles</option>
                    <option value="km">Kilometers</option>
                 </select>
            </div>
        </div>
        <div className="form-group row">
            <div className="col-3">
            <label htmlFor="from">From <font color='red'>*</font></label>
            </div>
            <div className="col-6">
            <div className="radio">
            <label>
                <input type="radio" name="curloc" value="curloc" checked={this.state.isCurloc === true} onChange={() => {
                        this.onRadioChange()
                    }} />Current location</label>
                    </div>
                    <div className="radio">
                    <label>
                <input type="radio" name="other" value="other" checked={this.state.isCurloc === false} onChange={() => {
                        this.onRadioChange()
                    }}/>Other. Please specify:</label>
            </div>
        </div>
        </div>
            <div className="form-group row">
            <div className="col-6 offset-3">
            <input
                type="text"
                className={this.state.positionClass}
                value={this.state.position}
                onChange={(e) => {
                    this.onPositionChange(e)
                }}
                onBlur = {this.handlePositionOnBlur.bind(this)}
                disabled={this.state.isCurloc}
            />
            <div style={{color:"red"}}  hidden={this.state.positionErr}>Please enter a location.</div>
            </div>
            </div>
    
        <div className="form-group row">
            <div className="col-2">
                <button type="button" className="btn btn-primary border" disabled={!(this.state.keywordValid&&this.state.positionValid)} onClick={() => {
                    this.submitForm()
                }}><i className="material-icons" style={{verticalAlign: "middle"}}>
                search
                </i> Search</button>
            </div>
            <div className="col-2 offset-1">
                <button type="reset" className="btn btn-light border" onClick={() => {
                    this.clearForm()
                }}><i className="material-icons" style={{verticalAlign: "middle"}}>
                clear_all
                </i> Clear</button>
            </div>
        </div>
        </form>
        </div>
        </div>
        </div>
    );
  }
}

Form.propTypes = {
    form: PropTypes.func
}