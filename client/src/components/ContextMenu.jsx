import React, { useLayoutEffect, useState } from 'react';
import Loading from '@components/Loading';

/**
 * @param {{
 * 		points: { x: number, y: number },
 * 		data: {
 * 			type: string,
 *			label: string;
 *			content: string;
 *			action: () => void;
 *		}[],
 *		contextRef: MutableRefObject<undefined>,
 *		setClicked: import('react').Dispatch<import('react').SetStateAction<boolean>>
 * }} options 
 * @returns 
 */
const ContextMenu = ({ points, data, contextRef, setClicked }) => {
	const [ loading, setLoading ] = useState(false);
	const [ coords, setCoords ] = useState({
		x: points.x,
		y: points.y
	});

	useLayoutEffect(() => {
		if (contextRef.current) {
			const { width, height } = contextRef.current.getBoundingClientRect();

			setCoords({
				x: points.x > window.innerWidth - width ? points.x - width : points.x,
				y: points.y > window.innerHeight - height ? points.y - height : points.y
			});
		}
	}, [ points ]);

	return (
		<div
			style = {{
				'--x': coords.x,
				'--y': coords.y
			}}
			className = 'contextMenu'
			ref = { contextRef }
		>
			{
				data.map(({ type, label, content, action }, ind) =>
					type !== 'separator' ?
						<div
							className = { `contextMenu__optionContainer ${loading ? 'disabled' : ''}` }
							onClick = {async e => {
								if (loading) return e.preventDefault();

								setLoading(true);

								await action();

								setLoading(false);
								setClicked(false);
							}}
							key = { `${label}_key${ind}` }
						>
							<span className='option'>
								{ content }
								{ loading ? <Loading size={12} stroke={1.5} color="var(--rose-500)" /> : null }
							</span>
						</div>
					:
						<div className="separator" key = { `${type}_key${ind}` } />
				)
			}
		</div>
	);
};

export default ContextMenu;