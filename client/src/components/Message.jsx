import React from 'react';

const Message = ({ content }) => {
	const { head, description, element } = content;

	return (
		<article className='message'>

			<header>{ head }</header>

			<p>{ description }</p>

			{ element }

		</article>
	);
};

export default Message;