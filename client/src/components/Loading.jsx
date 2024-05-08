import React from 'react';
import 'ldrs/ring';

const Loading = ({ size, stroke, color }) => {
	return (
		<l-ring
			size={ size }
			stroke={ stroke }
			bg-opacity="0"
			speed="2"
			color={ color }
		></l-ring>
	);
};

export default Loading;