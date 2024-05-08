import React, { useRef, useState, useEffect } from 'react';
import { Cancel } from '@icons';

/**
 * @typedef { object } ModalOptions
 * @property { boolean } isOpen
 * @property { boolean } [ hasCloseBtn = true ]
 * @property { () => void } [ onClose ]
 * @property { React.ReactNode } children
 */

/**
 * @param { ModalOptions } options 
 * @returns 
 */
const Modal = ({
	isOpen,
	setModal,
	hasCloseBtn = true,
	onClose,
	children
}) => {
	const [ modalOpen, setModalOpen ] = useState(false);

	
	/** @type { React.MutableRefObject<HTMLDialogElement> } */
	const dialogRef = useRef();

	const handleCloseModal = () => {
		if (onClose) onClose();
		setModal(null);
	};

	const handleKeyDown = e => {
		const { key } = e;
		if (key === "Escape") handleCloseModal();
	};

	useEffect(() => {
		setModalOpen(isOpen);
	}, [ isOpen ]);

	useEffect(() => {
		const modalElement = dialogRef.current;

		if (modalElement) {
			if (modalOpen) return modalElement.showModal();
			modalElement.close();
		};
	}, [ modalOpen ]);

	return (
		<dialog
			className = 'modal'
			onClick = { handleCloseModal }
			onKeyDown = { handleKeyDown }
			ref = { dialogRef }
		>
			<div onClick = { e => e.stopPropagation() }>
				{
					hasCloseBtn ?
						<button
							className='modal__close'
							onClick={ handleCloseModal }
						>
							<Cancel />
						</button>
					:
						null
				}

				{ children }
			</div>

		</dialog>
	);
};

export default Modal;