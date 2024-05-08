import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'luxon';
import toast from 'react-hot-toast';
import { GlobalState } from '@/GlobalState';
import Loading from '@components/Loading';

export const NewClassForm = () => {
	const navigate = useNavigate();
	const state = useContext(GlobalState);
	const { token, coursesAPI: { courses, postCourses } } = state;
	const [ ,, getCourses ] = courses;
	const [ loading, setLoading ] = useState(false);
	const [ postData, setPostData ] = useState({
		name: '',
		section: '',
		days: [],
		time: {
			startTime: '',
			endTime: ''
		}
	});

	const validForm = Boolean(postData.name && postData.section && postData.days.length && postData.time.startTime && postData.time.endTime);

	const handleSubmit = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);
		e.preventDefault();

		if (!postData.section) {
			setLoading(false);
			return toast.error("¡Selecciona al menos una sección!");
		}

		if (!postData.days.length) {
			setLoading(false);
			return toast.error("¡Selecciona al menos un día de la semana!");
		}

		try {
			const { success, content } = await postCourses(postData);

			if (!success) {
				setLoading(false);
				toast.error(content);
			};

			if (success) {
				await getCourses();
				navigate('/app', { replace: true });
				setLoading(false);
				return toast.success(content);
			};
		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) toast.error(content);
		};
	};

	const onChangeInput = e => {
		const { name, value } = e.target;
		setPostData({ ...postData, [name]: value });
	};

	const onChangeTime = e => {
		const { name, value } = e.target;
		setPostData({ ...postData, time: { ...postData.time, [name]: value.trim() } });
	};

	return (
		<form onSubmit={ handleSubmit }>
			<fieldset>
				<legend>Crea una clase</legend>
				<h1>Crea una clase</h1>

				<div className='form__fields'>

					<div className="form__fields--field">
						<label htmlFor="name">Nombre</label>
						<input
							type="text"
							name="name"
							id='name'
							value={ postData.name }
							placeholder='Programación II'
							onChange={ onChangeInput }
							minLength="3"
							required
						/>
					</div>

					<div className="form__fields--field select">
						<label htmlFor="name">Sección</label>
						<ul>
							{
								[ 1, 2, 3 ].map(section =>
									<li
										key={ `section${section}` }
										onClick={e => {
											setPostData({ ...postData, section });
										}}
										className={ postData.section === section ? 'active' : '' }
									>
										{ section }
									</li>
								)
							}
						</ul>
					</div>

					<div className="form__fields--field select">
						<label htmlFor="name">Días de la semana</label>
						<ul>
							{
								Info.weekdays('long', { locale: 'es-VE' }).slice(0, 5).map(weekday =>
									<li
										key={ weekday }
										onClick={e => {
											setPostData({
												...postData,
												days: postData.days.includes(weekday) ?
													[ ...postData.days.filter(wd => wd !== weekday) ]
												:
													[ ...postData.days, weekday ]
											});
										}}
										className={ postData.days.includes(weekday) ? 'active' : '' }
									>
										{ weekday }
									</li>
								)
							}
						</ul>
					</div>

					<div className="form__fields--field time">
						<label htmlFor="startTime">Horario</label>
						<div>
							<input
								type="time"
								name="startTime"
								id='startTime'
								min="07:00"
								max="15:30"
								value={ postData.time.startTime }
								onChange={ onChangeTime }
								required
							/>
							-
							<input
								type="time"
								name="endTime"
								id='endTime'
								min="07:30"
								max="16:30"
								value={ postData.time.endTime }
								onChange={ onChangeTime }
								required
							/>
						</div>
					</div>

				</div>

				<div className='form__footer'>
					<button type='submit' className={loading || !validForm ? 'disabled' : null}>
						<span>
							{ loading ? <Loading size="16" stroke="1.5" color="var(--rose-500)" /> : null }
							Crear Clase
						</span>
					</button>
				</div>
			</fieldset>
		</form>
	);
};