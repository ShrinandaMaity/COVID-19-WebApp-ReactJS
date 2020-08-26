import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent, Button } from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import LineGraph from './LineGraph';
import './TablE.css';
import './ToggleSwitch.css'
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
  const [date, setDate] = useState(0);
  const [lineType, setLineType] = useState('daily');

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

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
                active={casesType === "cases"}
                onClick={(e) => setCasesType('cases')}
                title="Coronavirus Cases" 
                cases={countryInfo.todayCases} 
                total={countryInfo.cases}
                casesType="cases"
              />
              <InfoBox
                active={casesType === "recovered"}
                onClick={(e) => setCasesType('recovered')}
                title="Recovered" 
                cases={countryInfo.todayRecovered} 
                total={countryInfo.recovered}
                casesType="recovered"
                Totalcases={countryInfo.cases}
              />
              <InfoBox
                active={casesType === "active"}
                onClick={(e) => setCasesType('active')}
                title="Active Cases"
                cases={countryInfo.todayCases-countryInfo.todayDeaths-countryInfo.todayRecovered}
                total={countryInfo.active}
                casesType="active"
                Totalcases={countryInfo.cases}
              />
              <InfoBox
                active={casesType === "deaths"}
                onClick={(e) => setCasesType('deaths')}
                title="Deaths" 
                cases={countryInfo.todayDeaths} 
                total={countryInfo.deaths}
                casesType="deaths"
                Totalcases={countryInfo.cases}
              />
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />

      </div>

      <Card className="app_right">
        <CardContent>
          <h3 className="table_title">Cases by country</h3>
          <div className="table_head">
              <tr>
                <td className="table_index">#</td>
                <td className="table_country">
                  Country
                  {
                    sortBy==='country'
                    ? <SortIcon className="sortButton" onClick={(e) => {setSortBy('country')}} style={{ color: "rgb(255,255,0)" }} />
                    : <SwapVertSharpIcon className="sortButton" onClick={(e) => {setSortBy('country')}} color="disabled"/>
                  }
                </td>
                <td className="table_cases">
                  Confirmed
                  {
                    sortBy==='cases'
                    ? <SortIcon className="sortButton" onClick={(e) => {setSortBy('cases')}} color="secondary" />
                    : <SwapVertSharpIcon className="sortButton" onClick={(e) => {setSortBy('cases')}} color="disabled"/>
                  }
                </td>
                <td className="table_recovered">
                  Recovered
                  {
                    sortBy==='recovered'
                    ? <SortIcon className="sortButton" onClick={(e) => {setSortBy('recovered')}} style={{ color: "rgb(173,255,47)" }}/>
                    : <SwapVertSharpIcon className="sortButton" onClick={(e) => {setSortBy('recovered')}} color="disabled"/>
                  }
                </td>
                <td className="table_deaths">
                  Deaths
                  {
                    sortBy==='deaths'
                    ? <SortIcon className="sortButton" onClick={(e) => {setSortBy('deaths')}} style={{ color: "rgb(10,10,10)" }}/>
                    : <SwapVertSharpIcon className="sortButton" onClick={(e) => {setSortBy('deaths')}} color="disabled"/>
                  }
                </td>
              </tr>
            </div>
          <div className="table_body">
            {tableData.map((country, index) => (
                <tr>
                    <td className="table_index">{index+1}</td>
                    <td className="table_country">{country.country}</td>
                    <td className="table_cases">
                        <strong>{prettyPrintStat(country.cases)}</strong>
                    </td>
                    <td className="table_recovered">
                        <strong>{prettyPrintStat(country.recovered)}</strong>
                    </td>
                    <td className="table_deaths">
                        <strong>{prettyPrintStat(country.deaths)}</strong>
                    </td>
                </tr>
            ))}
          </div>
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
          <div className="app_graph">
            <LineGraph duration={duration} casesType={casesType} country={country} lineType={lineType}/>
          </div>
          <div class="switch switch-blue">
            <input type="radio" class="switch-input" onChange={(e) => {setLineType(e.target.value)}} name="lineType" value="daily" id="daily"/>
            <label for="daily" class="switch-label switch-label-off">Daily</label>
            <input type="radio" class="switch-input" onChange={(e) => {setLineType(e.target.value)}} name="lineType" value="cumulative" id="cumulative"/>
            <label for="cumulative" class="switch-label switch-label-on">Cumulative</label>
            <span class="switch-selection"></span>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
