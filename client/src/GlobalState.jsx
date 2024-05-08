import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserAPI, CoursesAPI  } from '@apis';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
	const [ modal, setModal ] = useState(null);
	const [ token, setToken ] = useState(false);
	const [ logged, setLogged ] = useState(false);
	const [ loading, setLoading ] = useState(true);

	const refreshToken = async () => {
		try {
			const res = await axios.get('/user/e229146b1984cd62e322005c53468c');
			const { data: { content: accessToken, success } } = res;

			if (success) setToken(accessToken);
		} catch (err) {
			const { response: { data: { content: msg } } } = err;
			console.log(msg);
			setLoading(false);
		};
	};

	useEffect(() => {
		const tryLogin = () => {
			const firstLogin = localStorage.getItem('firstLogin');
			if (firstLogin) return refreshToken();
			setLoading(false);
		};

		tryLogin();
	}, [ logged ]);

	const state = {
		userAPI: UserAPI(token, setLoading, setLogged),
		coursesAPI: CoursesAPI(token),
		setLogged,
		loading: [ loading, setLoading ],
		modal: [ modal, setModal ],
		token
	};

	return (
		<GlobalState.Provider value={state}>
			{ children }
		</GlobalState.Provider>
	);
};