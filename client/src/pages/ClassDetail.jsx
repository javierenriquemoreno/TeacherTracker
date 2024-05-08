import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';
import { GlobalState } from '@/GlobalState';
import { HeaderApp, ClassInfo } from '@sections';
import Loading from '@components/Loading';
import Stat from '@components/Stat';
import TopBar from '@components/TopBar';
import Status from '@components/Status';
import Code from '@components/Code';
import MultiSelect from '@components/MultiSelect';
import { Cells, Clock, Edit, Logout, Satellite, SecurityPassword, Teacher, UserGroup } from '@icons';

const StatsList = ({ statsList }) => {
	return (
		<ul className='statsList'>
			{
				statsList.filter(stat => stat?.title).map(({ title, value }, ind) => 
					<Stat key={`stat-${ind}`}>
						<Stat.Title>{ title }</Stat.Title>
						<Stat.Value>{ value }</Stat.Value> 
					</Stat>
				)
			}
		</ul>
	);
};

const UpdateState = ({ id, addStatus, getCourses, setModal }) => {
	const [ selected, setSelected ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const stateList = [ 0, 1, 2, 3, 4, 5 ].reverse().map(status => ({ label: status, content: <Status status={ status } /> }));

	const handleClick = state => setSelected([ state ]);

	const handleState = async e => {
		if (loading || !selected.length) return e.preventDefault();
		
		setLoading(true);

		try {
			const { success, content } = await addStatus(id, selected[0]);

			if (success) {
				await getCourses();
				setModal(null);
				setLoading(false);
				toast.success(content);
			};
			if (!success) {
				setModal(null);
				setLoading(false);
				toast.error(content);
			};
		} catch (err) {
			if (err?.data && !err.data.success) {
				setModal(null);
				setLoading(false);
				toast.error(err.data.content);
			};
		}
	};

	return (
		<div className='dialog updateState'>
			<MultiSelect
				className="states"
				list={ stateList }
				selectedItems={ selected }
				handleClick={ handleClick }
			/>
			<button className={ `dialog__button ${ loading || !selected.length ? 'disabled' : null }` } onClick={handleState}>
				<span>
					{ loading ? <Loading size="14" stroke="1.5" color="var(--rose-500)" /> : null }
					Actualizar Estado
				</span>
			</button>
		</div>
	);
};

const DeleteStudent = ({ id, studentId, name, deleteStudent, getCourses, setModal }) => {
	const [ loading, setLoading ] = useState(false);

	const handleState = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);

		try {
			const { success, content } = await deleteStudent(id, studentId);

			if (success) {
				await getCourses();
				setModal(null);
				setLoading(false);
				return toast.success(content);
			};

			if (!success) {
				setModal(null);
				setLoading(false);
				return toast.error(content);
			};
		} catch (err) {
			if (err?.data && !err.data.success) {
				setModal(null);
				setLoading(false);
				toast.error(err.data.content);
			};
		}
	};

	const handleCancel = async e => {
		setModal(null);
	};

	return (
		<div className='dialog confirmModal'>
			<p>¿Seguro quiere eliminar a <strong>{ name }</strong> de la clase?</p>

			<div className='confirmModal__buttons'>

				<button className="dialog__button cancel" onClick={handleCancel}>Cancelar</button>

				<button className={ `dialog__button ${ loading ? 'disabled' : null }` } onClick={handleState}>
					<span>
						{ loading ? <Loading size="14" stroke="1.5" color="var(--rose-500)" /> : null }
						Confirmar
					</span>
				</button>

			</div>

		</div>
	);
};

const ExitCourse = ({ id, exitCourse, getCourses, setModal }) => {
	const navigate = useNavigate();
	const [ loading, setLoading ] = useState(false);

	const handleState = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);

		try {
			const { success, content } = await exitCourse(id);

			if (success) {
				await getCourses();
				setModal(null);
				navigate('/app', { replace: true });
				setLoading(false);
				return toast.success(content);
			};

			if (!success) {
				setModal(null);
				setLoading(false);
				return toast.error(content);
			};
		} catch (err) {
			if (err?.data && !err.data.success) {
				setModal(null);
				setLoading(false);
				toast.error(err.data.content);
			};
		}
	};

	const handleCancel = async e => {
		setModal(null);
	};

	return (
		<div className='dialog confirmModal'>
			<p>¿Seguro quieres salir de la clase?</p>

			<div className='confirmModal__buttons'>

				<button className="dialog__button cancel" onClick={handleCancel}>Cancelar</button>

				<button className={ `dialog__button ${ loading ? 'disabled' : null }` } onClick={handleState}>
					<span>
						{ loading ? <Loading size="14" stroke="1.5" color="var(--rose-500)" /> : null }
						Confirmar
					</span>
				</button>

			</div>

		</div>
	);
};

export const ClassDetail = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const [ localState, setLocalState ] = useState(location.state || {});
	const { course } = localState;
	const state = useContext(GlobalState);
	const { userAPI, coursesAPI, modal: [ , setModal ] } = state;
	const { user: [ user ] } = userAPI;
	const { type } = user;
	const { courses: [ courses, , getCourses ], addStatus, deleteStudent, exitCourse } = coursesAPI;

	useEffect(() => {
		getCourses();
	}, []);
	
	useEffect(() => {
		if (courses.length && params) {
			const courseFound = courses.find(item => item._id === params.id);
			if (courseFound) return setLocalState({...localState, course: courseFound});
			return navigate('/');
		};
	}, [ params.id, courses ]);
	
	if (!Object.keys(localState).length) return <Loading size="150" color="var(--rose-500)" stroke="5" />;

	const { _id: id, name, section, time, teacher, students, statuses } = course;

	const { startTime: start, endTime: end } = time;

	const startTime = DateTime.fromFormat(start, "hh:mm");
	const endTime = DateTime.fromFormat(end, "hh:mm");

	const studentsSorted = students?.sort((a, b) => {
		if (a?.lastname < b?.lastname) return -1;
		
		if (a?.lastname > b?.lastname) return 1;

		return 0;
	});

	const filteredStatuses = statuses.filter(({ _, date }) => {
		const statusDate = DateTime.fromISO(date);
		const today = DateTime.now();

		if (statusDate.day !== today.day) return false;

		return true;
	});

	const currentStatus = filteredStatuses[0]?.type ?? 0;

	const statsList = [
		type === 'student' ? 
				{
					title: <><Teacher /> <span>Profesor:</span></>,
					value: `${teacher.firstname} ${teacher.lastname}`
				}
			: 
				{}
		,
		{
			title: <><Satellite /> <span>Estado:</span></>,
			value: <Status status={ currentStatus } />
		},
		type === 'teacher' ? 
				{
					title: <><SecurityPassword /> <span>Código:</span></>,
					value: <Code code={ course.code } />
				}
			: 
				{}
		,
		{
			title: <><UserGroup /> <span>Estudiantes:</span></>,
			value: students.length
		},
		{
			title: <><Cells /> <span>Sección:</span></>,
			value: section
		},
		{
			title: <><Clock /> <span>Horario:</span></>,
			value: <time>{ startTime.toLocal().toFormat('hh:mm a') } - { endTime.toLocal().toFormat('hh:mm a') }</time>
		}
	];

	const handleState = () => {
		setModal({
			isOpen: true,
			children: <UpdateState id={ id } addStatus={ addStatus } getCourses={ getCourses } setModal={ setModal }/>,
			props: {
				hasCloseBtn: true
			}
		});
	};

	const handleDelete = (studentId, name) => {
		setModal({
			isOpen: true,
			children: <DeleteStudent id={ id } studentId={studentId} name={name} deleteStudent={ deleteStudent } getCourses={ getCourses } setModal={ setModal }/>,
			props: {
				hasCloseBtn: false
			}
		});
	};

	const handleExit = id => {
		setModal({
			isOpen: true,
			children: <ExitCourse id={ id } exitCourse={ exitCourse } getCourses={ getCourses } setModal={ setModal }/>,
			props: {
				hasCloseBtn: false
			}
		});
	};

	return (
		<>
			<HeaderApp>
				<HeaderApp.Title>{name}</HeaderApp.Title>
				{
					type === 'teacher' ?
						<HeaderApp.Button onClick={ handleState }>
							<Edit />
							Actualizar estado
						</HeaderApp.Button>
					:
						<HeaderApp.Button onClick={ () => handleExit(id) }>
							<Logout />
							Salir de la clase
						</HeaderApp.Button>
				}
			</HeaderApp>

			<TopBar>
				<StatsList statsList={ statsList } />
			</TopBar>

			<ClassInfo
				role={ type }
				classData={{ students: studentsSorted, statuses: filteredStatuses }}
				handlers={{ handleState, handleDelete }}
			/>
		</>
	);
};