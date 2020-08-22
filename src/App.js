import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent, Button } from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import TablE from "./TablE";
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";
import SwapVertSharpIcon from '@material-ui/icons/SwapVertSharp';
import SortIcon from '@material-ui/icons/Sort';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [duration, setDuration] = useState('120');
  const [sortBy, setSortBy] = useState('cases');

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, [])

  useEffect(() => {
  
    const getCountriesData = async () => 
    {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => 
      {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso3,
          }
        ));
        const sortedData = sortData(data,sortBy);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, [sortBy]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" 
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      countryCode === "worldwide"
      ? setMapCenter([34.80746, -40.4796])
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      countryCode === "worldwide"
      ? setMapZoom(3)
      : setMapZoom(4);
    })
  };

  return (
    <div className="app">

      <div className="app_left">

        <div className="app_header">

          <h1>
            COVID-19 Tracker
          </h1>

          <FormControl variant="filled" className="app_dropdown">
            <Select className="select_dropdown" variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem className="dropdown_item" value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                <MenuItem className="dropdown_item" value={country.name}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </div>

        <div className="app_stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType('cases')}
                title="Coronavirus Cases" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={prettyPrintStat(countryInfo.cases)}
              />
              <InfoBox
                active={casesType === "recovered"}
                onClick={(e) => setCasesType('recovered')}
                title="Recovered" 
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={prettyPrintStat(countryInfo.recovered)}
              />
              <InfoBox
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCasesType('deaths')}
                title="Deaths" 
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                total={prettyPrintStat(countryInfo.deaths)}
              />
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />

      </div>

      <Card className="app_right">
        <CardContent>
          <div className="tableHead_buttons">
            <h3 className="table_title">{sortBy=='cases'?'Cases':sortBy=='deaths'?'Deaths':'Recoveries'} by country</h3>
            <div className="table_sortBy">
              <Button 
                className={`sortby ${sortBy=='cases'?'sortBy_cases':''}`} 
                onClick={(e) => {setSortBy('cases')}}>
                <div>
                  {
                    sortBy=='cases'
                    ? <SortIcon className="sortButton" color="secondary" />
                    : <SwapVertSharpIcon className="sortButton" color="secondary"/>
                  }
                  <div className="sort_tag">cases</div>
                </div>
              </Button>
              <Button 
                className={`sortby ${sortBy=='recovered'?'sortBy_recovered':''}`}
                onClick={(e) => {setSortBy('recovered')}}>
                <div>
                  {
                    sortBy=='recovered'
                    ? <SortIcon className="sortButton" style={{ color: "rgb(173,255,47)" }}/>
                    : <SwapVertSharpIcon className="sortButton" style={{ color: "rgb(173,255,47)" }}/>
                  }
                  <div className="sort_tag">recovered</div>
                </div>
              </Button>
              <Button 
                className={`sortby ${sortBy=='deaths'?'sortBy_deaths':''}`}
                onClick={(e) => {setSortBy('deaths')}}>
                <div>
                  {
                    sortBy=='deaths'
                    ? <SortIcon className="sortButton" style={{ color: "red" }}/>
                    : <SwapVertSharpIcon className="sortButton" style={{ color: "red" }}/>
                  }
                  <div className="sort_tag">deaths</div>
                </div>
              </Button>
            </div>
          </div>
          <TablE countries={tableData} sortBy={sortBy} />
          <div className="app_graphSettings">
                <h3 className="app_graphTitle" >{casesType} ({country})</h3>
            <div className="duration_toggle">

              <Button 
                variant={`${duration==='120'? 'contained': 'outlined'}`}
                className={`${duration==='120'? 'active': 'inactive'}`}
                color="primary" 
                onClick={(e) => setDuration('120')}>
                  120 days
              </Button>
              <Button 
                variant={`${duration==='60'? 'contained': 'outlined'}`} 
                className={`${duration==='60'? 'active': 'inactive'}`} 
                color="primary" 
                onClick={(e) => setDuration('60')}>
                  60 days
              </Button>
              <Button 
                variant={`${duration==='30'? 'contained': 'outlined'}`} 
                className={`${duration==='30'? 'active': 'inactive'}`} 
                color="primary" 
                onClick={(e) => setDuration('30')}>
                  30 days
              </Button>
            </div>
          </div>
          <LineGraph className="app_graph" duration={duration} casesType={casesType} country={country}/>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
