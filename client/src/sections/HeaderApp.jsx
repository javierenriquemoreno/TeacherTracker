import React from 'react';
import { Link as ReactLink } from 'react-router-dom';

export const HeaderApp = ({ children }) => {
	return (
		<div className='headerApp'>
			{ children }
		</div>
	);
};

const Title = ({ children }) => {
	return <h3 className='headerApp__title'>{ children }</h3>;
};

const Link = ({ to, children }) => {
	return <ReactLink to={to} className='headerApp__button'>{ children }</ReactLink>;
};

const Button = ({ onClick, children }) => {
	return (
		<button
			className='headerApp__button'
			onClick={ onClick }
		>
			{ children }
		</button>
	);
};

HeaderApp.Title = Title;
HeaderApp.Link = Link;
HeaderApp.Button = Button;