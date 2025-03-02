// Rest APIs for user authentication and registration
import { jwtDecode } from 'jwt-decode';

export const doLogin = (email, password) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});

	fetch('/api/auth/signin', {
		method: 'POST',
		body: JSON.stringify({
			username: email,
			password: password,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
		.then((response) => {
			response.json()
				.then((json) => {
					if (response.ok) {
						let token = response.headers.get('x-auth-token');
						if (token) {
							let decoded = jwtDecode(token); // ✅ Use `jwtDecode`
							promiseResolveRef({
								username: json.email,
								accessToken: token,
								accessTokenTimeout: decoded.exp * 1000, // Convert to epoch
								roles: json.roles,
								userId: json.id,
								response: response,
							});
						} else {
							promiseRejectRef({
								reason: 'No authentication token received.',
								response: response,
							});
						}
					} else {
						promiseRejectRef({
							reason: 'Server error occurred. Please try again.',
							response: response,
						});
					}
				})
				.catch(() => {
					promiseRejectRef({
						reason: 'Bad Credentials. Please try again.',
						response: response,
					});
				});
		})
		.catch((err) => {
			promiseRejectRef({
				reason: 'Some error occurred. Please try again.',
				response: err,
			});
		});

	return promise;
};

export const doSignup = (requestJson) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});

	fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify(requestJson),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
		.then((response) => {
			response.json()
				.then((json) => {
					if (response.ok) {
						promiseResolveRef({
							message: json.message,
							response: response,
						});
					} else {
						let message = json.message || 'Server error occurred. Please try again.';
						promiseRejectRef({
							reason: message,
							response: response,
						});
					}
				})
				.catch((err) => {
					promiseRejectRef({
						reason: 'Some error occurred. Please try again.',
						response: err,
					});
				});
		})
		.catch((err) => {
			promiseRejectRef({
				reason: 'Some error occurred. Please try again.',
				response: err,
			});
		});

	return promise;
};
