let GetGainsOrLoss = function(history){
  //console.log('console log', history)
  let gainsOrLoss = 0;
  for(let i = 0; i < history.length; i++){
    if(history[i].boughtSold === 'sold' && history[i].totalGainLoss != 0){
      let gainLoss = history[i].totalGainLoss;
      if(!history[i].isLoss){
        gainsOrLoss = gainsOrLoss + gainLoss;
      }else{
        gainsOrLoss = gainsOrLoss - gainLoss;
      }
    }
  }
  // console.log('gainsOrLoss:',gainsOrLoss)
  // console.log('history: ',history)
  return gainsOrLoss;
}

export default GetGainsOrLoss;
