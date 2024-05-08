import React from 'react';

const Stat = ({ children }) => {
	return (
		<div className='stat'>
			{ children }
		</div>
	);
};

export default Stat;

const Title = ({ children }) => {
	return <h5 className='stat__title'>{ children }</h5>;
};

const Value = ({ children }) => {
	return <span className='stat__value'>{ children }</span>;
};

Stat.Title = Title;
Stat.Value = Value;