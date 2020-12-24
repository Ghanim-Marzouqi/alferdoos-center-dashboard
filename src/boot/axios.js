import Vue from 'vue';
import axios from "axios";

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.log("AXOIS ERROR", error.response);
    return Promise.reject(error.response);
});

const API = axios.create({
    baseURL: "https://us-central1-al-ferdoos-school.cloudfunctions.net/app"
});

Vue.prototype.$axios = API;

export { API }