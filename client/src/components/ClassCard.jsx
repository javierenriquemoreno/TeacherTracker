import React from 'react';
import { DateTime, Settings } from 'luxon';
import TimeAlert from '@components/TimeAlert';
import { UserGroup } from '@icons';

Settings.defaultLocale = 'en-US';

const ClassCard = ({ onContextMenu, course }) => {
	const { name, section, time, days, students } = course;
	const { startTime: start, endTime: end } = time;

	const startTime = DateTime.fromFormat(start, "hh:mm");
	const endTime = DateTime.fromFormat(end, "hh:mm");

	const onMouseEnter = (e, name) => {
		const { currentTarget } = e;
		const { title } = currentTarget;
		if (!title && currentTarget.offsetWidth < currentTarget.scrollWidth) currentTarget.setAttribute('title', name);
	};

	return (
		<article onContextMenu={onContextMenu}>

			<header>
				<h3 onMouseEnter={e => onMouseEnter(e, name)}>{ name }</h3>

				<div className="students">
					<UserGroup />
					<span>{ students.length } estudiantes</span>
				</div>

				<time>{ startTime.toLocal().toFormat('hh:mm a') } - { endTime.toLocal().toFormat('hh:mm a') }</time>

				<span>Sección: {section}</span>
			</header>

			<footer>
				<TimeAlert
					days={ days }
					time={{ start, end }}
				/>
			</footer>

		</article>
	);
};

export default ClassCard;