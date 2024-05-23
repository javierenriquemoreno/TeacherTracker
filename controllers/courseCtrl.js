const { DateTime, Interval } = require("luxon");
const { customAlphabet } = require('nanoid');
const randomString = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10);
const Course = require("../models/courseModel");
const User = require('../models/userModel');

const courseCtrl = {
	getCourses: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			const { type, _id } = user;

			const courses = await Course.find( type === 'teacher' ? { teacher: _id } : { students: _id } )
				.populate(`students${type === 'student' ? ' teacher' : ''}`, '-email -password -type -createdAt -updatedAt -__v')
				.select(`${type === 'teacher' ? '-teacher ' : ''}-updatedAt -__v`);

			if (courses.length < 1) return res.json({
				status: 400,
				success: false,
				content: "No hay clases disponibles."
			});

			return res.json({
				status: 200,
				success: true,
				content: courses
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
	createCourse: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);

			if (user.type !== 'teacher') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { name, section, time, days } = req.body;

			if (!name) return res.json({
				status: 400,
				success: false,
				content: "El nombre de la clase es obligatorio."
			});

			if (!section) return res.json({
				status: 400,
				success: false,
				content: "La sección de la clase es obligatoria."
			});

			if (!time) return res.json({
				status: 400,
				success: false,
				content: "El horario de la clase es obligatorio."
			});

			const startTime = DateTime.fromFormat(time.startTime.trim(), "hh:mm");
			const endTime = DateTime.fromFormat(time.endTime.trim(), "hh:mm");

			// const { validStart, validEnd } = {
			// 	validStart: {
			// 		min: DateTime.fromFormat('07:00', "hh:mm"),
			// 		max: DateTime.fromFormat('15:30', "hh:mm")
			// 	},
			// 	validEnd: {
			// 		min: DateTime.fromFormat('07:30', "hh:mm"),
			// 		max: DateTime.fromFormat('16:30', "hh:mm")
			// 	}
			// };

			// if (startTime < validStart.min) return res.json({
			// 	status: 400,
			// 	success: false,
			// 	content: 'La hora de comienzo debe ser 7:00 AM o después.'
			// });

			// if (startTime > validStart.max) return res.json({
			// 	status: 400,
			// 	success: false,
			// 	content: 'La hora de comienzo debe ser 3:30 PM o antes.'
			// });

			// if (endTime < validEnd.min) return res.json({
			// 	status: 400,
			// 	success: false,
			// 	content: 'La hora de finalización debe ser 7:30 AM o después.'
			// });

			// if (endTime > validEnd.max) return res.json({
			// 	status: 400,
			// 	success: false,
			// 	content: 'La hora de finalización debe ser 4:30 PM o antes.'
			// });

			if (!days?.length) return res.json({
				status: 400,
				success: false,
				content: "Los días de la clase son obligatorios."
			});

			const newCourse = new Course({
				name: name.trim(),
				section,
				time: {
					startTime: time.startTime.trim(),
					endTime: time.endTime.trim()
				},
				days: days.map(day => day.trim()),
				teacher: user._id,
				code: randomString(6)
			});

			await newCourse.save();

			return res.json({
				status: 200,
				success: true,
				content: "La clase se ha creado con éxito."
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
	deleteCourse: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);

			if (user.type !== 'teacher') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { id } = req.params;

			const course = await Course.findById(id)
				.populate('teacher', 'email -_id');

			if (!course) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			if (user.email !== course.teacher.email) return res.json({
				status: 400,
				success: false,
				content: "Acción inválida."
			});

			await Course.findByIdAndDelete(id);

			return res.json({
				status: 200,
				success: true,
				content: "Clase eliminada exitosamente."
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
	addStatus: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);

			if (user.type !== 'teacher') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { id } = req.params;

			const course = await Course.findById(id);

			const date = DateTime.now().setZone('America/Caracas');
			const todayWeekday = date.toLocaleString({ weekday: 'long' });
			const startTime = DateTime.fromFormat(course.time.startTime, 'hh:mm').setZone('America/Caracas');
			const endTime = DateTime.fromFormat(course.time.endTime, 'hh:mm').setZone('America/Caracas');

			// console.log(`Fecha actual (locale: ${date.locale}): ${date.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })}`);
			// console.log(`Fecha de inicio de la clase (locale: ${startTime.locale}): ${startTime.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })}`);
			// console.log(`Fecha de finalización de la clase (locale: ${endTime.locale}): ${endTime.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })}`);
			// console.log(Interval.fromDateTimes(startTime, endTime).toLocaleString({ dateStyle: 'long', timeStyle: 'long' }));
			// console.log(Interval.fromDateTimes(startTime, endTime).contains(date));

			// const debugString = `
			// Fecha actual (locale: ${date.locale}): ${date.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })},
			// Fecha de inicio de la clase (locale: ${startTime.locale}): ${startTime.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })},
			// Fecha de finalización de la clase (locale: ${endTime.locale}): ${endTime.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })},
			// Intervalo resultante: ${Interval.fromDateTimes(startTime, endTime).toLocaleString({ dateStyle: 'long', timeStyle: 'long' })},
			// ¿La fecha actual (${date.toLocaleString({ dateStyle: 'long', timeStyle: 'long' })}) esta dentro del intervalo?: ${Interval.fromDateTimes(startTime, endTime).contains(date)}
			// `;

			// console.log(debugString);

			if (!course) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const { type } = req.body;

			if (isNaN(Number(type))) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			if (!course.days.includes(todayWeekday)) return res.json({
				status: 400,
				success: false,
				content: 'No puedes actualizar el estado fuera de los días académicos.'
			});

			if (!Interval.fromDateTimes(startTime, endTime).contains(date)) return res.json({
				status: 400,
				success: false,
				content: 'No puedes actualizar el estado fuera de las horas académicas.'
			});

			if (date.day === DateTime.fromISO(course.statuses[0]?.date).day && course.statuses[0]?.type === type) return res.json({
				status: 400,
				success: false,
				content: 'El estado ya esta actualizado'
			});

			course.statuses.unshift({
				type,
				date: date.toString()
			})

			await course.save();

			return res.json({
				status: 200,
				success: true,
				content: "Estado actualizado exitosamente."
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
	joinCourse: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			
			if (user.type !== 'student') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { code } = req.body;

			if (!code) return res.json({
				status: 400,
				success: false,
				content: 'Código inválido.'
			});

			const course = await Course.findOne({ code });

			if (!course) return res.json({
				status: 400,
				success: false,
				content: 'Código inválido.'
			});

			if (course.students.includes(user._id)) return res.json({
				status: 400,
				success: false,
				content: 'Ya estas en esta clase.'
			});

			if (course.students.length === 30) return res.json({
				status: 400,
				success: false,
				content: 'Esta clase ya no admite más estudiantes.'
			});
			
			await Course.findOneAndUpdate({ code }, {
				$push: { students: user._id }
			});

			return res.json({
				status: 200,
				success: true,
				content: "Ingresaste a la clase exitosamente."
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
	exitCourse: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			
			if (user.type !== 'student') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { id } = req.params;

			const course = await Course.findOne({ _id: id, students: user._id });

			if (!course) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});
			
			await Course.findOneAndUpdate({ _id: id, students: user._id }, {
				$pull: { students: user._id }
			});

			return res.json({
				status: 200,
				success: true,
				content: "Saliste de la clase exitosamente."
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
	deleteStudent: async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			
			if (user.type !== 'teacher') return res.json({
				status: 400,
				success: false,
				content: "No tienes autorización para realizar esta acción."
			});

			const { id } = req.params;
			const { studentId } = req.body;

			if (!studentId) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const course = await Course.findOne({ _id: id, teacher: user._id, students: studentId });

			if (!course) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});
			
			await Course.findOneAndUpdate({ _id: id, teacher: user._id, students: studentId }, {
				$pull: { students: studentId }
			});

			return res.json({
				status: 200,
				success: true,
				content: "Estudiante expulsado de la clase exitosamente."
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

module.exports = courseCtrl;