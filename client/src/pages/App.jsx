import React, { useContext } from 'react';
import { GlobalState } from '@/GlobalState';
import { Classes, HeaderApp } from '@sections';
import DateTime from '@components/DateTime';
import EnterCode from '@components/EnterCode';
import Loading from '@components/Loading';
import { Add } from '@icons';

export const App = () => {
	const state = useContext(GlobalState);
	const { userAPI, coursesAPI, loading: [ loading ], modal: [ , setModal ] } = state;
	const { user: [ user ] } = userAPI;
	const { type } = user;
	const { courses: [ , , getCourses ], joinCourse } = coursesAPI;

	if (loading) return <Loading size="150" color="var(--rose-500)" stroke="5" />;

	const handleState = () => {
		setModal({
			isOpen: true,
			children: <EnterCode joinCourse={ joinCourse } getCourses={ getCourses } setModal={ setModal } />,
			props: {
				hasCloseBtn: true
			}
		});
	};

	return (
		<>
			<HeaderApp>

				<DateTime />

				{
					type === 'teacher' ?
						<HeaderApp.Link to="new">
							<Add />
							Nueva clase
						</HeaderApp.Link>
					:
						<HeaderApp.Button onClick={ handleState }>
							<Add />
							Agregar clase
						</HeaderApp.Button>
				}

			</HeaderApp>

			<Classes joinClass={ handleState } />
		</>
	);
};