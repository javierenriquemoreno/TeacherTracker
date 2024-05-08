import React from 'react';
import { LoginForm } from '@sections';
import SignIn from '@illustrations/SignIn';

export const Login = () => {
	return (
		<section className='landing__auth login'>
			<LoginForm />
			<SignIn />
		</section>
	);
};