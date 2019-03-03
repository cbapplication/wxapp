import axios from "axios";
import wepyAxiosAdapter from "wepy-plugin-axios/dist/adapter.js";

const ajax = axios.create({
	adapter: wepyAxiosAdapter(axios),
	baseURL: 'http://localhost:3000/',//API_BUSINESS_URL,
	headers: {
		"Content-Type": "application/json"
	},
	responseType: "json"
});

module.exports = ajax;
