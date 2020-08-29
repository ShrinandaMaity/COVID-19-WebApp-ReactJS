import React, { useState } from 'react';
import { IconButton, Collapse, Card, CardContent, Typography } from '@material-ui/core';
import { prettyPrintStat } from './util';
import './TablE.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import UpdateIcon from '@material-ui/icons/Update';

export const CardCollapse = (country) => {
    let d = new Date(country.updated);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <div>
            <Card>
                <CardContent>
                    <div className="card_row0">
                        <div className="updated_icon"><UpdateIcon fontSize="small"/></div>
                        <div className="updated_time">{d.getDate()} {months[d.getMonth()]}, {d.toLocaleTimeString()}</div>
                    </div>
                    <div className="card_row1">
                        <div className="card_continent">
                            <div className="card_data continent_data">{country.continent}</div>
                            <div className="card_heading continent">Continent</div>
                        </div>
                        <div className="card_population">
                            <div className="card_data todayCases_data">{country.population}</div>
                            <div className="card_heading population">Population</div>
                        </div>
                    </div>
                    <div className="card_row2">
                        <div className="card_todayCases">
                            <div className="card_data todayCases_data">{country.todayCases}</div>
                            <div className="card_heading todayCases">Cases Today</div>
                        </div>
                        <div className="card_todayDeaths">
                            <div className="card_data todayDeaths_data">{country.todayDeaths}</div>
                            <div className="card_heading todayDeaths">Deaths Today</div>
                        </div>
                        <div className="card_todayRecovered">
                            <div className="card_data todayRecovered_data">{country.todayRecovered}</div>
                            <div className="card_heading todayRecovered">Recovered Today</div>
                        </div>
                    </div>
                    <div className="card_row3">
                        <div className="card_active">
                            <div className="card_data active_data">{country.active}</div>
                            <div className="card_heading active_cases">Active Cases</div>
                        </div>
                        <div className="card_critical">
                            <div className="card_data critical_data">{country.critical}</div>
                            <div className="card_heading critical_cases">Critical Cases</div>
                        </div>
                        <div className="card_tests">
                            <div className="card_data tests_data">{country.tests}</div>
                            <div className="card_heading tests_cases">Tests</div>
                        </div>
                    </div>
                    <div className="card_row4">
                        <div className="card_casesPM">
                            <div className="card_data casesPM_data">{country.casesPerOneMillion}</div>
                            <div className="card_heading casesPM">cases/M</div>
                        </div>
                        <div className="card_deathsPM">
                            <div className="card_data deathsPM_data">{country.deathsPerOneMillion}</div>
                            <div className="card_heading deathsPM">deaths/M</div>
                        </div>
                        <div className="card_testsPM">
                            <div className="card_data testsPM_data">{country.testsPerOneMillion}</div>
                            <div className="card_heading testsPM">Tests/M</div>
                        </div>
                        <div className="card_activePM">
                            <div className="card_data activePM_data">{country.activePerOneMillion}</div>
                            <div className="card_heading activePM">Active/M</div>
                        </div>
                        <div className="card_recoveredPM">
                            <div className="card_data recoveredPM_data">{country.recoveredPerOneMillion}</div>
                            <div className="card_heading recoveredPM">Recovered/M</div>
                        </div>
                        <div className="card_criticalPM">
                            <div className="card_data criticalPM_data">{country.criticalPerOneMillion}</div>
                            <div className="card_heading criticalPM">Critical/M</div>
                        </div>
                    </div>
                    <div className="card_row5">
                        <div className="card_oneCasePerPeople">
                            <div className="card_data oneCasePerPeople_data">{country.oneCasePerPeople}</div>
                            <div className="card_heading oneCasePerPeople">1 Case/People</div>
                        </div>
                        <div className="card_oneDeathPerPeople">
                            <div className="card_data oneDeathPerPeople_data">{country.oneDeathPerPeople}</div>
                            <div className="card_heading oneDeathPerPeople">1 Death/People</div>
                        </div>
                        <div className="card_oneTestPerPeople">
                            <div className="card_data oneTestPerPeople_data">{country.oneTestPerPeople}</div>
                            <div className="card_heading oneTestPerPeople">1 Test/People</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

function TablE({country, countryName, index, openCollapse='', ...props}) {
    return (
        <div className="row_body">
            <tr className={`table_body_row ${index%2==1?'row_even':'row_odd'}`}>
                <td className="table_index">{index+1}</td>
                <td className="table_country">
                {countryName}
                <IconButton className="table_arrow" onClick={props.onClick}>
                    {
                    countryName===openCollapse
                    ? <KeyboardArrowUpIcon style={{color: "rgba(200,200,200,0.8)"}} />
                    : <KeyboardArrowDownIcon style={{color: "rgba(200,200,200,0.8)"}}/>
                    }
                </IconButton>
                </td>
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
            <div>
                <Collapse in={countryName===openCollapse} timeout='auto' unmountOnExit>
                    {CardCollapse(country)}
                </Collapse>
            </div>
        </div>
    )
};

export default TablE;
