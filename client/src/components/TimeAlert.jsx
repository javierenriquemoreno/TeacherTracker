import React from 'react';
import { DateTime, Interval } from 'luxon';
import { Clock } from '@icons';

const formatDuration = duration => Object.entries(duration).reduce((prev, curr) => ({ ...prev, [curr[0]]: Math.ceil(curr[1]) }), {});

const TimeAlert = ({ days, time }) => {
	const { start, end } = time;

	const date = DateTime.now();
	const weekday = date.setLocale('es-VE').toLocaleString({ weekday: 'long' });
	
	if (!days.includes(weekday)) return;

	const startTime = DateTime.fromFormat(start, "hh:mm");
	const endTime = DateTime.fromFormat(end, "hh:mm");
	
	const startAt = formatDuration(Interval.fromDateTimes(date, startTime).toDuration(['hours', 'minutes']).toObject());
	const endsAt = formatDuration(Interval.fromDateTimes(date, endTime).toDuration(['hours', 'minutes']).toObject());

	const startSoon =
		startAt?.hours === 1 && startAt?.minutes === 0 ?
			'1h para empezar'
		: startAt?.minutes < 60 && startAt?.hours === 0 ? 
			`${startAt.minutes}m para empezar`
		: null;

	const inCourse = Interval.fromDateTimes(startTime, endTime).contains(date) ? 'En curso' : null;

	const ended = !Object.keys(endsAt).length ? 'Clase terminada' : null;

	return (
		<>
			{
				startSoon || inCourse || ended ?
					<div className="alert">
						<Clock />
						<span>{ startSoon ?? inCourse ?? ended }</span>
					</div>
				:
					null
			}
		</>
	);
};

export default TimeAlert;