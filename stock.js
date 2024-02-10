let myChart;
let timeDataArray = [];
let priceArray = [];
const resultList = [];
const stockList = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

//...........fetching graphs data...
async function getData() {
  try {
    let response = await fetch("https://stocks3.onrender.com/api/stocks/getstocksdata");
    let data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//................fetching stock profit data
async function getStockProfit(stock) {
  try {
    let response = await fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata");
    let data = await response.json();
    return data.stocksStatsData[0][stock];
  } catch (error) {
    console.error(error);
  }
}

//.................fetching description data....
async function getDetailsData(){
 try{
  let res = await fetch("https://stocks3.onrender.com/api/stocks/getstocksprofiledata");
  let response = await res.json();
  return response.stocksProfileData[0];
  
 }
catch(err){
  console.error(err);


}

}

async function displayStockDetails(stockType){
  let  detaisPara = document.getElementById("details-para");
  let stockProfitdetails = document.getElementById("stockProfitdetails");
  try {
    let res = await fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata");
    let response =await res.json();
   let {bookValue,profit}= response.stocksStatsData[0][stockType];
   console.log(bookValue,profit);
    const detailsData = await getDetailsData();
    detaisPara.textContent=detailsData[stockType].summary;
    stockProfitdetails.innerHTML=`<span class="stockSymbol">${stockType}</span>
    <span class="bookvalue">$${bookValue.toFixed(2)}</span>
    <span class="profit">${profit.toFixed(2)}%</span>`
    if (profit > 0) {
      stockProfitdetails.querySelector(".profit").style.color = "green";
    } else {
      stockProfitdetails.querySelector(".profit").style.color = "red";
    }

    //console.log(detailsData[stockType].summary);
  } catch (error) {
    console.error(error);
  }
 

}
displayStockDetails(stockList[0]);


//...................fetching data end

async function displayChart(timePeriod, stockType) {
  try {
    const data = await getData();
    let stockData = data.stocksData.find(stock => stock[stockType]);
    
    if (!stockData) {
      console.error("Stock data not found");
      return;
    }

    let stock = stockData[stockType];
    let oneMonths = stock[timePeriod].timeStamp;
    let prices = stock[timePeriod].value;

    priceArray = prices.map(p => p.toFixed(2));
    timeDataArray = oneMonths.map(timeData => new Date(timeData * 1000).toLocaleDateString());

    plotChart();
  } catch (error) {
    console.error(error);
  }
}

async function displayStockProfit() {
  let stockBtnContainer = document.getElementById("stock-btnContainer");
 
  
  
  try {
    for (let stock of stockList) {
      const { bookValue, profit } = await getStockProfit(stock);
      resultList.push([bookValue, profit]);
     let btn_list= document.createElement("li");
     btn_list.innerHTML = `<button value=${stock}>${stock}</button> <span class="bookvalue">$${bookValue.toFixed(2)}</span> <span class="profit">${profit.toFixed(2)}%</span>`
     if (profit > 0) {
      btn_list.querySelector(".profit").style.color = "green";
    } else {
      btn_list.querySelector(".profit").style.color = "red";
    }


    stockBtnContainer.appendChild(btn_list);
       
    }
  } catch (error) {
    console.error(error);
  }
}

displayStockProfit();



function plotChart() {
  const ctx = document.getElementById('myChart').getContext('2d');

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeDataArray,
      datasets: [
        {
          data: priceArray,
          label: "Stock Pricing",
          backgroundColor: "green",
          borderColor: "#fff",
          borderWidth: 2,
          fontColor:"green",
          fontSize:20,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "light",
          titleColor: "white",
          bodyColor: "#254589",
        },
        title: {
          display: true,
          text: "Stock Pricing Analysis",
          fontSize: 20,
          fontColor: "white",
        },
        legend: {
          display: true,
          position: false,
        },
        animation: {
          duration: 1000,
        },
        tension: 0,
      },
    },
  });
}

console.log(resultList);

function fetchData(timePeriod,typestock) {
 
let stockBtnContainer = document.getElementById("stock-btnContainer");
let button = stockBtnContainer.querySelectorAll("button");
for(let stockButton of button){
  stockButton.addEventListener("click",()=>{
    displayChart(timePeriod, stockButton.value);
    displayStockDetails(stockButton.value);
  })
}

  displayChart(timePeriod, stockList[0]);
}

fetchData("1mo",stockList[0]);
