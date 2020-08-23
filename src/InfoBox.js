import React from 'react'
import './infoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core';
import { prettyPrintStat } from './util';


function InfoBox({ title, cases, active, casesType, total, ...props }) {
    const todayCases = cases>=0?`+${prettyPrintStat(cases)}`:`-${prettyPrintStat(-cases)}`;
    console.log(todayCases);
    return (
        <Card
            onClick={props.onClick} 
            className={`infoBox ${active?`todays--${casesType}`:'infoBox--notSelected'}`}>
            <CardContent className="info_content">
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox_${casesType}`}>
                    {todayCases}
                </h2>
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
