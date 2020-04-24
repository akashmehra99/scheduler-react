import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';
import SchedulerCalender from './components/SchedulerCalender';

const jsx = (
    <React.Fragment>
        <SchedulerCalender />
    </React.Fragment>
);

ReactDOM.render(jsx, document.getElementById('app'));
