const express = require('express');
const parser = require('body-parser');
const lotin_kirill = require('lotin-kirill');
require('dotenv').config();


const app = express();
app.use(parser.json()) // for parsing application/json

const API_PATH = process.env.API_PATH || '';


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

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, HOST, () => {
	console.log(`Server listening on http://${HOST}:${PORT}`)
});