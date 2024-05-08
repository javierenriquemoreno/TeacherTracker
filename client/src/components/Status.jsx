import React from 'react';

const Status = ({ status }) => {
	const statuses = {
		0: <><span className='bullet gray'>•</span> Ausente</>,
		1: <><span className='bullet yellow'>•</span> Ocupado</>,
		2: <><span className='bullet lightBlue'>•</span> En una reunión</>,
		3: <><span className='bullet purple'>•</span> En camino</>,
		4: <><span className='bullet green'>•</span> En el aula</>,
		5: <><span className='bullet red'>•</span> Fuera</>
	};

	return (
		<div className='status'>
			{ statuses[status] }
		</div>
	);
};

export default Status;