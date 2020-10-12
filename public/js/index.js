import '@babel/polyfill';
import {login, logout} from "./login";
import { updateUserData, updateUserPassword } from './updateSettings';
import { passwordReplace } from './forgotPassword';

const loginForm = document.querySelector('.login-form');
const logOutBtn = document.querySelector('.header-logout-button');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const forgotPasswordForm = document.querySelector('.forgot-form');

if (loginForm)
	loginForm.addEventListener('submit', e => {
		e.preventDefault();
		const email = document.getElementById('login-input-email').value;
		const password = document.getElementById('login-input-password').value;
		login(email, password);
	});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

// if (userDataForm)
// 	userDataForm.addEventListener('submit',  e=> {
// 		e.preventDefault();
// 		const email = document.getElementById('email').value;
// 		const firstName = document.getElementById('firstName').value;
// 		const lastName = document.getElementById('lastName').value;
// 		const photo = document.getElementById('photo').files[0];
// 		updateUserData(firstName, lastName, email, photo);
// 	});

if (userDataForm)
	userDataForm.addEventListener('submit',  e=> {
		e.preventDefault();

		const form = new FormData();
		form.append('firstName', document.getElementById('firstName').value);
		form.append('lastName', document.getElementById('lastName').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		updateUserData(form);

	});

if (userPasswordForm)
	userPasswordForm.addEventListener('submit', async e => {
		e.preventDefault();
		document.querySelector('#btn-new-password').textContent = 'Updating...';

		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateUserPassword(passwordCurrent, password, passwordConfirm);

		document.querySelector('#btn-new-password').textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});

if (forgotPasswordForm)
	forgotPasswordForm.addEventListener('submit', async e => {
		e.preventDefault();
		const email = document.getElementById('forgot-input-email').value;
		passwordReplace(email);
	});

