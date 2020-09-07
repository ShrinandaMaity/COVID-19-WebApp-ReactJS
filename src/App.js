import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, IconButton, TextField, Slide } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import LineGraph from './LineGraph';
import TablE from './TablE';
import Arrow from './Arrow';
import './TablE.css';
import './ToggleSwitch.css'
import { sortData, useStyles } from './util';
import "leaflet/dist/leaflet.css";
import SwapVertSharpIcon from '@material-ui/icons/SwapVertSharp';
import SortIcon from '@material-ui/icons/Sort';
import GitHubIcon from '@material-ui/icons/GitHub';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import StorageIcon from '@material-ui/icons/Storage';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34, lng: -40 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [duration, setDuration] = useState('120');
  const [date, setDate] = useState(0);
  const [yesterdayData, setYestetrdayData] = useState([]);
  const [twoDaysAgoData, setTwoDaysAgoData] = useState([]);
  const [sortBy, setSortBy] = useState('cases');
  const [sortOrder, setSortOrder] = useState(1);
  const [lineType, setLineType] = useState('daily');
  const [scale, setScale] = useState('linear');
  const [openCollapse, setOpenCollapse] = useState('');
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState('down');
  const classes = useStyles();

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });

    const getCountriesData = async () => 
    {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => 
      {
        let countriess = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso3,
          }
        ));
        countriess.unshift({name: 'Worldwide', value: 'Worldwide',});
        setTableData(sortData(data));
        setMapCountries(data);
        setCountries(countriess);
      });
    };

    const getYesterdayData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries?yesterday=1")
      .then((response) => response.json())
      .then((data) => {
        setYestetrdayData(data);
      });
    };

    const getTwoDaysAgoData =async () => {
      await fetch("https://disease.sh/v3/covid-19/countries?twoDaysAgo=1")
      .then((response) => response.json())
      .then((data) => {
        setTwoDaysAgoData(data);
      });
    };

    getCountriesData();
    getYesterdayData();
    getTwoDaysAgoData();
  }, []);

  useEffect(() => {
    if(lineType==='daily') {
      setScale('linear');
    }
  }, [lineType]);

  useEffect(() => {
    let y = date===0?mapCountries:date===1?yesterdayData:twoDaysAgoData;
    let x = sortData(y,sortBy,sortOrder);
    setTableData(x);
  }, [sortBy, sortOrder, date]);

  useEffect(() => {
    if(country==="Worldwide") {
      setMapCenter({ lat: 34.80746, lng: -40.4796 });
      setMapZoom(3);
    }
    else {
      setMapCenter({ lat: countryInfo.countryInfo.lat, lng: countryInfo.countryInfo.long });
      setMapZoom(4);
    }

  }, [country]);

  const onArrowClick = (direction) => {
    const increment = direction==='left'?1:-1;
    const oppDirection = direction==='left'?'right':'left';
    setSlideDirection(direction);
    setSlideIn(false);
    setTimeout(() => {
      setDate((date+increment)%3);
      setSlideDirection(oppDirection);
      setSlideIn(true);
    },700);
  };

  const onCountryChange = async (name) => {
    const url = name === "Worldwide" 
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${name}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setCountry(name);
    })
  };

  const onSortChange = async (event) => {
    if(event.target.value===sortBy) {
      setSortOrder((-1)*sortOrder);
    }
    else {
      setSortOrder(1);
      setSortBy(event.target.value);
    }
  };

  return (
    <div className="app">
      <div className="app_left_right">
        <div className="app_left">

          <div className="app_header">

            <h1>
              COVID-19 Info
            </h1>

            <Autocomplete className="dropdown"
              classes={classes}
              fullWidth
              id="country-select-demo"
              style={{width: 260}}
              options={countries}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(e,name) => {
                if(name!==null && name.name!==null) {
                  onCountryChange(name.name);
                }
              }}
              renderOption={(option) => (
                <div className="render">
                  <div className="country_name">{option.name}</div>
                </div>
              )}
              renderInput={(params) => (
                <TextField className="textField"
                  {...params}
                  label="Select a country"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />

          </div>

          <div className="app_stats">
                <InfoBox
                  active={casesType === "cases"}
                  onClick={(e) => setCasesType('cases')}
                  title="Confirmed" 
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
                  title="Active"
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
            <div className="table_heading">
              <h3 className="table_title">Cases by country</h3>
              <Slide in={slideIn} direction={slideDirection} mountOnEnter>
                <h4 className="table_date">{date===0?'Today':date===1?'Yesterday':'2 days ago'}</h4>
              </Slide>
            </div>
            <div className="table_head">
              <tr>
                <td className="table_index">#</td>
                <td className="table_country">
                  Country
                  <input type="radio" className="switch-input" value="country" onClick={onSortChange} id="country" />
                  <label for="country">
                  {
                    sortBy!=='country'
                    ? <SwapVertSharpIcon  className="sortButton" color="disabled"/>
                    : sortOrder===1
                    ? <SortIcon className="sortButton" style={{ color: "rgb(255,255,0)" }} />
                    : <SortIcon className="sortButton_rotate" style={{ color: "rgb(255,255,0)" }} />
                  }
                  </label>
                </td>
                <td className="table_cases">
                  Confirmed
                  <input type="radio" className="switch-input" value="cases" onClick={onSortChange} id="cases" />
                  <label for="cases">
                    {
                      sortBy!=='cases'
                      ? <SwapVertSharpIcon className="sortButton" color="disabled"/>
                      : sortOrder===1
                      ? <SortIcon className="sortButton" color="secondary" />
                      : <SortIcon className="sortButton_rotate" color="secondary" />
                    }
                  </label>
                </td>
                <td className="table_recovered">
                  Recovered
                  <input type="radio" className="switch-input" value="recovered" onClick={onSortChange} id="recovered" />
                  <label for="recovered">
                    {
                      sortBy!=='recovered'
                      ? <SwapVertSharpIcon className="sortButton" color="disabled"/>
                      : sortOrder===1
                      ? <SortIcon className="sortButton" style={{ color: "rgb(173,255,47)" }}/>
                      : <SortIcon className="sortButton_rotate" style={{ color: "rgb(173,255,47)" }}/>
                    }
                  </label>
                </td>
                <td className="table_deaths">
                  Deaths
                  <input type="radio" className="switch-input" value="deaths" onClick={onSortChange} id="deaths" />
                  <label for="deaths">
                    {
                      sortBy!=='deaths'
                      ? <SwapVertSharpIcon className="sortButton" color="disabled"/>
                      : sortOrder===1
                      ? <SortIcon className="sortButton" style={{ color: "rgb(10,10,10)" }}/>
                      : <SortIcon className="sortButton_rotate" style={{ color: "rgb(10,10,10)" }}/>
                    }
                  </label>
                </td>
              </tr>
            </div>
            <div className="card_swipe">
              <Arrow 
                name={`swipe_arrow${date!==2?'':'_disable'}`}
                direction='left'
                clickFunction={() => {if(date!==2){onArrowClick('left')}}}
              />
              <Slide className="card_today" in={slideIn} direction={slideDirection} mountOnEnter>
                <Card className="card_today">
                  <div className="table_body">
                    {tableData.map((country, index) => (
                        <TablE
                          countryName={country.country}
                          country={country} 
                          index={index} 
                          openCollapse={openCollapse} 
                          onClick={(e) => {country.country===openCollapse?setOpenCollapse(''):setOpenCollapse(country.country);}}/>
                      ))
                    }
                  </div>
                </Card>
              </Slide>
              <Arrow 
                name={`swipe_arrow${date!==0?'':'_disable'}`}
                direction='right'
                clickFunction={() => {if(date!==0){onArrowClick('right')}}}
              />
            </div>
            <div className="app_graphSettings">
                  <h3 className="app_graphTitle" >{casesType} ({country})</h3>
              <div className="duration_toggle">

                <Button 
                  variant={`${duration==='120'? 'contained': 'text'}`}
                  className={`${duration==='120'? 'active': 'inactive'}`}
                  color="primary" 
                  onClick={(e) => setDuration('120')}>
                    120 days
                </Button>
                <Button 
                  variant={`${duration==='60'? 'contained': 'text'}`} 
                  className={`${duration==='60'? 'active': 'inactive'}`} 
                  color="primary" 
                  onClick={(e) => setDuration('60')}>
                    60 days
                </Button>
                <Button 
                  variant={`${duration==='30'? 'contained': 'text'}`} 
                  className={`${duration==='30'? 'active': 'inactive'}`} 
                  color="primary" 
                  onClick={(e) => setDuration('30')}>
                    30 days
                </Button>
              </div>
            </div>
            <div className="graph_list">
              <div className="line_graph">
                <div className="app_graph">
                  <LineGraph duration={duration} casesType={casesType} country={country} lineType={lineType} scale={scale}/>
                </div>
                <div>
                  <div class="switch switch-blue">
                    <input type="radio" class="switch-input" onChange={(e) => {setLineType(e.target.value)}} name="lineType" value="daily" id="daily"/>
                    <label for="daily" class="switch-label switch-label-off">Daily</label>
                    <input type="radio" class="switch-input" onChange={(e) => {setLineType(e.target.value)}} name="lineType" value="cumulative" id="cumulative"/>
                    <label for="cumulative" class="switch-label switch-label-on">Cumulative</label>
                    <span class="switch-selection"></span>
                  </div>
                  <div className="toggle_scale">
                    <Button 
                      variant='contained'
                      className={`scale_button ${scale==='linear'?'active_button':'inactive_button'}`}
                      color={`${scale==='linear'?'primary':'secondary'}`}
                      onClick={(e) => setScale('linear')}>
                        Linear
                    </Button>
                    <Button 
                      variant='contained'
                      className={`scale_button ${lineType==='daily'?'hide_button':scale==='linear'?'inactive_button':'active_button'}`}
                      color={`${lineType==='daily'?'disabled':scale==='linear'?'secondary':'primary'}`}
                      onClick={(e) => setScale('logarithmic')}>
                        Logarithmic
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="app_links">
        <IconButton>
          <a href="https://github.com/kaustaav/COVID-19-WebApp-ReactJS"><GitHubIcon className="link_github" color="primary" fontSize="large" /></a>
        </IconButton>
        <IconButton>
          <a href="https://disease.sh/docs/#/"><StorageIcon color="primary" style={{ fontSize: 45 }} className="link_api" /></a>
        </IconButton>
        <IconButton>
          <a href="mailto:kaustavbhattacharya@gmail.com"><MailOutlineIcon color="primary" style={{ fontSize: 45 }} className="link_mail"/></a>
        </IconButton>
        <IconButton>
          <a href="https://www.linkedin.com/in/kaustav-bhattacherjee-795a2114a/"><LinkedInIcon color="primary" style={{ fontSize: 45 }} className="link_li" /></a>
        </IconButton>
      </div>
      
    </div>
  );
}

export default App;
