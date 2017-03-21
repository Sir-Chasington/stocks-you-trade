"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';

const SingleView = React.createClass({
  propTypes: {

  },

  updatePortfolioAmount: function() {

    let dispatchObj = {
      actionType: 'update-portfolio-amount',
      data:true
    };
    mainStoreDispatcher.dispatch(dispatchObj);

  },

  updateWin: function() {
    let dispatchObj = {
      actionType: 'update-win-amount',
      data:true
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  updateLoss: function() {
    let dispatchObj = {
      actionType: 'update-loss-amount',
      data:true
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  updatePercent: function() {
    let dispatchObj = {
      actionType: 'update-percent-amount',
      data:true
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  handlePortUpdating: function(event) {

    let dispatchObj ={
      actionType: 'key-up-port-change',
      data: event.target.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);

  },

  handlePortUpdateSubmit: function(event) {
    event.preventDefault();
    let dispatchObj ={
      actionType: 'submit-port-change',
      data: this.props.props.portfolioChangeBalance
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  handleWinUpdating: function(event) {

    let dispatchObj ={
      actionType: 'key-up-win-change',
      data: event.target.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);

  },

  handleWinUpdateSubmit: function(event) {
    event.preventDefault();
    let dispatchObj ={
      actionType: 'submit-win-change',
      data: this.props.props.winChangeBalance
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  handleLossUpdating: function(event) {

    let dispatchObj ={
      actionType: 'key-up-loss-change',
      data: event.target.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);

  },

  handleLossUpdateSubmit: function(event) {
    event.preventDefault();
    let dispatchObj ={
      actionType: 'submit-loss-change',
      data: this.props.props.loseChangeBalance
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  handlePercentUpdating: function(event) {

    let dispatchObj ={
      actionType: 'key-up-percent-change',
      data: event.target.value
    };
    mainStoreDispatcher.dispatch(dispatchObj);

  },

  handlePercentSubmit: function(event) {
    event.preventDefault();
    let dispatchObj ={
      actionType: 'submit-percent-change',
      data: this.props.props.percentChangeBalance
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  render: function (){
    //console.log(this.props.props.portfolioBalance)
    let currency = '$';
    let percentUp = this.props.props.percentUp ? 'percent-info up' : 'percent-info down';
    let percentInputUp = this.props.props.percentUp ? 'up' : 'down';
    let portValue;
    let percentValue;
    if(this.props.props.portfolioBalance != null){
      let value = this.props.props.portfolioBalance;
      portValue = JSON.parse(value).toFixed(2);
    }
    if(this.props.props.percentChange != null){
      let pvalue = this.props.props.percentChange;
      percentValue = JSON.parse(pvalue).toFixed(2);
    }

    let portfolioInfo = this.props.props.showPortInput ? <div className="balance"><span>{currency}</span><form action="" onSubmit={this.handlePortUpdateSubmit}><input type="text" placeholder={portValue} onChange={this.handlePortUpdating} autoFocus={true}/></form></div> : <div className="balance" onClick={this.updatePortfolioAmount}><span>{currency}</span>{portValue}</div>;
    let portUpdateError = this.props.props.letPortUpdate ? '' : <div className="error-port-update">Numbers and decimal point only.</div>;

    let percentChangeInfo = this.props.props.showPercentInput ? <form className="gain-loss-form" action="" onSubmit={this.handlePercentSubmit}><input className={percentInputUp} type="text" placeholder={percentValue} onChange={this.handlePercentUpdating} autoFocus={true} /></form> : <div className="gain-loss" onClick={this.updatePercent}>{percentValue}</div>;

    let winInfo = this.props.props.showWinInput ? <div className="win-form"><span>wins:</span> <form action="" onSubmit={this.handleWinUpdateSubmit}><input type="text" value={this.props.props.winChangeBalance} placeholder={this.props.props.wins} onChange={this.handleWinUpdating} autoFocus={true} /></form></div> : <div className="win" onClick={this.updateWin}>wins: {this.props.props.wins}</div>;
    let loseInfo = this.props.props.showLoseInput ? <div className="lose-form"><span>losses:</span> <form action="" onSubmit={this.handleLossUpdateSubmit}><input type="text" value={this.props.props.loseChangeBalance} placeholder={this.props.props.losses} onChange={this.handleLossUpdating} autoFocus={true} /></form></div> : <div className="lose" onClick={this.updateLoss}>losses: {this.props.props.losses}</div>;

    return(
      <div className="account-info">
        <div className="portfolio">
          <i className="flaticon-three-stacks-of-coins"></i>
          {portfolioInfo}
        </div>
        {portUpdateError}
        <div className={percentUp}>
          <i className="flaticon-percent-symbol"></i>
          {percentChangeInfo}
        </div>
        <div className="win-info">
          {winInfo}
        </div>
        <div className="lose-info">
          {loseInfo}
        </div>
      </div>
    )
  }
});

export default SingleView;
