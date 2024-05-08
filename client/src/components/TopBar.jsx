import React from 'react';

const TopBar = ({ children }) => {
	return (
		<div className='topBar'>
			{ children }
		</div>
	);
};

export default TopBar;