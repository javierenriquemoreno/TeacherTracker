import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SquareLock, SquareUnlock } from '@icons';

const Code = ({ code }) => {
	const [ show, setShow ] = useState(false);

	const handleCopy = async () => {
		if (!show) return;

		try {
			await navigator.clipboard.writeText(code);
			toast.success("¡Código copiado!");
		} catch (err) {
			toast.error(err?.message);
		};
	};

	return (
		<div className={`code ${show ? 'show' : ''}`}>

			<code onClick={ handleCopy }>
				{ show ? code : '•'.repeat(code.length) }
			</code>

			<button
				onClick={ () => setShow(!show) }
				title={ show ? 'Ocultar' : 'Mostrar' }
			>
				{ show ? <SquareUnlock /> : <SquareLock /> }
			</button>

		</div>
	);
};

export default Code;