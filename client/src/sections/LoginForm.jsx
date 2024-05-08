import React, { useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GlobalState } from '@/GlobalState';
import Loading from '@components/Loading';
import {
	Email,
	SquareLockPassword,
	View,
	ViewOff
} from '@icons';

export const LoginForm = () => {
	const navigate = useNavigate();
	const state = useContext(GlobalState);
	const { setLogged } = state;
	const passwordRef = useRef(null);

	const [ loading, setLoading ] = useState(false);
	const [ showPass, setShowPass ] = useState(false);
	const [ user, setUser ] = useState({
		email: '',
		password: ''
	});

	const onChangeInput = e => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value.trim() });
	};

	const handleSubmit = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);
		e.preventDefault();

		try {
			const { data } = await axios.post('/user/login', { ...user });
			const { success, content } = data;

			if (!success) {
				setLoading(false);
				toast.error(content);
			};

			if (success) {
				localStorage.setItem('firstLogin', true);

				setLogged(true);
				navigate('/app', { replace: true });
				return toast.success("¡Sesión iniciada correctamente!");
			};
		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) toast.error(content);
		};
	};

	return (
		<form onSubmit={ handleSubmit }>
			<fieldset>
				<legend>Inicia sesión</legend>
				<h1>Inicia sesión</h1>

				<div className='form__fields'>

					<div className="form__fields--field">
						<input
							type="email"
							name="email"
							value={ user.email }
							placeholder='Correo electrónico'
							onChange={ onChangeInput }
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
							className={ `password ${user.password.length ? 'filled' : ''}` }
							value={ user.password }
							placeholder='Contraseña'
							onChange={ onChangeInput }
							onFocus={ e => e.currentTarget.selectionStart = e.currentTarget.value.length }
							minLength={ 6 }
							required
							ref={ passwordRef }
						/>
						<SquareLockPassword />
						<div
							className="input__showPassword"
							onClick={ () => setShowPass(!showPass) }
							onMouseUp={ e => e.preventDefault() }
							tabIndex="1"
						>
							{
								showPass ?
									<View />
								:
									<ViewOff />
							}
						</div>
					</div>

				</div>

				<div className='form__footer'>
					<button type='submit' className={loading ? 'loading' : null}>
						<span>
							{ loading ? <Loading size="16" stroke="1.5" color="var(--rose-500)" /> : null }
							Iniciar sesión
						</span>
					</button>
					<p>¿No tienes una cuenta? <Link to='../register'>¡Crea una!</Link></p>
				</div>
			</fieldset>
		</form>
	);
};