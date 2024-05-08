import React from 'react';

const MultiSelect = ({ className, list, selectedItems, handleClick }) => {

	return (
		<ul className={className}>
			{
				list?.map(({ label, content }) => 
					<li
						key={ label }
						onClick={ () => handleClick(label) }
						className={ selectedItems.includes(label) || selectedItems === label ? 'active' : '' }
					>
						{ content }
					</li>
				)
			}
		</ul>
	);
};

export default MultiSelect;