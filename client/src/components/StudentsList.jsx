import React from 'react';
import Message from '@components/Message';
import { Cancel } from '@icons';

const StudentsList = ({ students, role, handleDelete }) => {
	const message = {
		head: 'Aún no hay estudiantes en la clase.',
		description: 'Los estudiantes que se unan usando el código aparecerán aquí.',
		element: null
	};

	return (
		<div className='studentList'>
			{
				students?.length ?
					students.map(({ _id, firstname, lastname }) =>
						<div className='studentList__student' key={_id}>
							<span>{ lastname } { firstname }</span>
							{
								role === 'teacher' ?
									<button
										title='Eliminar estudiante'
										onClick={ () => handleDelete(_id, `${lastname} ${firstname}`) }
									>
										<Cancel />
									</button>
								:
									null
							}
						</div>
					)
				:
					<Message content={ message } />
			}
		</div>
	);
};

export default StudentsList;