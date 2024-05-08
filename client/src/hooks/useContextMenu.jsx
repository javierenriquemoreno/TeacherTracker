import { useState, useEffect, useRef } from "react";

export const useContextMenu = () => {
	const [ data, setData ] = useState(null);
	const [ clicked, setClicked ] = useState(false);
	const [ points, setPoints ] = useState({
		x: 0,
		y: 0,
	});
	const contextRef = useRef();

	useEffect(() => {
		const handleClick = e => {
			if (contextRef.current && contextRef.current.contains(e.target)) return;
			setClicked(false);
		};
		window.addEventListener("click", handleClick);
		
		return () => window.removeEventListener("click", handleClick);
	}, []);

	return {
		clicked,
		setClicked,
		points,
		setPoints,
		data,
		setData,
		contextRef
	};
};