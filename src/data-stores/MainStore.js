"use strict";

let mainStoreDispatcher = require('./../utils/MainStoreDispatcher');
let assign = require('object-assign');
let EventEmitter = require('events').EventEmitter;
import CalculatePercentChange from './CalculatePercentChange';
import GetBrokerTotal from './GetBrokerTotal';

let CHANGE_EVENT = 'change';

let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];


let stockDataObject = {
  all:null,
  appLoaded:true,  //TODO: Change back to false before production
  brokerFeeErrorMessage:false,
  cantSetWinLoss: true,
  dateInfo:null,
  fieldErrorMessage:false,
  formSubmitSuccess:false,
  letPortUpdate:true,
  lookup:{},
  loseChangeBalance:'',
  losses:null,
  originalPortfolioValue:null,
  percentChange:null,
  percentChangeBalance:'',
  percentUp:null,
  portfolioBalance:null,
  portfolioChangeBalance:'',
  sellingMoreSharesThanOwnedError:false,
  showHistory:false,
  showPortInput:false,
  showSpecificDay:false,
  showPercentInput:false,
  showWinInput:false,
  showLoseInput:false,
  singleDayFormTicker:null,
  singleDayFormStockPrice:null,
  singleDayFormPositionSize:null,
  singleDayFormBought:null,
  singleDayFormBrokerFee:null,
  singleDayFormLong:null,
  singleDayFormWin:null,
  singleDayFormNotes:null,
  stockPriceErrorMessage:false,
  stockSharesError:false,
  ticker:'',
  tickerErrorMessage:false,
  tickerForHistory:null,
  tickerPrice:'',
  userName:null,
  wins:null,
  winChangeBalance:''
};

let stockData = assign({}, EventEmitter.prototype, {
  getData: function() {
    return stockDataObject;
  },

  getUpdatedData: function(){
    let url = '../../testJSON/test.json';
    let user = 'connor';
    return jQuery.ajax({
      url: url,
      type:"GET",
      dataType: 'json'
    })
    .done(function(data){

      let newStockData = {
        all:data.users[user].all,
        lookup:data.users[user].lookup,
        losses:data.users[user].losses,
        originalPortfolioValue:data.users[user].originalPortfolioValue,
        percentChange:data.users[user].percentChange,
        percentUp:data.users[user].percentUp,
        portfolioBalance:data.users[user].portfolioBalance,
        showSpecificDay:data.users[user].showSpecificDay,
        userName:data.users[user].userName,
        wins:data.users[user].wins
      };
      assign(stockDataObject,newStockData);
      //stockData.emitChange();
      return newStockData;
    })
    .fail(function(){
      //TODO add error handling
    });
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

mainStoreDispatcher.register(function(payload) {

  switch (payload.actionType) {

    case 'load-screen':
      setTimeout(function(){
        let loadScreenUpdate = {
          appLoaded:payload.data
        };
        assign(stockDataObject,loadScreenUpdate);
        stockData.emitChange();
      },4000);
      break;

    case 'enter-ticker':
      let storeTicker = {
        ticker:payload.data
      };
      assign(stockDataObject,storeTicker);
      stockData.emitChange();
      break;
    case 'get-ticker-data':
      let tickerSymbol = {
        tickerForHistory:payload.data.toUpperCase(),
        showHistory:true,
        showSpecificDay:false

      };
      document.getElementById('getTickerHistory').reset();
      //Neet to do this call in node -- bleh
      // let tickerUrl = 'https://get-ticker.herokuapp.com/api/getTicker';
      // //let tickerUrl = 'http://marketdata.websol.barchart.com/getQuote.json?key=6e6d31fe8cb4b243c5a8e25182b0591f&symbols=' + tickerSymbol;
      // jQuery.ajax({
      //   url: tickerUrl,
      //   type:'GET',
      //   data:tickerSymbol
      // })
      // .done(function(data){
      //   //console.log('data: ',JSON.parse(data));
      //   let parsedData = JSON.parse(data);
      //   let tickerValue = {
      //     tickerPrice:parsedData.results[0].lastPrice
      //   }
      //   assign(stockDataObject,tickerValue);
      //   stockData.emitChange();
      //   $('.ticker-error').hide();
      // })
      // .fail(function(error){
      //   console.log('error: ',error);
      //   $('.ticker-error').show();
      // });
      assign(stockDataObject,tickerSymbol);
      stockData.emitChange();
      break;
    case 'date-info':
      let dateInfoUpdate = {
        dateInfo:payload.data,
        showSpecificDay:true
      };
      assign(stockDataObject,dateInfoUpdate);
      stockData.emitChange();
      break;

    case 'update-portfolio-amount':
      let updatePortAmount = {
        showPortInput:true,
        showWinInput:false,
        showLoseInput:false,
        showPercentInput:false
      };
      assign(stockDataObject,updatePortAmount);
      stockData.emitChange();
      break;
    case 'key-up-port-change':
      //var str = payload.data;
      //var pattern = /^[a-zA-Z0-9\-_.!@#$%^&*()=+ ]+$/;
      //var keyUpobj;
      let str = payload.data;
      let pattern = /^[0-9\. ]+$/;
      let updatePortBalance;
      if(pattern.test(str) || payload.data === ''){
        updatePortBalance = {
          portfolioChangeBalance:payload.data,
          letPortUpdate:true
        };
        assign(stockDataObject,updatePortBalance);
        stockData.emitChange();
      }else{
        updatePortBalance = {
          letPortUpdate:false
        };
        assign(stockDataObject,updatePortBalance);
        stockData.emitChange();
      }
      break;
    case 'submit-port-change':
      let submitNewBalance = {
        portfolioBalance:payload.data,
        showPortInput:false,
        portfolioChangeBalance:''
      };
      if(stockDataObject.originalPortfolioValue === 0){
        submitNewBalance.originalPortfolioValue = payload.data;
      }
      //console.log('o: ',submitNewBalance)
      assign(stockDataObject,submitNewBalance);
      stockData.emitChange();
      break;
    case 'update-win-amount':
      let updateWin = {
        showWinInput:true,
        showLoseInput:false,
        showPortInput:false,
        showPercentInput:false
      };
      assign(stockDataObject,updateWin);
      stockData.emitChange();
      break;
    case 'update-loss-amount':
      let updateLoss = {
        showWinInput:false,
        showLoseInput:true,
        showPortInput:false,
        showPercentInput:false
      };
      assign(stockDataObject,updateLoss);
      stockData.emitChange();
      break;

    case 'key-up-win-change':
      //var str = payload.data;
      //var pattern = /^[a-zA-Z0-9\-_.!@#$%^&*()=+ ]+$/;
      //var keyUpobj;
      let winStr = payload.data;
      let winPattern = /^[0-9\. ]+$/;
      let updateWinBalance;
      if(winPattern.test(winStr) || payload.data === ''){
        updateWinBalance = {
          winChangeBalance:payload.data,
          letPortUpdate:true
        };
        assign(stockDataObject,updateWinBalance);
        stockData.emitChange();
      }else{
        updateWinBalance = {
          letPortUpdate:false
        };
        assign(stockDataObject,updateWinBalance);
        stockData.emitChange();
      }
      break;
    case 'submit-win-change':
      let submitNewWinBalance = {
        wins:payload.data,
        showWinInput:false,
        winChangeBalance:''
      };
      assign(stockDataObject,submitNewWinBalance);
      stockData.emitChange();
      break;

    case 'key-up-loss-change':
      //var str = payload.data;
      //var pattern = /^[a-zA-Z0-9\-_.!@#$%^&*()=+ ]+$/;
      //var keyUpobj;
      let lossStr = payload.data;
      let lossPattern = /^[0-9\. ]+$/;
      let updateLossBalance;
      if(lossPattern.test(lossStr) || payload.data === ''){
        updateLossBalance = {
          loseChangeBalance:payload.data,
          letPortUpdate:true
        };
        assign(stockDataObject,updateLossBalance);
        stockData.emitChange();
      }else{
        updateLossBalance = {
          letPortUpdate:false
        };
        assign(stockDataObject,updateLossBalance);
        stockData.emitChange();
      }
      break;
    case 'submit-loss-change':
      let submitNewLossBalance = {
        losses:payload.data,
        showLoseInput:false,
        loseChangeBalance:''
      };
      assign(stockDataObject,submitNewLossBalance);
      stockData.emitChange();
      break;

    case 'update-percent-amount':
      let updatePercent = {
        showWinInput:false,
        showLoseInput:false,
        showPortInput:false,
        showPercentInput:true,
      };
      assign(stockDataObject,updatePercent);
      stockData.emitChange();
      break;
    case 'key-up-percent-change':
      //var str = payload.data;
      //var pattern = /^[a-zA-Z0-9\-_.!@#$%^&*()=+ ]+$/;
      //var keyUpobj;
      let percentStr = payload.data;
      let percentPattern = /^[0-9\. ]+$/;
      let updatePercentBalance;
      if(percentPattern.test(percentStr) || payload.data === ''){
        updatePercentBalance = {
          percentChangeBalance:payload.data,
          letPortUpdate:true
        };
        assign(stockDataObject,updatePercentBalance);
        stockData.emitChange();
      }else{
        updatePercentBalance = {
          letPortUpdate:false
        };
        assign(stockDataObject,updatePercentBalance);
        stockData.emitChange();
      }
      break;
    case 'submit-percent-change':
      let submitNewPercentBalance = {
        percentChange:payload.data,
        showPercentInput:false,
        percentChangeBalance:''
      };
      assign(stockDataObject,submitNewPercentBalance);
      stockData.emitChange();
      break;
    case 'navigate-back':
      let hideDayView = {
        showSpecificDay:false,
        singleDayFormTicker:null,
        singleDayFormStockPrice:null,
        singleDayFormPositionSize:null,
        singleDayFormBought:null,
        singleDayFormBrokerFee:null,
        singleDayFormLong:null,
        singleDayFormWin:null,
        singleDayFormNotes:null,
        showHistory:false
      };
      assign(stockDataObject,hideDayView);
      stockData.emitChange();
      break;
    case 'day-set-ticker':
      let tickerStr = payload.data;
      let tickerPattern = /^[a-zA-Z\ ]+$/;
      let daySetTicker;
      if(tickerStr === ' '){
        daySetTicker = {
          tickerErrorMessage:true
        };
        assign(stockDataObject,daySetTicker);
      } else if (tickerPattern.test(tickerStr) || tickerStr === ''){
        daySetTicker = {
          singleDayFormTicker:payload.data.toUpperCase(),
          tickerErrorMessage:false
        };
        assign(stockDataObject,daySetTicker);
      }else{
        daySetTicker = {
          tickerErrorMessage:true
        };
        assign(stockDataObject,daySetTicker);
      }

      stockData.emitChange();
      break;
    case 'day-set-stock-price':
      //TODO: check if more than one decimal
      let priceStr = payload.data;
      let priceStrIndexDecimal = priceStr.indexOf('.');
      let pricePattern = /^[0-9\.]+$/;
      let daySetPrice;
      //console.log(priceStrIndexDecimal)
      if(pricePattern.test(priceStr) && priceStrIndexDecimal != 0 || priceStr === ''){
        daySetPrice = {
          singleDayFormStockPrice:payload.data,
          stockPriceErrorMessage:false
        };
        assign(stockDataObject,daySetPrice);
      }else{
        daySetPrice = {
          stockPriceErrorMessage:true
        };
        assign(stockDataObject,daySetPrice);
      }
      stockData.emitChange();
      break;
    case 'day-set-position-size':
      let positionStr = payload.data;
      let positionPattern = /^[0-9\ ]+$/;
      let daySetSize;
      if(positionStr === ' '){
        daySetSize = {
          stockSharesErrorMessage:true
        };
        assign(stockDataObject,daySetSize);
      }else if(positionPattern.test(positionStr) || positionStr === ''){
        daySetSize = {
          singleDayFormPositionSize:payload.data,
          stockSharesErrorMessage:false
        };
        assign(stockDataObject,daySetSize);
      }else{
        daySetSize = {
          stockSharesErrorMessage:true
        };
        assign(stockDataObject,daySetSize);
      }

      stockData.emitChange();
      break;
    case 'day-set-broker-fee':
      //console.log('t: ',payload.data)
      let brokerStr = payload.data;
      let brokerStrIndexDecimal = brokerStr.indexOf('.');
      let brokerPattern = /^[0-9\.]+$/;
      let daySetFee;
      //console.log(brokerStrIndexDecimal)
      if(brokerPattern.test(brokerStr) && brokerStrIndexDecimal != 0 || brokerStr === ''){
        daySetFee = {
          singleDayFormBrokerFee:payload.data,
          brokerFeeErrorMessage:false
        };
        assign(stockDataObject,daySetFee);
      }else{
        daySetFee = {
          brokerFeeErrorMessage:true
        };
        assign(stockDataObject,daySetFee);
      }
      stockData.emitChange();
      break;
    case 'day-set-bought-sold':
      let daySetBought = {
        singleDayFormBought:payload.data
      };
      if(payload.data === 'sold'){
        daySetBought.cantSetWinLoss = false;
      }else{
        daySetBought.cantSetWinLoss = true;
      }
      assign(stockDataObject,daySetBought);
      stockData.emitChange();
      break;
    case 'day-set-long-short':
      let daySetLong = {
        singleDayFormLong:payload.data
      };
      assign(stockDataObject,daySetLong);
      stockData.emitChange();
      break;
    case 'day-set-win-loss':
      let daySetWin = {
        singleDayFormWin:payload.data
      };
      assign(stockDataObject,daySetWin);
      stockData.emitChange();
      break;
    case 'day-set-notes':
      let daySetNotes = {
        singleDayFormNotes:payload.data
      };
      assign(stockDataObject,daySetNotes);
      stockData.emitChange();
      break;
    case 'submit-day-data':

      //console.log('stockDataObject.',stockDataObject)
      //check if stock ticker is capital if not make capital
      let ticker = stockDataObject.singleDayFormTicker != null ? stockDataObject.singleDayFormTicker.toUpperCase() : null;
      let specificMonth = months[stockDataObject.dateInfo.monthInYear];
      let longOrShort = stockDataObject.singleDayFormLong;

      if(stockDataObject.singleDayFormBrokerFee === null || stockDataObject.singleDayFormBrokerFee === ''){
        stockDataObject.singleDayFormBrokerFee = 0;
      }
      //console.log('test',stockDataObject.singleDayFormBrokerFee)

      let resetForm = function() {
        let resetValues =  {
          singleDayFormTicker:null,
          singleDayFormStockPrice:null,
          singleDayFormPositionSize:null,
          singleDayFormBought:null,
          singleDayFormLong:null,
          singleDayFormWin:null,
          singleDayFormNotes:null,
          singleDayFormBrokerFee:null,
          formSubmitSuccess:true
        };
        assign(stockDataObject,resetValues);
        stockData.emitChange();
        document.getElementById('singleDayAside').reset();
        //hide success after time
        setTimeout(function(){
          let resetSuccess = {
            formSubmitSuccess:false
          };
          assign(stockDataObject,resetSuccess);
          stockData.emitChange();
        },4000);
      };

      if(stockDataObject.singleDayFormTicker === null ||
         stockDataObject.singleDayFormTicker === '' ||
         /\s/g.test(stockDataObject.singleDayFormTicker) ||
         stockDataObject.singleDayFormStockPrice === null ||
         stockDataObject.singleDayFormStockPrice === '' ||
         /\s/g.test(stockDataObject.singleDayFormStockPrice) ||
         stockDataObject.singleDayFormPositionSize === null ||
         stockDataObject.singleDayFormPositionSize === '' ||
         /\s/g.test(stockDataObject.singleDayFormPositionSize) ||
         stockDataObject.singleDayFormBought === null ||
         stockDataObject.singleDayFormBought === '' ||
         /\s/g.test(stockDataObject.singleDayFormBought) ||
         stockDataObject.singleDayFormLong === null ||
         stockDataObject.singleDayFormLong === '' ||
         /\s/g.test(stockDataObject.singleDayFormLong)){

        //TODO: need error handling for this
        console.log('we are null and need values')
        let fieldErrorShow = {
          fieldErrorMessage:true
        };
        assign(stockDataObject,fieldErrorShow);
        stockData.emitChange();

      }else if(stockDataObject.singleDayFormBought === 'bought'){
        //stockDataObject.singleDayFormLong === 'long'

        if(!!stockDataObject.lookup[ticker]){
          //object exists
          //console.log('they do exist',stockDataObject.lookup[ticker]);
          if(stockDataObject.lookup[ticker].current.length === 0 && stockDataObject.singleDayFormLong === 'long'|| stockDataObject.lookup[ticker].currentShort.length === 0 && stockDataObject.singleDayFormLong === 'short'){
            //user had stock but sold all shares
              //add new shares to current
              //if user sells a stock completely but plays it again, need to do logic here
            // stockDataObject.lookup[ticker].avgLong = JSON.parse(stockDataObject.singleDayFormStockPrice);
            // stockDataObject.lookup[ticker].sharesLong = JSON.parse(stockDataObject.singleDayFormPositionSize);
            //date, amount
            if(stockDataObject.singleDayFormLong === 'long'){
              stockDataObject.lookup[ticker].sharesLong = JSON.parse(stockDataObject.singleDayFormPositionSize);
              stockDataObject.lookup[ticker].avgLong = JSON.parse(stockDataObject.singleDayFormStockPrice);
              let stockCurrent = {
                price:JSON.parse(stockDataObject.singleDayFormStockPrice),
                boughtSold:'bought',
                shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
                totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
                brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
                longShort:stockDataObject.singleDayFormLong
              };
              stockDataObject.lookup[ticker].current.push(stockCurrent);
            }else{
              stockDataObject.lookup[ticker].sharesShort = JSON.parse(stockDataObject.singleDayFormPositionSize);
              stockDataObject.lookup[ticker].avgShort = JSON.parse(stockDataObject.singleDayFormStockPrice);
              let stockCurrentShort = {
                price:JSON.parse(stockDataObject.singleDayFormStockPrice),
                boughtSold:'bought',
                shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
                totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
                brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
                longShort:stockDataObject.singleDayFormLong
              };
              stockDataObject.lookup[ticker].currentShort.push(stockCurrentShort);
            }
            let stockHistory = {
              date:{
                dayInMonth:stockDataObject.dateInfo.dayInMonth,
                monthInYear:stockDataObject.dateInfo.monthInYear,
                year:stockDataObject.dateInfo.year
              },
              price:JSON.parse(stockDataObject.singleDayFormStockPrice),
              shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
              boughtSold:'bought',
              longShort:stockDataObject.singleDayFormLong,
              totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
              brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
              note:stockDataObject.singleDayFormNotes
            }
            // stockDataObject.lookup[ticker].current.push(stockCurrent);
            stockDataObject.lookup[ticker].history.push(stockHistory);
            //console.log('stockDataObject.lookup[ticker]',stockDataObject.lookup[ticker])
          }else{
            if(stockDataObject.singleDayFormLong === 'long'){
              let addStockCurrent = {
                price:JSON.parse(stockDataObject.singleDayFormStockPrice),
                boughtSold:'bought',
                shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
                totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
                brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
                longShort:stockDataObject.singleDayFormLong
              };
              stockDataObject.lookup[ticker].current.push(addStockCurrent);
            }else{
              let addStockCurrentShort = {
                price:JSON.parse(stockDataObject.singleDayFormStockPrice),
                boughtSold:'bought',
                shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
                totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
                brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
                longShort:stockDataObject.singleDayFormLong
              };
              stockDataObject.lookup[ticker].currentShort.push(addStockCurrentShort);
            }
            let addStockHistory = {
              date:{
                dayInMonth:stockDataObject.dateInfo.dayInMonth,
                monthInYear:stockDataObject.dateInfo.monthInYear,
                year:stockDataObject.dateInfo.year
              },
              price:JSON.parse(stockDataObject.singleDayFormStockPrice),
              shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
              boughtSold:'bought',
              longShort:stockDataObject.singleDayFormLong,
              totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
              brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
              note:stockDataObject.singleDayFormNotes
            }
            //stockDataObject.lookup[ticker].current.push(addStockCurrent);
            stockDataObject.lookup[ticker].history.push(addStockHistory);

            let totalStockCost;
            let newShareAmount;
            let totalBrokerFee;
            //console.log(stockDataObject.lookup[ticker].current.length)
            //TO?DO: question is do we loop through and include all shares even if some where sold?
              //example bought 1@ 1, 1@2, 1@3, sold 1@3, and bought 1 more @3. History there are a total of
              //4 shares purchased, 1 was sold. Do we average in that sold share at the cost it was purchased at?
            if(stockDataObject.singleDayFormLong === 'long'){

              for(let i = 0; i < stockDataObject.lookup[ticker].current.length; i++){
                if(stockDataObject.lookup[ticker].current[i].boughtSold === 'bought' && stockDataObject.lookup[ticker].current[i].longShort === 'long'){
                  if(i === 0){
                    totalStockCost = stockDataObject.lookup[ticker].current[i].totalCost;
                    newShareAmount = stockDataObject.lookup[ticker].current[i].shares;
                    totalBrokerFee = stockDataObject.lookup[ticker].current[i].brokerFee;
                  }else{
                    totalStockCost = totalStockCost + stockDataObject.lookup[ticker].current[i].totalCost;
                    newShareAmount = newShareAmount + stockDataObject.lookup[ticker].current[i].shares;
                    totalBrokerFee = totalBrokerFee + stockDataObject.lookup[ticker].current[i].brokerFee;
                  }
                }else{
                  //totalStockCost = totalStockCost - stockDataObject.lookup[ticker].current[i].totalCost;
                  //newShareAmount = newShareAmount - stockDataObject.lookup[ticker].current[i].shares;
                  totalBrokerFee = totalBrokerFee + stockDataObject.lookup[ticker].current[i].brokerFee;
                }
              }

              // see what this would get rounded to from other brokers .toFixed(2) ok to use/
              stockDataObject.lookup[ticker].avgLong = totalStockCost / newShareAmount;
              //console.log('stockDataObject.lookup[ticker].avgLong',stockDataObject.lookup[ticker].avgLong)
              //stockDataObject.lookup[ticker].totalValueAfterFees = totalStockCost - totalBrokerFee;
              stockDataObject.lookup[ticker].sharesLong = newShareAmount;
              //console.log(stockDataObject.lookup[ticker])

            }else{

              for(let i = 0; i < stockDataObject.lookup[ticker].currentShort.length; i++){
                //console.log('i: ',i)
                if(stockDataObject.lookup[ticker].currentShort[i].boughtSold === 'bought' && stockDataObject.lookup[ticker].currentShort[i].longShort === 'short'){
                  //console.log('is it in 1?',i)
                  if(i === 0){
                    //console.log('is it in 2?')
                    totalStockCost = stockDataObject.lookup[ticker].currentShort[i].totalCost;
                    newShareAmount = stockDataObject.lookup[ticker].currentShort[i].shares;
                    totalBrokerFee = stockDataObject.lookup[ticker].currentShort[i].brokerFee;
                  }else{
                    //console.log('is it in 3?')
                    totalStockCost = totalStockCost + stockDataObject.lookup[ticker].currentShort[i].totalCost;
                    newShareAmount = newShareAmount + stockDataObject.lookup[ticker].currentShort[i].shares;
                    totalBrokerFee = totalBrokerFee + stockDataObject.lookup[ticker].currentShort[i].brokerFee;
                  }
                }else{
                  //totalStockCost = totalStockCost - stockDataObject.lookup[ticker].current[i].totalCost;
                  //newShareAmount = newShareAmount - stockDataObject.lookup[ticker].current[i].shares;
                  totalBrokerFee = totalBrokerFee + stockDataObject.lookup[ticker].currentShort[i].brokerFee;
                }
              }

              // see what this would get rounded to from other brokers .toFixed(2) ok to use/
              //console.log(totalStockCost)
              //console.log(newShareAmount)
              stockDataObject.lookup[ticker].avgShort = totalStockCost / newShareAmount;
              //console.log('stockDataObject.lookup[ticker].avgShort',stockDataObject.lookup[ticker].avgShort)
              //stockDataObject.lookup[ticker].totalValueAfterFees = totalStockCost - totalBrokerFee;
              stockDataObject.lookup[ticker].sharesShort = newShareAmount;
              //console.log(stockDataObject.lookup[ticker])

            }
            //console.log('testing shorts:  ',stockDataObject.lookup[ticker]);

          }

        }else{
          //console.log(stockDataObject.singleDayFormBrokerFee)
          stockDataObject.lookup[ticker] = {};
          stockDataObject.lookup[ticker].current = [];
          stockDataObject.lookup[ticker].currentShort = [];
          stockDataObject.lookup[ticker].history = [];
          // stockDataObject.lookup[ticker].sharesLong = 0;
          // stockDataObject.lookup[ticker].avgLong = 0;
          // stockDataObject.lookup[ticker].sharesShort = 0;
          // stockDataObject.lookup[ticker].avgShort = 0;
          //stockDataObject.lookup[ticker].avgLong = JSON.parse(stockDataObject.singleDayFormStockPrice);
          //stockDataObject.lookup[ticker].sharesLong = JSON.parse(stockDataObject.singleDayFormPositionSize);
          //date, amount
          if(stockDataObject.singleDayFormLong === 'long'){
            stockDataObject.lookup[ticker].avgLong = JSON.parse(stockDataObject.singleDayFormStockPrice);
            stockDataObject.lookup[ticker].sharesLong = JSON.parse(stockDataObject.singleDayFormPositionSize);
            let stockCurrent = {
              price:JSON.parse(stockDataObject.singleDayFormStockPrice),
              boughtSold:'bought',
              shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
              totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
              brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
              longShort:stockDataObject.singleDayFormLong
            };
            stockDataObject.lookup[ticker].current.push(stockCurrent);
          }else{
            stockDataObject.lookup[ticker].avgShort = JSON.parse(stockDataObject.singleDayFormStockPrice);
            stockDataObject.lookup[ticker].sharesShort = JSON.parse(stockDataObject.singleDayFormPositionSize);
            let stockCurrentShort = {
              price:JSON.parse(stockDataObject.singleDayFormStockPrice),
              boughtSold:'bought',
              shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
              totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
              brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
              longShort:stockDataObject.singleDayFormLong
            };
            stockDataObject.lookup[ticker].currentShort.push(stockCurrentShort);
          }
          let stockHistory = {
            date:{
              dayInMonth:stockDataObject.dateInfo.dayInMonth,
              monthInYear:stockDataObject.dateInfo.monthInYear,
              year:stockDataObject.dateInfo.year
            },
            price:JSON.parse(stockDataObject.singleDayFormStockPrice),
            shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
            boughtSold:'bought',
            longShort:stockDataObject.singleDayFormLong,
            totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
            brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
            note:stockDataObject.singleDayFormNotes
          }
          // stockDataObject.lookup[ticker].current.push(stockCurrent);
          stockDataObject.lookup[ticker].history.push(stockHistory);
        }
        //console.log(stockDataObject.lookup)
        let addInfoToDay =  {
          'singleDayFormTicker':stockDataObject.singleDayFormTicker,
          'singleDayFormStockPrice':stockDataObject.singleDayFormStockPrice,
          'singleDayFormPositionSize':stockDataObject.singleDayFormPositionSize,
          'singleDayFormBought':stockDataObject.singleDayFormBought,
          'singleDayFormLong':stockDataObject.singleDayFormLong,
          'singleDayFormWin':null,
          'singleDayFormNotes':stockDataObject.singleDayFormNotes,
          'singleDayFormBrokerFee':stockDataObject.singleDayFormBrokerFee
        };
        if(stockDataObject.all[stockDataObject.dateInfo.year] === undefined){
          stockDataObject.all[stockDataObject.dateInfo.year] = {
            "January":{},
            "February":{},
            "March":{},
            "April":{},
            "May":{},
            "June":{},
            "July":{},
            "August":{},
            "September":{},
            "October":{},
            "November":{},
            "December":{}
          };
          //console.log('it is undefined',stockDataObject)
        }
        stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] = stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] || [];
        stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth].push(addInfoToDay);
        resetForm();
      }else if(stockDataObject.singleDayFormBought === 'sold'){
        //console.log('sold',ticker)
        if(stockDataObject.lookup[ticker] === undefined){
          //TODO:no buying history
          console.log('no buying history')
        }else{
          //console.log('buying history',stockDataObject.lookup[ticker])
          let brokerTotal = GetBrokerTotal(stockDataObject.lookup[ticker].current,stockDataObject.singleDayFormBrokerFee);
          let CalculatePercentChangeFunction;
          let totalValue;
          let subtractSoldShares;
          let newStockValue;
          let totalSoldValue;
          let newPortfolioValue;
          let addInfoToDay =  {
            'singleDayFormTicker':stockDataObject.singleDayFormTicker,
            'singleDayFormStockPrice':stockDataObject.singleDayFormStockPrice,
            'singleDayFormPositionSize':stockDataObject.singleDayFormPositionSize,
            'singleDayFormBought':stockDataObject.singleDayFormBought,
            'singleDayFormLong':stockDataObject.singleDayFormLong,
            'singleDayFormWin':stockDataObject.singleDayFormWin,
            'singleDayFormNotes':stockDataObject.singleDayFormNotes,
            'singleDayFormBrokerFee':stockDataObject.singleDayFormBrokerFee
          };
          let soldStockHistory = {
            date:new Date(),
            price:JSON.parse(stockDataObject.singleDayFormStockPrice),
            shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
            boughtSold:'sold',
            longShort:stockDataObject.singleDayFormLong,
            totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
            brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee),
            note:stockDataObject.singleDayFormNotes
          };
          //console.log('test1',stockDataObject)
          //console.log('test1',"sharesLong" in stockDataObject.lookup[ticker])
          //console.log('try 1',longOrShort === 'long' && 'sharesLong' in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) > JSON.parse(stockDataObject.lookup[ticker].sharesLong));
          //console.log('try 2',longOrShort === 'short' &&  "sharesShort" in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) > JSON.parse(stockDataObject.lookup[ticker].sharesShort));

          if(longOrShort === 'long' && 'sharesLong' in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) > JSON.parse(stockDataObject.lookup[ticker].sharesLong) || longOrShort === 'short' &&  "sharesShort" in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) > JSON.parse(stockDataObject.lookup[ticker].sharesShort)){
            //TODO: bug if user buys long and short, sells all short or long, and then tries to sell the other
              //goes into this block because they have 0 of what they just sold, but entered a greater value for what they are trying to sell
            //console.log('tried to sell more than owned')
            //if entered shares sold is greater than total held
              //-- error - cant sell more shares than you own.
            let sharesError =  {
              sellingMoreSharesThanOwnedError: true
            }
            assign(stockDataObject,sharesError);
            stockData.emitChange();

            setTimeout(function(){
              let resetSharesSoldError = {
                sellingMoreSharesThanOwnedError: false
              };
              assign(stockDataObject,resetSharesSoldError);
              stockData.emitChange();
            },4000);
          } else if('sharesLong' in stockDataObject.lookup[ticker] &&  JSON.parse(stockDataObject.singleDayFormPositionSize) < JSON.parse(stockDataObject.lookup[ticker].sharesLong) || 'sharesShort' in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) < JSON.parse(stockDataObject.lookup[ticker].sharesShort)){
            //console.log('tried to sell less than owned')
            //if entered shares sold is less than total held
              //-- add to current or currentShort
              let soldStockCurrent = {
                price:JSON.parse(stockDataObject.singleDayFormStockPrice),
                boughtSold:'sold',
                shares:JSON.parse(stockDataObject.singleDayFormPositionSize),
                totalCost:+(JSON.parse(stockDataObject.singleDayFormStockPrice) * JSON.parse(stockDataObject.singleDayFormPositionSize)).toFixed(8),
                brokerFee:JSON.parse(stockDataObject.singleDayFormBrokerFee)
              };
              if(stockDataObject.singleDayFormLong === 'long'){
                stockDataObject.lookup[ticker].current.push(soldStockCurrent);
              }else{
                stockDataObject.lookup[ticker].currentShort.push(soldStockCurrent);
              }
              //stockDataObject.lookup[ticker].current.push(soldStockCurrent);
              //-- add to all object for specific day
              stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] = stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] || [];
              stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth].push(addInfoToDay);

              //-- do calculations to figure out value of portfolio
              if(stockDataObject.singleDayFormLong === 'long'){
                //if long
                totalValue = JSON.parse(stockDataObject.lookup[ticker].sharesLong) * JSON.parse(stockDataObject.lookup[ticker].avgLong);
                subtractSoldShares = JSON.parse(stockDataObject.lookup[ticker].sharesLong) - stockDataObject.singleDayFormPositionSize;
                newStockValue = subtractSoldShares * JSON.parse(stockDataObject.lookup[ticker].avgLong);
                totalSoldValue = stockDataObject.singleDayFormPositionSize * stockDataObject.singleDayFormStockPrice;
                // console.log('totalValue: ',totalValue)
                // console.log('subtractSoldShares: ',subtractSoldShares)
                // console.log('newStockValue: ',newStockValue)
                // console.log('totalSoldValue: ',totalSoldValue)
                if(stockDataObject.singleDayFormStockPrice < JSON.parse(stockDataObject.lookup[ticker].avgLong)){
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                  soldStockHistory.isLoss = true;
                  //console.log('1: ',+(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8))
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) - (totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                  //console.log('2: ',newPortfolioValue)
                }else if(stockDataObject.singleDayFormStockPrice > JSON.parse(stockDataObject.lookup[ticker].avgLong)){
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalSoldValue + newStockValue) - totalValue).toFixed(8);
                  soldStockHistory.isLoss = false;
                  //console.log('1: ',+(JSON.parse(totalSoldValue + newStockValue) - totalValue).toFixed(8))
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) + ((totalSoldValue + newStockValue) - totalValue)).toFixed(8);
                }
              }else{
                //if short
                totalValue = JSON.parse(stockDataObject.lookup[ticker].sharesShort) * JSON.parse(stockDataObject.lookup[ticker].avgShort); //shares you are short * short average
                subtractSoldShares = JSON.parse(stockDataObject.lookup[ticker].sharesShort) - stockDataObject.singleDayFormPositionSize; //total owned shares -  ammount selling
                newStockValue = subtractSoldShares * JSON.parse(stockDataObject.lookup[ticker].avgShort); //amount of shares being sold * short average
                totalSoldValue = stockDataObject.singleDayFormPositionSize * stockDataObject.singleDayFormStockPrice; //ammount of shares selling * current stock price sold at
                if(stockDataObject.singleDayFormStockPrice < JSON.parse(stockDataObject.lookup[ticker].avgShort)){
                  //winner
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                  soldStockHistory.isLoss = false;
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) + (totalValue - (totalSoldValue + newStockValue))).toFixed(8);
                  //console.log('test: ',+(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8))
                  // console.log('totalValue - (totalSoldValue + newStockValue) ',totalValue - (totalSoldValue + newStockValue))
                  // console.log('(totalSoldValue + newStockValue): ',(totalSoldValue + newStockValue))
                  // console.log('totalValue: ',totalValue)
                  // console.log('test: ',newPortfolioValue)
                }else if(stockDataObject.singleDayFormStockPrice > JSON.parse(stockDataObject.lookup[ticker].avgShort)){
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalSoldValue + newStockValue) - totalValue).toFixed(8);
                  soldStockHistory.isLoss = true;
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) - ((newStockValue + totalSoldValue) - totalValue)).toFixed(8);
                  // console.log('JSON',JSON.parse(stockDataObject.portfolioBalance) - (totalValue - (newStockValue + totalSoldValue)))
                  // console.log('totalValue',totalValue)
                  // console.log('newStockValue + totalSoldValue',newStockValue + totalSoldValue)
                  // console.log('totalValue - (newStockValue + totalSoldValue)',totalValue - (newStockValue + totalSoldValue))
                  // console.log('newPortfolioValue',newPortfolioValue)
                }
              }

              //-- add to history
              stockDataObject.lookup[ticker].history.push(soldStockHistory);

              //update shares held
              //stockDataObject.lookup[ticker].totalValueAfterFees = totalStockCost - totalBrokerFee;
              if(stockDataObject.singleDayFormLong === 'long'){
                stockDataObject.lookup[ticker].sharesLong = subtractSoldShares;
              }else{
                stockDataObject.lookup[ticker].sharesShort = subtractSoldShares;
              }

              //update UI portfolio value
              //update UI percent
              //update UI win or loss
              let CalculatePercentChangeObj = {
                portfolioValue:JSON.parse(stockDataObject.portfolioBalance),
                newPortfolioValue:newPortfolioValue,
                currentPercent:stockDataObject.percentChange,
                originalValue: stockDataObject.originalPortfolioValue
              }
              CalculatePercentChangeFunction = CalculatePercentChange(CalculatePercentChangeObj);
              let updatedValues = {
                portfolioBalance:newPortfolioValue,
                percentChange:CalculatePercentChangeFunction
              };
              if(stockDataObject.singleDayFormWin === 'win'){
                if(stockDataObject.wins === null){
                  updatedValues.wins = 1
                }else{
                  updatedValues.wins = JSON.parse(stockDataObject.wins) + 1;
                }
              }else{
                if(stockDataObject.losses === null){
                  updatedValues.losses = 1
                }else{
                  updatedValues.losses = JSON.parse(stockDataObject.losses) + 1;
                }
              }
              assign(stockDataObject,updatedValues);
              stockData.emitChange();
              resetForm();
          } else if('sharesLong' in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) === JSON.parse(stockDataObject.lookup[ticker].sharesLong) || 'sharesShort' in stockDataObject.lookup[ticker] && JSON.parse(stockDataObject.singleDayFormPositionSize) === JSON.parse(stockDataObject.lookup[ticker].sharesShort)){
            //console.log('tried to sell equal to owned')
            //if entered shares sold is equal to total shares held
              //-- add to all object for specific day
              stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] = stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth] || [];
              stockDataObject.all[stockDataObject.dateInfo.year][specificMonth][stockDataObject.dateInfo.dayInMonth].push(addInfoToDay);

              //-- do calculations to figure out value of portfolio
              if(stockDataObject.singleDayFormLong === 'long'){
                totalValue = JSON.parse(stockDataObject.lookup[ticker].sharesLong) * JSON.parse(stockDataObject.lookup[ticker].avgLong);
                subtractSoldShares = JSON.parse(stockDataObject.lookup[ticker].sharesLong) - stockDataObject.singleDayFormPositionSize;
                newStockValue = subtractSoldShares * JSON.parse(stockDataObject.lookup[ticker].avgLong);
                totalSoldValue = stockDataObject.singleDayFormPositionSize * stockDataObject.singleDayFormStockPrice;
                if(stockDataObject.singleDayFormStockPrice < JSON.parse(stockDataObject.lookup[ticker].avgLong)){
                  //console.log('1: ',stockDataObject)
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) - (totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                }else if(stockDataObject.singleDayFormStockPrice > JSON.parse(stockDataObject.lookup[ticker].avgLong)){
                  //console.log('2: ',stockDataObject)
                  soldStockHistory.totalGainLoss = +(JSON.parse(totalSoldValue + newStockValue) - totalValue).toFixed(8);
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) + ((totalSoldValue + newStockValue) - totalValue)).toFixed(8);
                }
              }else{
                totalValue = JSON.parse(stockDataObject.lookup[ticker].sharesShort) * JSON.parse(stockDataObject.lookup[ticker].avgShort);
                subtractSoldShares = JSON.parse(stockDataObject.lookup[ticker].sharesShort) - stockDataObject.singleDayFormPositionSize;
                newStockValue = subtractSoldShares * JSON.parse(stockDataObject.lookup[ticker].avgShort);
                totalSoldValue = stockDataObject.singleDayFormPositionSize * stockDataObject.singleDayFormStockPrice;
                if(stockDataObject.singleDayFormStockPrice < JSON.parse(stockDataObject.lookup[ticker].avgShort)){

                  soldStockHistory.totalGainLoss = +(JSON.parse(totalValue - (newStockValue + totalSoldValue))).toFixed(8);
                  soldStockHistory.isLoss = false;
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) + (totalValue - (totalSoldValue + newStockValue))).toFixed(8);
                }else if(stockDataObject.singleDayFormStockPrice > JSON.parse(stockDataObject.lookup[ticker].avgShort)){

                  soldStockHistory.totalGainLoss = +(JSON.parse(totalSoldValue + newStockValue) - totalValue).toFixed(8);
                  soldStockHistory.isLoss = true;
                  newPortfolioValue = +(JSON.parse(stockDataObject.portfolioBalance) - ((newStockValue + totalSoldValue) - totalValue)).toFixed(8);
                }
              }

              //-- add to history
              stockDataObject.lookup[ticker].history.push(soldStockHistory);
              //update UI portfolio value
              //update UI percent
              //update UI win or loss
              let CalculatePercentChangeObj = {
                portfolioValue:JSON.parse(stockDataObject.portfolioBalance),
                newPortfolioValue:newPortfolioValue,
                currentPercent:stockDataObject.percentChange,
                originalValue: stockDataObject.originalPortfolioValue
              }
              CalculatePercentChangeFunction = CalculatePercentChange(CalculatePercentChangeObj);
              //-- zero out current or currentShort depending on which is all sold
              if(stockDataObject.singleDayFormLong === 'long'){
                //-- zero out current or currentShort depending on which is all sold
                stockDataObject.lookup[ticker].current = [];
                //-- zero out avg.
                stockDataObject.lookup[ticker].avgLong = null;
                //-- zero out shares
                stockDataObject.lookup[ticker].sharesLong = 0;
              }else{
                //-- zero out current or currentShort depending on which is all sold
                stockDataObject.lookup[ticker].currentShort = [];
                //-- zero out avg.
                stockDataObject.lookup[ticker].avgShort = null;
                //-- zero out shares
                stockDataObject.lookup[ticker].sharesShort = 0;
              }

              let updatedValues = {
                portfolioBalance:newPortfolioValue - brokerTotal,
                percentChange:CalculatePercentChangeFunction
              };
              if(stockDataObject.singleDayFormWin === 'win'){
                if(stockDataObject.wins === null){
                  updatedValues.wins = 1
                }else{
                  updatedValues.wins = JSON.parse(stockDataObject.wins) + 1;
                }
              }else{
                if(stockDataObject.losses === null){
                  updatedValues.losses = 1
                }else{
                  updatedValues.losses = JSON.parse(stockDataObject.losses) + 1;
                }
              }
              assign(stockDataObject,updatedValues);
              stockData.emitChange();
              resetForm();
          } else {
            console.warn('Please report error 5454');
          }
        }
      }
      break;

  }
});

module.exports = stockData;
