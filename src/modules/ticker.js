"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';

const TickerSymbol = React.createClass({
  propTypes: {

  },

  enterTicker: function (event){
    var dispatchObj = {
      actionType: 'enter-ticker',
      data: event.target.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  getTickerDataSubmit: function (event){
    event.preventDefault();
    var dispatchObj = {
      actionType: 'get-ticker-data',
      data:this.props.props.ticker
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  render: function (){
    //console.log('this props: ',this.props);
    return(
      <div className="ticker-section">
        <form action="" id="getTickerHistory" onSubmit={this.getTickerDataSubmit}>
          <input type="text" placeholder="Enter Ticker" onChange={this.enterTicker} />
        </form>
        <div className="ticker-display">${this.props.props.tickerPrice}</div>
        <div className="ticker-error">There was an error. Please refresh</div>
      </div>
    )
  }
});

export default TickerSymbol;
