import React from 'react'
import './infoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core';


function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card
            // style={{backgroundColor: "#3399ff"}}
            onClick={props.onClick} 
            className={`infoBox ${!active && 'infoBox--notSelected'} ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent className="info_content">
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases_green"}`}>
                    +{cases}
                </h2>
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
