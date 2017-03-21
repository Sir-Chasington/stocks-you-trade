"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';
import GetGainsOrLoss from '../utils/getGainsOrLoss';

let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ShowHistory = React.createClass({
  propTypes: {

  },

  back: function() {
    let dispatchObj = {
      actionType: 'navigate-back'
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  render: function (){
    let _this = this;
    let ticker = this.props.props.tickerForHistory;
    let fullInfo = this.props.props.lookup[ticker].history.map(function (entry, i){
      //let newDate = new Date(entry.date);
      let year = entry.date.year;
      let month = entry.date.monthInYear;
      month = months[month];
      let day = entry.date.dayInMonth;
      return(
        <div key={i} className="history-all">
          <span className="title">Date </span>
          <span className="title-info">{month} {day}, {year} </span>|
          <span className="title-info"> {entry.boughtSold} </span>|
          <span className="title-info"> {entry.longShort} </span>|
          <span className="title"> Stock Price</span>
          <span className="title-info"> ${entry.price} </span>|
          <span className="title"> Shares</span>
          <span className="title-info"> {entry.shares} </span>|
          <span className="title"> Position Cost</span>
          <span className="title-info"> ${entry.totalCost} </span>|
          <span className="title"> Broker Fee</span>
          <span className="title-info"> ${entry.brokerFee} </span>|
          <span className="title"> Note </span>
          <span className="title-info"> {entry.note}</span>
        </div>
      );

    });

    if(this.props.props.lookup[ticker]){
      let history = this.props.props.lookup[ticker].history;
      let tickerAvgLong = this.props.props.lookup[ticker].avgLong != null ? JSON.parse(this.props.props.lookup[ticker].avgLong).toFixed(2) : 0;
      let tickerAvgShort = this.props.props.lookup[ticker].avgShort != null ? JSON.parse(this.props.props.lookup[ticker].avgShort).toFixed(2) : 0;
      let tickerOutstandingSharesLong = this.props.props.lookup[ticker].sharesLong || 0;
      let tickerOutstandingSharesShort = this.props.props.lookup[ticker].sharesShort || 0;
      let getGainsOrLoss = GetGainsOrLoss(history);
      let gainLossValue = getGainsOrLoss === 0 ? 'No current gains or loss' : '$' + getGainsOrLoss.toFixed(2);
      return(
        <div id="showHistoryContainer">
          <div className="back-to-main" onClick={this.back}><i className="octicon octicon-calendar"></i>Back To Full Calendar</div>
          <div className="split-left">
            <h2>{ticker}</h2>
            <div className="ticker-avg-long"><span>Current Avg Long: </span><span className="left-value">${tickerAvgLong}</span></div>
            <div className="ticker-avg-short"><span>Current Avg Short: </span><span className="left-value">${tickerAvgShort}</span></div>
            <div className="ticker-shares-long"><span>Current Shares Long: </span><span className="left-value">{tickerOutstandingSharesLong}</span></div>
            <div className="ticker-shares-short"><span>Current Shares Short: </span><span className="left-value">{tickerOutstandingSharesShort}</span></div>
            <div className="gains-loss"><span>Current Gains or Loss: </span><span className="left-value">{gainLossValue}</span></div>
          </div>
          <div className="split-right">{fullInfo}</div>
        </div>
      )
    }else{
      return(
        <div id="showHistoryContainer">
          <div className="back-to-main" onClick={this.back}><i className="octicon octicon-calendar"></i>Back To Full Calendar</div>
          <h2 className="no-history">Sorry, you currently don't have any history for<span> {ticker}</span></h2>
        </div>
      )
    }
  }
});

export default ShowHistory;
