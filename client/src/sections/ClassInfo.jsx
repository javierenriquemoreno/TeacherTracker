import React, { useState } from 'react';
import TrackingList from '@components/TrackingList';
import StudentsList from '@components/StudentsList';
import { Route, UserGroup } from '@icons';

export const ClassInfo = ({ role, classData, handlers }) => {
	const { handleState, handleDelete } = handlers;
	const [ option, setOption ] = useState("tracking");
	const { students, statuses } = classData;

	const options = [
		{
			label: "tracking",
			title: "Seguimiento",
			Icon: Route,
			content: <TrackingList statuses={ statuses } role={ role } handleState={ handleState } />
		},
		{
			label: "students",
			title: "Estudiantes",
			Icon: UserGroup,
			content: <StudentsList students={ students } role={ role } handleDelete={ handleDelete } />
		}
	];

	return (
		<section className='classInfo'>
			<div className="classInfo__sideBar">
				{
					options.map(({ label, title, Icon }) =>
						<button
							key={ label }
							className={ `classInfo__sideBar--options ${option === label ? 'active' : ''}` }
							onClick={() => setOption(label)}
						>
							<Icon />
							{ title }
						</button>
					)
				}
			</div>
			<div className="classInfo__content">
				{ options.find(opt => opt.label === option)?.content }
			</div>
		</section>
	);
};