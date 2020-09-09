import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 900,
    },
    deaths: {
        hex: "#222222",
        multiplier: 2400,
    },
    active: {
        hex: "#1020ed",
        multiplier: 900,
    }
}

export const sortData = (data, sortBy='cases', sortOrder=1) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if(a[sortBy] > b[sortBy]) {
            return (-1)*sortOrder;
        }
        else if(a[sortBy] < b[sortBy]) {
            return sortOrder;
        }
        else {
            return 0;
        }
    })
    return sortedData;
};

export const useStyles = makeStyles((theme) => ({
    popupIndicator: {
      color: 'white',
    },
    clearIndicator: {
      color: 'white',
    },
    listbox: {
      padding: '0 0',
      maxHeight: '400px',
    },
    inputRoot: {
      color: "rgb(255,255,255)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "green"
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "purple"
      }
    },
    option: {
      minHeight: 36,
      height: 36,
      fontSize: 14,
      padding: 0,
      '&[aria-selected="true"]': {
        background: 'linear-gradient(to right, #0f0542 18%, #330867 109%)',
      },
      '&[aria-selected="false"]': {
        background: 'linear-gradient(to right, #06021d 18%, #330867 109%)',
      },
      '&[data-focus="true"]': {
        background: 'linear-gradient(to right, #0f0542 18%, #330867 109%)',
      },
    },
    noOptions: {
      color: 'white',
      background: 'linear-gradient(to right, #06021d 18%, #330867 109%)',
      fontSize: 14,
    },
  }));

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
                Math.sqrt(Math.max(country[casesType],0))*casesTypeColors[casesType].multiplier
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
