import React, { useState, useEffect} from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgba(0,0,0,1)",
      borderColor: "rgba(255,255,255,1)",
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
          ticks: {
            fontColor: 'white',
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");  
            },
            fontColor: 'white',
          },
        },
      ],
    },
  };

const buildChartData = (data, casesType, country) => {
  let chartData = [];
  let lastDataPoint;
  if(country!='worldwide') {
    data=data.timeline;
  }
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType='cases', duration='120', className, country='worldwide' }) {
    const [data, setData] = useState({});
    const [x, setX] = useState("rgba(204, 16, 52, 0.5)");
    const [y, setY] = useState("#CC1034");

    useEffect(() => {
      let URL=`https://disease.sh/v3/covid-19/historical/all?lastdays=${duration}`;
      if(country!='worldwide')
        URL=`https://disease.sh/v3/covid-19/historical/${country}?lastdays=${duration}`;
      const fetchData = async () => {
        await fetch(URL)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let chartData = buildChartData(data, casesType, country);
            setData(chartData);
          });
      };
      casesType === 'recovered'
      ? setX("rgba(0, 200, 0, 0.5)")
      : setX("rgba(204, 16, 52, 0.5)");
      casesType === 'recovered'
      ? setY("#00CC00")
      : setY("#CC1034");
  
      fetchData();
    }, [casesType, duration, country]);
  
    return (
      <div className={className}>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: x,
                  borderColor: y,
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    );
  }

export default LineGraph;
