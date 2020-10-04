// const axios = require('axios');

import axios from 'axios';
import {showAlert} from "./alert";

export const login =  async (email, password) => {
	try {
		console.log(email);
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: {
				email,
				password
			}
		});
		if (res.data.status === 'success') {
			showAlert('success','Logged in successfully');
			window.setTimeout(() => {
				location.assign('/');
			}, 3000);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
		window.setTimeout(() => {
			location.assign('/');
		}, 3000);
	}
};

export const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: 'http://127.0.0.1:3000/api/v1/users/logout'
		});
		if ((res.data.status = 'success')){
			showAlert('success', 'Logged out successfully');
			window.setTimeout(() => {
				location.assign('/');
			}, 3000);

				// location.reload(true);
		}
	} catch (err) {
		console.log(err.response);
		showAlert('error', 'Error logging out! Try again.');
	}
};





