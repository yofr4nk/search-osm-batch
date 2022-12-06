const axios = require('axios');
const {buildPlaceParam, buildOptions} = require('./utils');
const mainURI = 'https://nominatim.openstreetmap.org/search/';

function batchSearch(places, options) {
    return Promise.all(places.map(place => fetchOSMPlaces(buildPlaceParam(place), options)))
        .then(locations => {
            return locations.flat(places.length);
        });
}

function fetchOSMPlaces(place, options) {
    const queryStringOpts = buildOptions(options);
    return axios.get(`${mainURI}${place}?${queryStringOpts}`)
        .then(response => response.data)
        .catch(error => {
            console.error("error getting place: ", place, error);
            return [];
        })
}

module.exports = batchSearch;
