import { API } from 'boot/axios';

// Method To Register A New Teacher
const registerTeacher = async (payload) => {
    return await API.post("/register-teacher", payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// Method To Delete A Teacher
const deleteTeacher = async (payload) => {
    return await API.post("/delete-teacher", payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export { registerTeacher, deleteTeacher }