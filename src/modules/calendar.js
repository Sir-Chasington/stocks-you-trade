"use strict";
import React from 'react';
import MainStore from '../data-stores/MainStore';
import mainStoreDispatcher from '../utils/MainStoreDispatcher';
//import moment from 'moment';
import getDaysArray from '../utils/getDaysArray';

let getNewDate = new Date();
let currentYear = getNewDate.getFullYear();
let currentSelectedYear = currentYear;

const Calendar = React.createClass({
  propTypes: {

  },

  getInitialState:function() {
    //console.log('init')
    return {year:currentSelectedYear}
  },

  componentDidMount: function() {
    //console.log(this.state)
    // let t = new Date();
    // let currentMonth = t.getMonth();
    // let currentDay = t.getDate();
    let m = 0;
    //let y = t.getFullYear();
    let y = this.state.year;

    // let getDaysArray = function(year, month) {
    //   let names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
    //   let date = new Date(year, month, 1);
    //   let monthsInYear = 12;
    //   let result = {
    //     0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[]
    //   };
    //   for(let i = 0; i < monthsInYear; i++){
    //     while (date.getMonth() == month) {
    //       let resultObj = {
    //         dayNumber:date.getDate(),
    //         dayOfWeek:names[date.getDay()],
    //         monthOfYear:date.getMonth(),
    //         year:year
    //       };
    //       if(y === year && currentMonth === month && currentDay === date.getDate()){
    //         resultObj.isToday = true;
    //       }
    //       result[i].push(resultObj);
    //       date.setDate(date.getDate()+1);
    //     }
    //     month++;
    //   }
    //   result.year = year;
    //   result.calendarShouldLoad = true;
    //   return result;
    // }
    //let result = getDaysArray(y,m);
    //this.setState({year:result});
    this.setState(getDaysArray(y,m));

  },

  updateYearFuture: function(){
    currentSelectedYear = currentSelectedYear + 1;
    let m = 0;
    this.setState(getDaysArray(currentSelectedYear,m));
  },

  updateYearPast: function(){
    currentSelectedYear = currentSelectedYear - 1;
    let m = 0;
    this.setState(getDaysArray(currentSelectedYear,m));
  },

  addInfo: function(i,dateInfo) {
    //console.log('dateInfo: ',dateInfo);
    var dispatchObj = {
      actionType: 'date-info',
      data:dateInfo
    };
    mainStoreDispatcher.dispatch(dispatchObj);
  },

  render: function (){
    //console.log('state: ',this.state);
    //console.log('p: ',this.props);

    let lookup = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let _this = this;
    let daysInMonthJan;
    let daysInMonthFeb;
    let daysInMonthMar;
    let daysInMonthApr;
    let daysInMonthMay;
    let daysInMonthJun;
    let daysInMonthJul;
    let daysInMonthAug;
    let daysInMonthSep;
    let daysInMonthOct;
    let daysInMonthNov;
    let daysInMonthDec;
    if(this.state.calendarShouldLoad){

      //console.log('state: ',this.state);
      let daysOfMonthJan = this.state[0];
      let weekdayJanStart = daysOfMonthJan[0].dayOfWeek;
      let daysOfMonthFeb = this.state[1];
      let weekdayFebStart = daysOfMonthFeb[0].dayOfWeek;
      let daysOfMonthMar = this.state[2];
      let weekdayMarStart = daysOfMonthMar[0].dayOfWeek;
      let daysOfMonthApr = this.state[3];
      let weekdayAprStart = daysOfMonthApr[0].dayOfWeek;
      let daysOfMonthMay = this.state[4];
      let weekdayMayStart = daysOfMonthMay[0].dayOfWeek;
      let daysOfMonthJun = this.state[5];
      let weekdayJunStart = daysOfMonthJun[0].dayOfWeek;
      let daysOfMonthJul = this.state[6];
      let weekdayJulStart = daysOfMonthJul[0].dayOfWeek;
      let daysOfMonthAug = this.state[7];
      let weekdayAugStart = daysOfMonthAug[0].dayOfWeek;
      let daysOfMonthSep = this.state[8];
      let weekdaySepStart = daysOfMonthSep[0].dayOfWeek;
      let daysOfMonthOct = this.state[9];
      let weekdayOctStart = daysOfMonthOct[0].dayOfWeek;
      let daysOfMonthNov = this.state[10];
      let weekdayNovStart = daysOfMonthNov[0].dayOfWeek;
      let daysOfMonthDec = this.state[11];
      let weekdayDecStart = daysOfMonthDec[0].dayOfWeek;
      daysInMonthJan = daysOfMonthJan.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayJanStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayJanStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayJanStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthFeb = daysOfMonthFeb.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayFebStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayFebStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayFebStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthMar = daysOfMonthMar.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayMarStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayMarStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayMarStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthApr = daysOfMonthApr.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayAprStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayAprStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayAprStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthMay = daysOfMonthMay.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };

        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }

        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayMayStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayMayStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayMayStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthJun = daysOfMonthJun.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayJunStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayJunStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayJunStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthJul = daysOfMonthJul.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayJulStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayJulStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayJulStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthAug = daysOfMonthAug.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayAugStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayAugStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayAugStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthSep = daysOfMonthSep.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdaySepStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdaySepStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdaySepStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthOct = daysOfMonthOct.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayOctStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayOctStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayOctStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthNov = daysOfMonthNov.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayNovStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayNovStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayNovStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });
      daysInMonthDec = daysOfMonthDec.map(function (day, i){
        let dayInfo = {
          dayInMonth:day.dayNumber,
          monthInYear:day.monthOfYear,
          year:day.year
        };
        let year = dayInfo.year;
        let getMonthFromLookup = lookup[dayInfo.monthInYear];
        let thisDay = dayInfo.dayInMonth;
        let isEntry;
        if(_this.props.props.all != null && _this.props.props.all[year] != undefined){
          let entryCheck = _this.props.props.all[year][getMonthFromLookup][thisDay];
          if (entryCheck !== undefined && entryCheck.length) {
              isEntry = true;
          } else {
              isEntry = false;
          }
        }
        if(day.isToday && year === currentYear){
          return (
            <li className="current-day" key={i} data-start-day={weekdayDecStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else if(isEntry){
          return (
            <li className="entry-day" key={i} data-start-day={weekdayDecStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }else{
          return (
            <li key={i} data-start-day={weekdayDecStart} onClick={_this.addInfo.bind(_this,i,dayInfo)}>{day.dayNumber}</li>
          );
        }
      });

    }
    //console.log('this props: ',this.props);

    // let _this = this;
    // let myTest = Object.keys(this.state[0]).map(function(key, i) {
    //     console.log('key:',_this.state)
    //     return <div key={i}>Key: {key}, Value: {_this.state[JSON.stringify(key)]}</div>;
    // });

    return(
      <div id="Calendar">
        <h2><span onClick={_this.updateYearPast}>p </span>{this.state.year}<span onClick={_this.updateYearFuture}> f</span></h2>
        <ul className="days-of-week">
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
          <li>M</li>
        </ul>
        <ul className="day-number">
          <li className="month">Jan</li>
          {daysInMonthJan}
        </ul>
        <ul className="day-number">
          <li className="month">Feb</li>
          {daysInMonthFeb}
        </ul>
        <ul className="day-number">
          <li className="month">Mar</li>
          {daysInMonthMar}
        </ul>
        <ul className="day-number">
          <li className="month">Apr</li>
          {daysInMonthApr}
        </ul>
        <ul className="day-number">
          <li className="month">May</li>
          {daysInMonthMay}
        </ul>
        <ul className="day-number">
          <li className="month">Jun</li>
          {daysInMonthJun}
        </ul>
        <ul className="day-number">
          <li className="month">Jul</li>
          {daysInMonthJul}
        </ul>
        <ul className="day-number">
          <li className="month">Aug</li>
          {daysInMonthAug}
        </ul>
        <ul className="day-number">
          <li className="month">Sep</li>
          {daysInMonthSep}
        </ul>
        <ul className="day-number">
          <li className="month">Oct</li>
          {daysInMonthOct}
        </ul>
        <ul className="day-number">
          <li className="month">Nov</li>
          {daysInMonthNov}
        </ul>
        <ul className="day-number">
          <li className="month">Dec</li>
          {daysInMonthDec}
        </ul>
      </div>
    )
  }
});

export default Calendar;
