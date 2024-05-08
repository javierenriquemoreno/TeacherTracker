const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
	register: async (req, res) => {
		try {
			const { firstname, lastname, email, password, cpass, type } = req.body;

			if (!type) return res.json({
				status: 400,
				success: false,
				content: "El tipo de usuario es requerido."
			});

			if (firstname.length < 3) return res.json({
				status: 400,
				success: false,
				content: "El nombre debe tener como mínimo 3 caracteres de longitud."
			});

			if (lastname.length < 3) return res.json({
				status: 400,
				success: false,
				content: "El apellido debe tener como mínimo 3 caracteres de longitud."
			});

			if (!email) return res.json({
				status: 400,
				success: false,
				content: "El correo electrónico es requerido."
			});

			const user = await User.findOne({ email });
			if (user) return res.json({
				status: 400,
				success: false,
				content: "El correo electrónico ya existe."
			});

			if (password.length < 6) return res.json({
				status: 400,
				success: false,
				content: "La contraseña debe tener como mínimo 6 caracteres de longitud."
			});

			if (password !== cpass) return res.json({
				status: 400,
				success: false,
				content: "Las contraseñas deben ser iguales."
			});

			// Password encryption
			const passwordHash = await bcrypt.hash(password, 10);

			const data = {
				firstname,
				lastname,
				email,
				password: passwordHash,
				type
			};
			
			const newUser = new User(data);

			await newUser.save();

			return res.json({
				status: 200,
				success: true,
				content: "Se ha registrado exitosamente."
			});
		} catch (err) {
			const { message } = err;
			const error = {
				status: 500,
				success: false,
				content: message
			};
			return res.json(error);
		};
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			if (!email) return res.json({
				status: 400,
				success: false,
				content: "Correo requerido."
			});

			if (!password) return res.json({
				status: 400,
				success: false,
				content: "Contraseña requerida."
			});

			const user = await User.findOne({ email });

			if (!user) return res.json({
				status: 400,
				success: false,
				content: "Datos incorrectos."
			});

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) return res.json({
				status: 400,
				success: false,
				content: "Datos incorrectos."
			});

			// const accessToken = createAccessToken({id: user._id});
			const refreshToken = createRefreshToken({ id: user._id });

			res.cookie('e229146b1984cd62e322005c53468c', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
				path: '/user/e229146b1984cd62e322005c53468c',
				expires: new Date(Date.now() + (400 * 24 * 3600000))
			});

			return res.json({
				status: 200,
				success: true
			});
		} catch (err) {
			const { message } = err;
			const error = {
				status: 500,
				success: false,
				content: message
			};
			return res.json(error);
		};
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('e229146b1984cd62e322005c53468c', {
				path: '/user/e229146b1984cd62e322005c53468c'
			});

			return res.json({
				status: 200,
				success: true,
				content: "Logged out, cookies cleared."
			});
		} catch (err) {
			const { message } = err;
			const error = {
				status: 500,
				success: false,
				content: message
			};
			return res.json(error);
		};
	},
	refreshToken: async (req, res) => {
		try {
			const rf_token = req.cookies["e229146b1984cd62e322005c53468c"];
			if (!rf_token) {
				const error = {
					status: 400,
					success: false,
					content: "Please login or register."
				};

				console.error(error);
				return res.json(error);
			};
	
			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) {
					const error = {
						status: 400,
						success: false,
						content: "Please login or register."
					};
	
					console.error(error);
					return res.json(error);
				};

				const accessToken = createAccessToken({ id: user.id });

				res.json({
					status: 200,
					success: true,
					content: accessToken
				});
			});
		} catch (err) {
			const { message } = err;
			const error = {
				status: 500,
				success: false,
				content: message
			};
			return res.json(error);
		};
	},
	getInfo: async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select("-password -_id -__v -createdAt -updatedAt");
			if (!user) return res.json({
				status: 400,
				success: false,
				content: "El usuario no existe"
			});

			return res.json({
				status: 200,
				success: true,
				content: user
			});
		} catch (err) {
			const { message } = err;
			const error = {
				status: 500,
				success: false,
				content: message
			};
			return res.json(error);
		};
	}
};

const createAccessToken = user => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = user => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;