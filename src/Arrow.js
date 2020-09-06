import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Arrow(props) {
    const {direction, clickFunction} = props;
    const icon = direction === 'left' ? <FaChevronLeft className="swipe_arrow"/>: <FaChevronRight className="swipe_arrow"/>;
    return <div onClick={clickFunction}>{icon}</div>;
};

export default Arrow;
