let GetBrokerTotal = function(brokerData, soldBrokerFee){
  //console.log(brokerData);
  let totalFee = 0;
  for(let i = 0; i < brokerData.length; i++){
    let brokerInfo = brokerData[i].brokerFee;
    totalFee = brokerInfo + totalFee;
  }
  totalFee = totalFee + JSON.parse(soldBrokerFee);
  return totalFee;
}

export default GetBrokerTotal;
