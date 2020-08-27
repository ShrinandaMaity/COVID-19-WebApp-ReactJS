import React from 'react'
import './infoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core';
import { prettyPrintStat } from './util';


function InfoBox({ title, cases, active, casesType, Totalcases, total, ...props }) {
    const todayCases = cases>=0?`+${prettyPrintStat(cases)}`:`-${prettyPrintStat(-cases)}`;
    const percentage = ((total/Totalcases)*100).toFixed(1);
    return (
        <Card
            onClick={props.onClick} 
            className={`infoBox ${active?`todays--${casesType}`:'infoBox--notSelected'}`}>
            <CardContent className="info_content">
                <Typography className="infoBox_title" color="textSecondary">
                    {title} {Totalcases?`(${percentage}%)`:''}
                </Typography>
                <h2 className={`infoBox_${casesType}`}>
                    {todayCases}
                </h2>
                <Typography className="infoBox_total" color="textSecondary">
                    {prettyPrintStat(total)} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
