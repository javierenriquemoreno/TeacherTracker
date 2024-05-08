import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '@components/Loading';
import { SecurityPassword } from '@icons';

const EnterCode = ({ joinCourse, getCourses, setModal }) => {
	const [ code, setCode ] = useState([ "", "", "", "", "", "" ]);
	const [ loading, setLoading ] = useState(false);
	const inputsRef = useRef([]);

	const handleJoin = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);
		e.preventDefault();

		try {
			const { success, content } = await joinCourse(code.join(''));

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

	const handlePaste = e => {
		e.preventDefault();

		const pasted = e.clipboardData.getData("text").trim();
		
		if (pasted.length !== inputsRef.current.length) return;

		setCode(pasted.split("").slice(0, code.length));

		inputsRef.current[inputsRef.current.length - 1]?.focus();
	};

	const handleChange = ind => {
		return e => {
			const value = e.currentTarget.value;
			const nextInput = inputsRef.current[ind + 1];

			setCode([ ...code.slice(0, ind), value, ...code.slice(ind + 1) ]);

			if (value.trim().length) return nextInput?.focus();
		};
	};

	const handleKeys = ind => {
		return e => {
			const { key: value } = e;
			const prevInput = inputsRef.current[ind - 1];
			const nextInput = inputsRef.current[ind + 1];

			if (value === 'Backspace') {
				if (code[ind].length === 0) {
					e.preventDefault();
					return prevInput?.focus();
				};
				return;
			};

			if (code[ind].length === 1) {
				e.preventDefault();
				return nextInput?.focus();
			};
		};
	};

	return (
		<div className='dialog enterCode'>

			<header>
				<SecurityPassword strokeWidth="1" />
			</header>
			
			<form onSubmit={ handleJoin }>
				<fieldset>

					<legend>Ingresa el código</legend>

					<div className='enterCode__form'>
						<p>Ingresa el código que el profesor de tu clase te envió.</p>
	
						<div className='enterCode__form--inputs'>
							{
								code.map((digit, ind) =>
									<input
										className='inputs__digit'
										key={ `digit-${ind}` }
										type="text"
										name={ ind }
										value={ digit }
										onPaste={ handlePaste }
										onChange={ handleChange(ind) }
										onKeyDown={ handleKeys(ind) }
										minLength="1"
										maxLength="1"
										required
										ref={ ref => inputsRef.current[ind] = ref }
									/>
								)
							}
						</div>
					</div>
					
					<button type="submit" className={ `dialog__button ${ loading ? 'disabled' : null }` }>
						<span>
							{ loading ? <Loading size="14" stroke="1.5" color="var(--rose-500)" /> : null }
							{ loading ? 'Uniéndose a la clase' : 'Agregar Clase' }
						</span>
					</button>

				</fieldset>
			</form>

		</div>
	);
};

export default EnterCode;