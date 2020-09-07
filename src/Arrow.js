import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Arrow(props) {
    const {name, direction, clickFunction} = props;
    const icon = direction === 'left' ? <FaChevronLeft className={name}/>: <FaChevronRight className={name}/>;
    return <div onClick={clickFunction}>{icon}</div>;
};

export default Arrow;
