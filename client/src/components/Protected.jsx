import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GlobalState } from "@/GlobalState";
import Loading from '@components/Loading';

const Protected = ({ to, auth, role, children }) => {
	const state = useContext(GlobalState);
	const location = useLocation();
	const { loading: loadingTools, userAPI } = state;
	const [ loading ] = loadingTools;
	const { user: [ user],isLogged: [ isLogged ] } = userAPI;
	const home = location.pathname === "/";
	const protectedPath = location.pathname === to;

	if (loading) return <Loading size="150" color="var(--rose-500)" stroke="5" />;
	if (!auth && isLogged) return <Navigate to={to} replace/>;
	if (!isLogged && auth && !home && !protectedPath) return <Navigate to={to} replace/>;
	if (role && role !== user.type) return <Navigate to={to} replace/>;
	
	return children;
};

export default Protected;