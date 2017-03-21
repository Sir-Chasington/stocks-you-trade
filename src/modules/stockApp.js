"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';
import Ticker from './ticker';
import Calendar from './calendar';
import SingleView from './singleView';
import AccountInfo from './accountInfo';
import ShowHistory from './showHistory';

let update = false;

const StockApp = React.createClass({
  propTypes: {

  },
  getInitialState: function(){
    return MainStore.getData();
    //return {test: 'this is a test'};
  },
  componentDidMount: function(){
    MainStore.addChangeListener(this._onChange);
    var _this = this;
    MainStore.getUpdatedData()
      .then(function(data){
        _this.setState(data);
      });
  },
  componentWillUnmount: function() {
    MainStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(MainStore.getData());
  },
  componentDidUpdate:function () {
    if(!update){
      update = true;
      let dispatchObj = {
        actionType: 'load-screen',
        data:true
      };
      mainStoreDispatcher.dispatch(dispatchObj);
    }
  },
  render: function (){
    //console.log('state:',this.state.showHistory)
    let showSingleDayView = this.state.showSpecificDay ? <SingleView props={this.state} /> : <Calendar props={this.state} />;
    if(!this.state.appLoaded){
      return(
        <div id="appLoadScreen">
          <h1>Stocks You Trade</h1>
          <div className="app-icons">
            <i className="flaticon-stock-earnings"></i>
            <i className="flaticon-bull-head"></i>
          </div>
        </div>
      )
    }else if(this.state.showHistory){
      return(
        <div className="container">
          <AccountInfo props={this.state} />
          <Ticker props={this.state} />
          <ShowHistory props={this.state} />
          <div className="user-name">user: {this.state.userName}</div>
        </div>
      )
    }else{
      return(
        <div className="container">
          <AccountInfo props={this.state} />
          <Ticker props={this.state} />
          {showSingleDayView}
          <div className="user-name">user: {this.state.userName}</div>
        </div>
      )
    }
  }
});


//TODO:
  //history view
  //if a user changes port value after entering some sells and it calculated some stuff already

export default StockApp;
