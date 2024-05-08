import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@components/Loading';
import {
	ArrowDown,
	Email,
	Mentoring,
	PasswordValidation,
	SquareLockPassword,
	UserQuestion1,
	UserQuestion2,
	View,
	ViewOff
} from '@icons';

export const RegisterForm = () => {
	const navigate = useNavigate();
	const [ loading, setLoading ] = useState(false);
	const [ showPass, setShowPass ] = useState(false);
	const [ showCPass, setShowCPass ] = useState(false);
	const [ postData, setPostData ] = useState({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		cpass: '',
		type: 'student'
	});
	const [ openType, setOpenType ] = useState(false);
	const passwordRef = useRef(null);
	const cpassRef = useRef(null);

	const handleSubmit = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);
		e.preventDefault();

		try {
			const { data } = await axios.post('/user/register', { ...postData });
			const { success, content } = data;

			if (!success) {
				setLoading(false);
				toast.error(content);
			};

			if (success) {
				navigate('/login', { replace: true });
				setLoading(false);
				return toast.success("¡Se ha registrado correctamente!");
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

	const userTypeList = [
		{
			label: 'student',
			content: "Estudiante"
		},
		{
			label: 'teacher',
			content: "Profesor"
		}
	];

	const typeHandler = type => {
		setOpenType(!openType);
		setPostData({ ...postData, type });
	};

	return (
		<form
				onSubmit={ handleSubmit }
				autoComplete='off'
			>
				<fieldset>
					<legend>Crea una cuenta</legend>
					<h1>Crea una cuenta</h1>

					<div className='form__fields'>

						<div className="form__fields--field">
							<input
								type="text"
								name="firstname"
								value={ postData.firstname }
								placeholder='Nombre'
								onChange={ onChangeInput }
								minLength={3}
								required
							/>
							<UserQuestion2 />
						</div>

						<div className="form__fields--field">
							<input
								type="text"
								name="lastname"
								value={ postData.lastname }
								placeholder='Apellido'
								onChange={ onChangeInput }
								minLength={3}
								required
							/>
							<UserQuestion1 />
						</div>

						<div className="form__fields--field">
							<input
								type="email"
								name="email"
								value={ postData.email }
								placeholder='Correo electrónico'
								onChange={ onChangeInput }
								autoComplete='email'
								required
							/>
							<Email />
						</div>

						<div
							className="form__fields--field"
							onBlur={e => {
								e.preventDefault();
								if (e.relatedTarget && e.relatedTarget.classList.contains("input__showPassword")) passwordRef.current.focus();
							}}
						>
							<input
								type={ showPass ? 'text' : 'password' }
								name="password"
								className={ `password ${postData.password.length ? 'filled' : ''}` }
								value={ postData.password }
								placeholder='Contraseña'
								onChange={ onChangeInput }
								onFocus={e => e.currentTarget.selectionStart = e.currentTarget.value.length}
								autoComplete='new-password'
								minLength={6}
								required
								ref={passwordRef}
							/>
							<SquareLockPassword />
							<div className="input__showPassword" onClick={() => setShowPass(!showPass)} onMouseUp={e => e.preventDefault()} tabIndex="1">
								{
									showPass ?
										<View />
									:
										<ViewOff />
								}
							</div>
						</div>

						<div
							className="form__fields--field"
							onBlur={e => {
								e.preventDefault();
								if (e.relatedTarget && e.relatedTarget.classList.contains("input__showPassword")) cpassRef.current.focus();
							}}
						>
							<input
								type={ showCPass ? 'text' : 'password' }
								name="cpass"
								className={ `password ${postData.cpass.length ? 'filled' : ''}` }
								value={ postData.cpass }
								placeholder='Confirmar contraseña'
								onChange={ onChangeInput }
								onFocus={e => e.currentTarget.selectionStart = e.currentTarget.value.length}
								autoComplete='new-password'
								minLength={6}
								required
								ref={cpassRef}
							/>
							<PasswordValidation />
							<div className="input__showPassword" onClick={() => setShowCPass(!showCPass)} onMouseUp={e => e.preventDefault()} tabIndex="1">
								{
									showCPass ?
										<View />
									:
										<ViewOff />
								}
							</div>
						</div>

						<div className={`form__fields--field type ${openType ? 'expanded' : ''}`}>

							<span
								className='selected'
								title='Elije un tipo'
								onClick={() => setOpenType(!openType)}
							>
								{ userTypeList.find(type => type.label === postData.type).content }
								<Mentoring />
								<ArrowDown />
							</span>

							<ul className="list">
								{
									userTypeList.map(({ label, content }) => 
										<span key={label} onClick={() => typeHandler(label)}>{ content }</span>
									)
								}
							</ul>

						</div>

					</div>

					<div className='form__footer'>
						<button type='submit' className={ loading ? 'loading' : null }>
							<span>
								{ loading ? <Loading size="16" stroke="1.5" color="var(--rose-500)" /> : null }
								Crear cuenta
							</span>
						</button>
						<p>¿Tienes una cuenta? <Link to='../login'>¡Inicia sesión!</Link></p>
					</div>
				</fieldset>
			</form>
	);
};