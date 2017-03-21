let CalculatePercentChange = function(CalculatePercentChangeObj){
  //console.log('update UI',CalculatePercentChangeObj);
  // {portfolioValue: 1, newPortfolioValue: 0.9, currentPercent: 0}
  let percent;
  let newPercent;
  let currentPortValue = JSON.parse(CalculatePercentChangeObj.portfolioValue);
  let origPortValue = JSON.parse(CalculatePercentChangeObj.originalValue);
  let portfolioDifferenceValue = JSON.parse(CalculatePercentChangeObj.portfolioValue) - JSON.parse(CalculatePercentChangeObj.originalValue);
  let newPortfolioDifferenceValue = JSON.parse(CalculatePercentChangeObj.newPortfolioValue) - JSON.parse(CalculatePercentChangeObj.originalValue);
  if(portfolioDifferenceValue === 0 && origPortValue != 0) {
    //users first sell
    //user updated original value to something greater than 0
    if(CalculatePercentChangeObj.newPortfolioValue > CalculatePercentChangeObj.portfolioValue){
      percent = ((CalculatePercentChangeObj.newPortfolioValue - CalculatePercentChangeObj.portfolioValue) / CalculatePercentChangeObj.portfolioValue) * 100;
      newPercent = percent + CalculatePercentChangeObj.currentPercent;
      return newPercent;
    }else if(CalculatePercentChangeObj.newPortfolioValue < CalculatePercentChangeObj.portfolioValue){
      percent = ((CalculatePercentChangeObj.portfolioValue - CalculatePercentChangeObj.newPortfolioValue) /  CalculatePercentChangeObj.portfolioValue) * 100;
      newPercent = CalculatePercentChangeObj.currentPercent - percent;
      return newPercent;
    }else{
      return CalculatePercentChangeObj.currentPercent;
    }
  }else if(portfolioDifferenceValue === 0 && origPortValue === 0){
    //users first sell, never changed port value
    //hopefully means the user is just starting from 0 in the app. We dont change the percent
      //becuase you cant increase percent from 0
    return CalculatePercentChangeObj.currentPercent;
  }else{
    if(newPortfolioDifferenceValue > portfolioDifferenceValue && origPortValue != 0){
      percent = ((newPortfolioDifferenceValue - portfolioDifferenceValue) / portfolioDifferenceValue) * 100;
      newPercent = percent + CalculatePercentChangeObj.currentPercent;
      return newPercent;
    }else if(newPortfolioDifferenceValue < portfolioDifferenceValue && origPortValue != 0){
      percent = ((portfolioDifferenceValue - newPortfolioDifferenceValue) /  portfolioDifferenceValue) * 100;
      newPercent = CalculatePercentChangeObj.currentPercent - percent;
      return newPercent;
    }else{
      return CalculatePercentChangeObj.currentPercent;
    }
  }
}

export default CalculatePercentChange;
