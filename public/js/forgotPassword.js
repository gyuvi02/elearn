import axios from 'axios';
import { showAlert } from './alert';
import {updateUserPassword} from "./updateSettings";


export const passwordReplace = async (email) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
			data: {
				email
			}
		});

		if (res.data.status === 'success') {
			showAlert('success', `Check your email`,3);
		}

	} catch (err) {
		showAlert('error', err.response.data.message, 3);
	}
};
