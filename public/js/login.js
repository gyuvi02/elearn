// const axios = require('axios');

// const login = async  (email, password) => {
//
// 	console.log(email, password);
// 		const res = await axios({
// 			method: 'POST',
// 			url: 'http://127.0.0.1:3000/api/v1/users/login',
// 			data: {
// 				email,
// 				password
// 			}
// 		});
// 		console.log(res);
// };


const login = async (email, password) => {
	console.log(email, password);
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: {
				email,
				password
			}
		});
		console.log(res);
	} catch (err) {
		console.log(err.response.data);
	}
};


document.querySelector('.login-btn').addEventListener('submit', e => {
	e.preventDefault();
	const email = document.getElementById('login-input-email').value;
	const password = document.getElementById('login-input-password').value;
	console.log(email);
	login(email, password).then();
})
