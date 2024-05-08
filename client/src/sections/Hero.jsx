import React from 'react';
import { Link  } from 'react-router-dom';
import ScheduleMeeting from '@illustrations/ScheduleMeeting';
import CurvedUnderline from '@illustrations/CurvedUnderline';

export const Hero = () => {
	
	return (
		<>
			<article className='landing__info'>

				<header>
					<h1>
						El seguimiento preciso para aprender
						<CurvedUnderline />
					</h1>
					<p>Tu herramienta para gestionar con facilidad el seguimiento de los profesores.</p>
				</header>

				<footer>
					<Link to="register">Empezar</Link>
				</footer>

			</article>
			<ScheduleMeeting />
		</>
	);
};