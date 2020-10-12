import axios from 'axios';
import { showAlert } from './alert';

// export const updateUserData = async (data) => {
// 	try {
// 		const url = '/api/v1/users/updateMe';
//
// 		const res = await axios({
// 			method: 'PATCH',
// 			url,
// 			data
// 		});
//
// 		if (res.data.status === 'success') {
// 			showAlert('success', `Your user data was updated successfully!`);
// 		}
// 	} catch (err) {
// 		showAlert('error', err.response.data.message);
// 	}
// };

export const updateUserData = async (data) => {
	try {
		const url = '/api/v1/users/updateMe';

		const res = await axios({
			method: 'PATCH',
			url,
			data
		});

		if (res.data.status === 'success') {
			showAlert('success', `Your user data was updated, reload the page to check the changes!`, 4);
		}
	} catch (err) {
		showAlert('error', err.response.data.message,4);
	}
};

export const updateUserPassword = async (passwordCurrent, password, passwordConfirm) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: '/api/v1/users/updatemypassword',
			data: {
				passwordCurrent,
				password,
				passwordConfirm
			}
		});

		if (res.data.status === 'success') {
			showAlert('success', `Your user data was updated successfully!`,2);
		}

	} catch (err) {
		showAlert('error', err.response.data.message, 2);
	}
};

//type is either 'password' or 'data'
// export const updateSettings = async (data, type) => {
// 	console.log(`data in updateSettings: ${data}`);
//
// 	try {
// 		const url =
// 			type === 'password'
// 				? 'http://127.0.0.1:3000/api/v1/users/updatemypassword'
// 				: 'http://127.0.0.1:3000/api/v1/users/updateMe';
// 		const res = await axios({
// 			method: 'PATCH',
// 			url,
// 			data
// 		});
//
// 		if (res.data.status === 'success') {
// 			showAlert('success', `Your user ${type} updated successfully!`,2);
// 		}
// 	} catch (err) {
// 		showAlert('error', err.response.data.message,2);
// 	}
// };
