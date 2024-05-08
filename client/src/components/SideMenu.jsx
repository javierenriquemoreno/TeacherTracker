import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Home, Logout } from '@icons';
import { GlobalState } from '@/GlobalState';

const SideMenu = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const state = useContext(GlobalState);
	const { userAPI, coursesAPI, setLogged, token } = state;
	const { user: [ user, setUser ], isLogged: [ , setIsLogged ] } = userAPI;
	const { firstname, lastname, type } = user;
	const { courses: [ , setCourses ] } = coursesAPI;

	const types = {
		teacher: "Profesor",
		student: "Estudiante"
	};

	const pages = [
		{
			path: "app",
			name: "Inicio",
			Icon: Home
		}
	];

	const logout = async () => {
		try {
			await axios.get('/user/logout', {
				headers: { Authorization: token }
			});

			localStorage.clear();
			setCourses([]);
			setUser(null);
			setLogged(false);
			setIsLogged(false);
			navigate("/", { replace: true });
			return toast.success("¡Sesión cerrada correctamente!");
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	return (
		<header className="sideMenu">
			<h2>TeacherTracker</h2>
			
			<div className='sideMenu__user'>
				<h4>{ `${firstname} ${lastname}` }</h4>
				<span>{ types[type] }</span>
			</div>

			<nav>
				<ul>
					<div>
						{
							pages.map(({ path, name, Icon }) =>
								<li key={ path }>
									<Link
										onClick={e => {
											if (path === pathname) return e.preventDefault();
										}}
										to={ path }
										className={ `${ `/${path}` === pathname ? "active" : "" }` }
										aria-label={ name }
									>
										<div><Icon /></div>
										<span>{ name }</span>
									</Link>
								</li>
							)
						}
					</div>

					<li>
						<Link
							to='/'
							onClick={ logout }
							className='sideMenu__logout'
							aria-label='Cerrar sesión'
						>
							<div><Logout /></div>
							<span>Cerrar sesión</span>
						</Link>
					</li>

				</ul>
			</nav>

		</header>
	);
};

export default SideMenu;