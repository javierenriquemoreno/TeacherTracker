import React from 'react';

const DateTime = () => {
	const [ weekday, day, month, hour, minute, dayPeriod ] = Intl.DateTimeFormat('es-VE', {
		day: "2-digit",
		month: "long",
		hour: "2-digit",
		minute: "2-digit",
		weekday: 'long' 
	})
	.formatToParts(new Date()).filter(({ type }) => type !== 'literal')
	.map(({ type, value }) => {
		if (['weekday', 'month'].includes(type)) return `${value[0].toUpperCase()}${value.slice(1)}`;
		if (type === 'dayPeriod') return value.replaceAll('.', '').replace(' ', '');
		
		return value;
	});

	return (
		<div className='dateTime'>
			<div>
				<time>{ day } de { month }</time>
				<time>{ hour }:{ minute } { dayPeriod.toUpperCase() }</time>
			</div>
			<span>{ weekday }</span>
		</div>
	);
};

export default DateTime;