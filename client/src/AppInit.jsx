import React, { useEffect, useContext } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider, GlobalState } from '@/GlobalState';
import Protected from '@components/Protected';
import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import Modal from "@components/Modal";
import { App, ClassDetail, Landing, Login, NewClass, Register } from '@pages';

const ScrollToTop = ({ children }) => {
	const location = useLocation();
	
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [ location ]);

	return (
		<>
			{ children }
		</>
	);
};

const CustomOutlet = () => {
	const state = useContext(GlobalState);
	const { modal: [ modal, setModal ] } = state;

	return (
		<>
			{
				modal?.isOpen && modal?.children && modal?.props ?
					<Modal
						isOpen={ modal.isOpen }
						setModal={ setModal }
						{ ...modal.props }
					>
						{ modal.children }
					</Modal>
				:
					null
			}
			<Outlet />
		</>
	);
};

const CustomHeader = () => {
	const state = useContext(GlobalState);
	const { loading: loadingTools, userAPI } = state;
	const { isLogged: [ isLogged ] } = userAPI;
	const [ loading ] = loadingTools;
	
	if (loading) return;

	return (
		!isLogged ? <Header /> : <SideMenu />
	);
};

const AppLayout = () => {
	const location = useLocation();
	const { pathname } = location;
	const page =
		pathname === "/" ? "landing"
	: 
		[ "/register", "/login" ].includes(pathname) ? 'auth'
	:
		pathname.includes("app") ? "app"
	:
		pathname.replace("/", "");

	return (
		<DataProvider>
			<ScrollToTop>
				<Toaster
					position='bottom-right'
					toastOptions={{
						style: {
							background: "var(--ebonyClay-850)",
							color: "var(--white)",
							border: "1px solid var(--rose-500)"
						}
					}}
				/>
				<CustomHeader />
				<main className = { page }>
					<CustomOutlet key = { pathname } />
				</main>
			</ScrollToTop>
		</DataProvider>
	);
};

const router = createBrowserRouter([
	{
		element: (<AppLayout />),
		children: [
			{
				path: '/',
				element: <Protected to="/app" auth={false}> <Landing /> </Protected>
			},
			{
				path: '/register',
				element: <Protected to="/app" auth={false}> <Register /> </Protected>
			},
			{
				path: '/login',
				element: <Protected to="/app" auth={false}> <Login /> </Protected>
			},
			{
				path: '/app',
				element: <Protected to="/login" auth={true}> <App /> </Protected>
			},
			{
				path: '/app/new',
				element: <Protected to="/login" auth={true} role="teacher"> <NewClass /> </Protected>
			},
			{
				path: '/app/course/:id',
				element: <Protected to="/login" auth={true}> <ClassDetail /> </Protected>
			}
		]
	}
]);

function AppInit() {
	return <RouterProvider router={router} />;
};

export default AppInit;