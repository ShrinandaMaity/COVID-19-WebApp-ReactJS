import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 800,
    },
    deaths: {
        hex: "#222222",
        multiplier: 2400,
    },
    active: {
        hex: "#1020ed",
        multiplier: 800,
    }
}

export const sortData = (data, sortBy='cases', sortOrder=1) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if(a[sortBy] > b[sortBy])
        {
            return (-1)*sortOrder;
        }
        else
        {
            return sortOrder;
        }
    })
    return sortedData;
};

export const prettyPrintStat = (stat) => 
    stat ? `${numeral(stat).format("0,0")}` : "0";

export const showDataOnMap = (data, casesType='cases') => (
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="infoFlagName">
                        <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                        ></div>
                        <div className="info-name">{country.country}</div>
                    </div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-active">Active: {numeral(country.active).format("0,0")}</div>
                    <div className="info-death">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
)