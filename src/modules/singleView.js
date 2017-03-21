"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';

const SingleView = React.createClass({
  propTypes: {

  },

  getMonth: function(month) {
    //console.log('func month: ',month)
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[month];
  },

  back: function() {
    let dispatchObj = {
      actionType: 'navigate-back'
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setTicker: function(e) {
    let dispatchObj = {
      actionType: 'day-set-ticker',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setStockPrice: function(e) {
    let dispatchObj = {
      actionType: 'day-set-stock-price',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setPositionSize: function(e) {
    let dispatchObj = {
      actionType: 'day-set-position-size',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setBrokerFee: function(e) {
    let dispatchObj = {
      actionType: 'day-set-broker-fee',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setBoughtSold: function(e) {
    let dispatchObj = {
      actionType: 'day-set-bought-sold',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setLongShort: function(e) {
    let dispatchObj = {
      actionType: 'day-set-long-short',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setWinLoss: function(e) {
    let dispatchObj = {
      actionType: 'day-set-win-loss',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  setNotes: function(e) {
    let dispatchObj = {
      actionType: 'day-set-notes',
      data:e.currentTarget.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  handleSetDayData: function(e){
    e.preventDefault();
    let dispatchObj = {
      actionType: 'submit-day-data'
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  render: function (){
    //console.log('single view',this.props.props);
    //error stuff:
    let tickError = this.props.props.tickerErrorMessage ? 'No spaces, letters only please' : '';
    let stockPriceError = this.props.props.stockPriceErrorMessage ? 'No spaces. Numbers and decimal point only with number first (i.e. 0.91)' : '';
    let stockSharesError = this.props.props.stockSharesErrorMessage ? 'No spaces, numbers only please (i.e. 500)' : '';
    let brokerFeeError = this.props.props.brokerFeeErrorMessage ? 'No spaces. Numbers and decimal point only please (i.e. 1.00 or 1)' : '';
    let fieldError = this.props.props.fieldErrorMessage ? <div className="field-error">Please fill in required fields</div> : '';
    let fieldErrorSpot = this.props.props.fieldErrorMessage ? 'field-error-spot' : '';
    let fieldErrorSpotSpan = this.props.props.fieldErrorMessage ? 'sold-right field-error-spot' : 'sold-right';

    let day = this.props.props.dateInfo.dayInMonth;
    let month = this.getMonth(this.props.props.dateInfo.monthInYear);
    //console.log('month: ',month)
    //console.log('day: ',day)
    let year = this.props.props.dateInfo.year;
    let dayEntry;
    let cantSetWinLoss = this.props.props.cantSetWinLoss;
    let inactiveActive = this.props.props.cantSetWinLoss ? 'inactive' : 'active';
    let formSuccess = this.props.props.formSubmitSuccess ? <div className="success-message">Success</div> : '';
    //console.log(this.props.props.singleDayFormTicker)
    let sharesError = this.props.props.sellingMoreSharesThanOwnedError ? <div className="error-shares">You entered more shares than you own. You currently have {this.props.props.lookup[this.props.props.singleDayFormTicker].shares} shares</div> : '';
    //console.log('1: ',this.props.props.all[year] != undefined)
    //console.log('2: ',this.props.props.all[year] != undefined && this.props.props.all[year][month] != undefined)
    //console.log('3: ',this.props.props.all[year] != undefined && this.props.props.all[year][month] != undefined && this.props.props.all[year][month][day] != undefined)
    //TODO: need flag to flip to false and check against or once there is an entry this will render with every step of filling out the form on the same day
    if(this.props.props.all[year] != undefined && this.props.props.all[year][month] != undefined && this.props.props.all[year][month][day] != undefined){
      //console.log('yes yes: ',this.props.props.all[year][month][day])
      dayEntry = this.props.props.all[year][month][day].map(function (entry, i){
        //console.log('entry: ',entry);
        let boughtOrSold = entry.singleDayFormBought === 'bought' ? 'Bought' : 'Sold';
        let longOrShort = entry.singleDayFormLong === 'long' ? 'Long' : 'Short';
        let winOrLoss = '';
        let separator = '';
        if(entry.singleDayFormWin != null){
            winOrLoss = entry.singleDayFormWin === "win" ? <span className="title-info"> Win</span> : <span className="title-info"> Loss</span>;
            separator = '|';
        }
        return(
          <div key={i} className="history-single-day">
            <span className="title">Ticker</span>
            <span className="title-info"> {entry.singleDayFormTicker}</span>|
            <span className="title"> Price</span>
            <span className="title-info"> {entry.singleDayFormStockPrice}</span>|
            <span className="title"> Shares</span>
            <span className="title-info"> {entry.singleDayFormPositionSize}</span>|
            <span className="title-info"> {boughtOrSold}</span>|
            <span className="title-info"> {longOrShort}</span>|
            {winOrLoss}{separator}
            <span className="title"> Note:</span>
            <span className="title-info"> {entry.singleDayFormNotes}</span>
          </div>
        );
      });
    }

    return(
      <div className="single-day-view">
        <div className="back-to-main" onClick={this.back}><i className="octicon octicon-calendar"></i>Back To Full Calendar</div>
        <div className="single-view-date"><span>{month}</span> <span>{day},</span> <span>{year}</span></div>
        <form id="singleDayAside" className="single-day-aside" action="" onSubmit={this.handleSetDayData}>
          <div className="day-info ticker">
            <span>Ticker</span>
            <input className={fieldErrorSpot} type="text" placeholder="enter ticker" value={this.props.props.singleDayFormTicker} onChange={this.setTicker}/>
            <div className="tick-error">{tickError}</div>
          </div>
          <div className="day-info price">
            <span>Stock Price</span>
            <input className={fieldErrorSpot} type="text" placeholder="enter stock price" value={this.props.props.singleDayFormStockPrice} onChange={this.setStockPrice}/>
            <div className="stock-price-error">{stockPriceError}</div>
          </div>
          <div className="day-info shares">
            <span>Shares</span>
            <input className={fieldErrorSpot} type="text" placeholder="position size" value={this.props.props.singleDayFormPositionSize} onChange={this.setPositionSize}/>
            <div className="position-size-error">{stockSharesError}</div>
          </div>
          <div className="day-info fee">
            <span>Broker Fee</span>
            <input type="text" placeholder="$0" value={this.props.props.singleDayFormBrokerFee} onChange={this.setBrokerFee}/>
            <div className="broker-fee-error">{brokerFeeError}</div>
          </div>
          <div className="day-info bought-sold">
            <div className="radio-inputs">
              <label className="radio">
                <input type="radio" name="boughtSold" value="bought" onChange={this.setBoughtSold}/>
                <span className={fieldErrorSpot}>Bought</span>
              </label>
              <label className="radio">
                <input type="radio" name="boughtSold" value="sold" onChange={this.setBoughtSold}/>
                <span className={fieldErrorSpotSpan}>Sold</span>
              </label>
            </div>
            <div className="radio-inputs">
              <label className="radio">
                <input type="radio" name="longShort" value="long" onChange={this.setLongShort}/>
                <span className={fieldErrorSpot}>Long</span>
              </label>
              <label className="radio">
                <input type="radio" name="longShort" value="short" onChange={this.setLongShort}/>
                <span className={fieldErrorSpotSpan}>Short</span>
              </label>
            </div>
            <div className="radio-inputs">
              <label className="radio">
                <input type="radio" name="winLoss" value="win" onChange={this.setWinLoss} disabled={cantSetWinLoss}/>
                <span className={inactiveActive}>Win</span>
              </label>
              <label className="radio">
                <input type="radio" name="winLoss" value="loss" onChange={this.setWinLoss} disabled={cantSetWinLoss}/>
                <span className={inactiveActive}>Loss</span>
              </label>
            </div>
          </div>
          <div className="day-info notes-section">
            <div>Notes</div>
            <textarea name="notes" className="notes" cols="80" rows="7" onChange={this.setNotes}></textarea>
          </div>
          <button>Submit</button>
          {formSuccess}
          {sharesError}
          {fieldError}
        </form>
        <div className="single-day-aside two">
          <h3 className="history">History</h3>
          {dayEntry}
        </div>
      </div>
    )
  }
});

export default SingleView;
