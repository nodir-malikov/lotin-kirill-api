const express = require('express');
const parser = require('body-parser');
const lotin_kirill = require('lotin-kirill');
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();


const app = express();
app.use(parser.json()) // for parsing application/json


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const DOMAIN = process.env.DOMAIN || '';
const API_PATH = process.env.API_PATH || '';

var host_url = `${HOST}:${PORT}`;

if (DOMAIN) {
	host_url = `${DOMAIN}`;
}

const api_doc = {
	info: {
		title: 'Lotin-Kirill API',
		description: 'Transliteration API for Uzbek Cyrillic and Latin alphabets',
	},
	host: `${host_url}`,
	schemes: ['http', 'https'],
	basePath: API_PATH,
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/server.js'];

exports.appPromise = new Promise(function (resolve, reject) {
	// this is the function that will be called before the app is started
	swaggerAutogen(outputFile, endpointsFiles, api_doc); // generate swagger docs
	// setting up the swagger-ui
	app.use(`${API_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(require('./src/swagger-output.json')));
	resolve(app); // resolve the promise
});

app.post(`${API_PATH}/latin`, (req, res) => {
	// get json data from request body
	const text = req.body.text;
	if (!text) {
		res.status(400).send({
			success: false,
			message: 'No text provided'
		});
		return;
	}
	// convert text to latin
	const latin = lotin_kirill.cyrillicToLatin(text);
	// send response with latin text
	res.status(200).send({
		success: true,
		result: latin
	});
});

app.post(`${API_PATH}/cyrill`, (req, res) => {
	// get json data from request body
	const text = req.body.text;
	if (!text) {
		res.status(400).send({
			success: false,
			message: 'No text provided'
		});
		return;
	}
	// convert text to cyrillic
	const cyrill = lotin_kirill.latinToCyrillic(text);
	// send response with cyrillic text
	res.status(200).send({
		success: true,
		result: cyrill
	});
});

// 404 handler
app.use(function (req, res) {
	res.status(404).send({
		success: false,
		message: 'Not found'
	});
});

app.listen(PORT, HOST, () => {
	console.log(`Server listening on http://${HOST}:${PORT}`)
});
