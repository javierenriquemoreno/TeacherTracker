import React from 'react';
import SignUp from '@illustrations/SignUp';
import { RegisterForm } from '@sections';

export const Register = () => {
	return (
		<section className='landing__auth register'>
			<SignUp />
			<RegisterForm />
		</section>
	);
};