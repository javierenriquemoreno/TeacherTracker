import { useState, useEffect } from 'react';

export const useFilters = (items, handleFilters, options) => {
	const [ selectedFilters, setSelectedFilters ] = useState(options?.initial  ? [ options.initial ] : []);
	const [ itemsFiltered, setItemsFiltered ] = useState(items);

	const handleClick = selectedFilter => {
		if (selectedFilter === options?.wildcard) return setSelectedFilters([ selectedFilter ]);

		if (selectedFilters.includes(selectedFilter)) {
			if (selectedFilters.length === 1) return;
			const filters = selectedFilters.filter(filter => filter !== selectedFilter);
			return setSelectedFilters(filters);
		};

		setSelectedFilters([ ...selectedFilters.filter(filter => filter !== options?.wildcard), selectedFilter ]);
	};

	const filterItems = () => {
		if (selectedFilters.length) {
			const filteredItems = items.filter(item => handleFilters(item, selectedFilters));

			return setItemsFiltered(filteredItems.flat());
		};

		setItemsFiltered([ ...items ]);
	};

	useEffect(() => {
		filterItems();
	}, [ items, selectedFilters ]);

	return [
		itemsFiltered,
		selectedFilters,
		handleClick
	];
};