import { useState, useEffect } from 'react';
import axios from 'axios';

export function CoursesAPI(token) {
	const [ courses, setCourses ] = useState([]);

	const getCourses = async () => {
		try {
			const { data: { success, content } } = await axios.get('/api/courses', {
				headers: { Authorization: token }
			});

			setCourses(courses => [...(success ? content : [])]);
		} catch (err) {
			console.log(err.response.data.content);
		};
	};

	const delCourses = async id => {
		try {
			const { data } = await axios.delete(`/api/courses${id}/manage`, {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			console.log(err);
		}
	};

	const postCourses = async postData => {
		try {
			const { data } = await axios.post('/api/courses', { ...postData }, {
				headers: { Authorization: token }
			});
			
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			console.log(err);
		};
	};

	const addStatus = async (id, type) => {
		try {
			const { data } = await axios.patch(`/api/courses${id}/manage`, { type }, {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			return err;
		};
	};

	const joinCourse = async code => {
		try {
			const { data } = await axios.patch('/api/courses/join', { code }, {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			return err;
		};
	};

	const deleteStudent = async (id, studentId) => {
		try {
			const { data } = await axios.patch(`/api/courses${id}/student/delete`, { studentId }, {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			return err;
		};
	};

	const exitCourse = async id => {
		try {
			const { data } = await axios.patch(`/api/courses${id}/student/exit`, {}, {
				headers: { Authorization: token }
			});
			const { success, content } = data;

			return {
				success,
				content
			};
		} catch (err) {
			return err;
		};
	};

	useEffect(() => {
		if (token) getCourses();
	}, [ token ]);

	return {
		courses: [ courses, setCourses, getCourses ],
		delCourses,
		postCourses,
		addStatus,
		joinCourse,
		deleteStudent,
		exitCourse
	};
};