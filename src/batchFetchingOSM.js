const BlueBird = require('bluebird');
const axios = require('axios');
const {flatten} = require('lodash');
const {buildPlaceParam, buildOptions} = require('./utils');
const mainURI = 'https://nominatim.openstreetmap.org/search/';

function batchSearch(places, options) {
	return BlueBird.map(places, place => {
		return fetchOSMplaces(buildPlaceParam(place), options);
	}, {concurrency: 5})
	.then(locations => {
		return flatten(locations);
	})
	.catch(err => {
		return BlueBird.reject(err);
	});
}

function fetchOSMplaces(place, options) {
	const queryStringOpts = buildOptions(options);
	return axios.get(`${mainURI}${place}?${queryStringOpts}`)
	.then(response => response.data);
}

module.exports = batchSearch;