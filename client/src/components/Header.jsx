import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
	const { pathname } = useLocation();

	const pages = [
		{
			path: "login",
			name: "Ingresar"
		}
	];

	return (
		<header className="headerLanding">
			<h2>
				<Link
					to=".."
					title="Inicio"
					className={ `${ pathname === '/' ? "active" : "" }` }
					aria-label="Inicio"
				>
					TeacherTracker
				</Link>
			</h2>
			<nav>
				<ul>
					{
						pages.map(({ path, name }) =>
							<li key={ path }>
								<Link
									to={ path }
									className={ `${ `/${path}` === pathname ? "active" : "" }` }
									aria-label={ name }
								>
									<span>{ name }</span>
								</Link>
							</li>
						)
					}
				</ul>
			</nav>
		</header>
	);
};

export default Header;