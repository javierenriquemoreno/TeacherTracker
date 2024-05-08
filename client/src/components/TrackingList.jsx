import React from 'react';
import { DateTime } from 'luxon';
import Status from '@components/Status';
import Message from '@components/Message';

const TrackingList = ({ statuses, role, handleState }) => {
	const messages = {
		teacher: {
			head: 'Hoy aún no hay ninguna actualización de estado.',
			description: 'Cada actualización de estado que hagas hoy aparecerá aquí.',
			element: 
				<button
					onClick={ handleState }
					className='message__button'
				>
					Actualizar Estado
				</button>
		},
		student: {
			head: 'Hoy aún no hay ninguna actualización de estado.',
			description: 'Cada actualización de estado que el profesor haga hoy, aparecerá aquí.',
			element: null
		}
	};

	return (
		<div className='trackingList'>
			{
				statuses?.length ?
				statuses.map(({ type, date }, ind) => {
						const dateTime = DateTime.fromISO(date);
						const time = dateTime.toLocal().toFormat('hh:mm a');
						const weekDay = Intl.DateTimeFormat('es-VE', { weekday: 'long' }).format(new Date(date));
						const month = `${dateTime.setLocale('es-VE').monthLong[0].toUpperCase()}${dateTime.setLocale('es-VE').monthLong.slice(1)}`;

						return (
							<div key={ind} className='trackingList__track'>
								<Status status={type}/>
								<time>A las { time } del { `${weekDay[0].toUpperCase()}${weekDay.slice(1)}` } { dateTime.day } de { month }.</time>
							</div>
						);
					})
				:
					<Message content={ messages[role] } />
			}
		</div>
	);
};

export default TrackingList;