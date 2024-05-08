import { useState, useEffect } from 'react';
import axios from 'axios';

export function UserAPI(token, setLoading, setLogged) {
	const [ isLogged, setIsLogged ] = useState(false);
	const [ user, setUser ] = useState(null);

	const getUser = async token => {
		try {
			const { data } = await axios.get('/user/info', {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			if (success) {
				setUser(content);
				setIsLogged(true);
				setLogged(true);

				setLoading(false);
			};

			if (!success && content === 'El usuario no existe') {
				await axios.get('/user/logout', {
					headers: { Authorization: token }
				});
				localStorage.clear();
				window.location.href = '/login';
			};
		} catch (err) {
			console.log(err);
		};
	};

	useEffect(() => {
		if (token) getUser(token);
	}, [ token ]);

	return {
		user: [ user, setUser ],
		isLogged: [ isLogged, setIsLogged ]
	};
};