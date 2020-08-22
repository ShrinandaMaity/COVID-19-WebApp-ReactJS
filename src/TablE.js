import React from 'react';
import './TablE.css';
import { prettyPrintStat } from "./util";

function TablE({ countries, sortBy='cases' }) {
    return (
        <div className="table">
            {countries.map((country) => (
                <tr>
                    <td>{country.country}</td>
                    <td>
                        <strong>{prettyPrintStat(country[sortBy])}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
}

export default TablE
