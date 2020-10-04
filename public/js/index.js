import '@babel/polyfill';
import {login, logout} from "./login";
// import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.login-form');
const logOutBtn = document.querySelector('.header-logout-button');


if (loginForm)
	loginForm.addEventListener('submit', e => {
		console.log('valami tortent');
		e.preventDefault();
		const email = document.getElementById('login-input-email').value;
		const password = document.getElementById('login-input-password').value;
		console.log(email);
		login(email, password);
	});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

