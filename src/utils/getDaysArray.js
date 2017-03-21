let t = new Date();
let currentMonth = t.getMonth();
let currentDay = t.getDate();
let m = 0;
let y = t.getFullYear();
//console.log('yyy',y)

let getDaysArray = function(year, month) {
  let names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
  let date = new Date(year, month, 1);
  let monthsInYear = 12;
  let result = {
    0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[]
  };
  for(let i = 0; i < monthsInYear; i++){
    while (date.getMonth() == month) {
      let resultObj = {
        dayNumber:date.getDate(),
        dayOfWeek:names[date.getDay()],
        monthOfYear:date.getMonth(),
        year:year
      };
      if(y === year && currentMonth === month && currentDay === date.getDate()){
        resultObj.isToday = true;
      }
      result[i].push(resultObj);
      date.setDate(date.getDate()+1);
    }
    month++;
  }
  result.year = year;
  result.calendarShouldLoad = true;
  //console.log('result: ',result)
  return result;
}

export default getDaysArray;
