import React from 'react';
import { useState, useRef, useEffect } from 'react';

export default function Timer (props) {
    const [timer , setTimer] = useState(props.maxRange);

    useEffect(() => {
        if(timer === 0 ) {
            props.setTimeDone(true);
            return
        }
        if(props.win || !props.gameActive) {return}
        setTimeout(() => {
            setTimer(timer-1000);
        }, 1000);
    }, [timer, props.win]);
    
    useEffect(() => {
        if(!props.gameActive) { return }
        setTimer(props.maxRange)
    }, [props.gameActive])

    const formatTime = (timeMS) => {
        let totalSeconds = parseInt(Math.floor(timeMS / 1000))
        let seconds = parseInt(totalSeconds % 60)
        return `${seconds}`
    }

    return (
        <div className="Timer">
            <h1>{formatTime(timer)}</h1>
        </div>
    );
}