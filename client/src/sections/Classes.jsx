import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'luxon';
import toast from 'react-hot-toast';
import { GlobalState } from '@/GlobalState';
import { useContextMenu, useFilters } from '@hooks';
import ContextMenu from '@components/ContextMenu';
import MultiSelect from '@components/MultiSelect';
import Message from '@components/Message';
import ClassCard from '@components/ClassCard';
import Loading from '@components/Loading';
import TopBar from '@components/TopBar';

export const Classes = ({ joinClass }) => {
	const { clicked, setClicked, points, setPoints, data, setData, contextRef } = useContextMenu();
	const state = useContext(GlobalState);
	const { userAPI: { user: [ user ] }, coursesAPI: { courses: coursesTools, delCourses, exitCourse }, loading: [ loading ] } = state;
	const [ courses, , getCourses ] = coursesTools;
	const { type } = user;

	const handleFilters = (course, selectedFilters) => {
		const { days } = course;
		const weekday = Intl.DateTimeFormat('es-VE', { weekday: 'long' }).format(new Date());

		if (selectedFilters.includes("all")) return true;
		if (selectedFilters.includes("today") && days.includes(weekday)) return true;

		return selectedFilters.some(filter => days.includes(filter));
	};

	const filterList = [
		{
			label: 'all',
			content: "todas"
		},
		{
			label: 'today',
			content: "hoy"
		},
		...Info.weekdays('long', { locale: 'es-VE' }).slice(0, 5).map(weekday => ({ label: weekday, content: weekday }))
	];

	const [ itemsFiltered, selectedFilters, handleClick ] = useFilters(courses, handleFilters, {
		initial: filterList[0].label,
		wildcard: filterList[0].label
	});

	const messages = {
		teacher: {
			head: 'Aún no tienes ninguna clase',
			description: 'Cada clase que crees aparecerá aquí.',
			element: <Link to="new" className='message__button'>Crear una Clase</Link>
		},
		student: {
			head: 'Aún no te has unido a ninguna clase',
			description: 'Cada clase que agregues aparecerá aquí.',
			element: 
				<button
					onClick={ joinClass }
					className='message__button'
				>
					Unirte a una Clase
				</button>
		},
		notAvailable:{
			head: 'No hay clases en este día',
			description: 'Al parecer, no hay clases disponibles en el día que seleccionaste.',
			element: null
		}
	};

	const handleContextMenu = (e, id) => {
		e.preventDefault();

		const contextData = [
			type === 'teacher' ?
				{
					type: 'option',
					label: 'deleteClass',
					content: "Eliminar clase",
					action: async () => {
						try {
							const { success, content } = await delCourses(id);
							if (success) {
								await getCourses();
								toast.success(content);
							};
						} catch (err) {
							if (!err?.success) toast.error(err.content);
						}
					}
				}
			:
				{
					type: 'option',
					label: 'exitClass',
					content: "Salir de la clase",
					action: async () => {
						try {
							const { success, content } = await exitCourse(id);

							if (success) {
								await getCourses();
								toast.success(content);
							};
						} catch (err) {
							if (!err?.success) toast.error(err.content);
						}
					}
				}
		];

		setData(contextData);
		setClicked(true);
		setPoints({
			x: e.pageX,
			y: e.pageY,
		});
	};

	if (loading) return <Loading size="150" color="var(--rose-500)" stroke="5" />;

	return (
		<section className='classes'>
			{
				courses?.length ?
					<>
						<TopBar>
							<MultiSelect
								className="filters"
								list={ filterList }
								selectedItems={ selectedFilters }
								handleClick={ handleClick }
							/>
						</TopBar>

						<ul className='classes__list'>
							{
								itemsFiltered?.length ?
									itemsFiltered.map(course =>
										<li key={course._id}>
											<Link
												to={ `/app/course/${course._id}` }
												title={ `Ir a la clase ${course.name}` }
												aria-label={ `Clase ${course.name}` }
												state={{
													course
												}}
											>
												<ClassCard
													onContextMenu={ e => handleContextMenu(e, course._id) }
													course={course}
												/>
											</Link>
										</li>
									)
								:
									<Message content={ messages.notAvailable }/>
							}
					
							{
								clicked ?
									<ContextMenu
										points={points}
										data={data}
										contextRef={contextRef}
										setClicked={setClicked}
									/>
								:
									null
							}
						</ul>
					</>
				:
					<Message content={ messages[type] }/>
			}
		</section>
	);
};