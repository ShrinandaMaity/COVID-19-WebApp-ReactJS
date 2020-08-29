import React, { useState } from 'react';
import { IconButton, Collapse } from '@material-ui/core';
import { prettyPrintStat } from './util';
import './TablE.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
                    hi {countryName} {index+1}
                </Collapse>
            </div>
        </div>
    )
}

export default TablE;
