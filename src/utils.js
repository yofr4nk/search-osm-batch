const buildPlaceParam = function (place) {
	try {
		return place.replace(/ /g, '%20');
	} catch(err) {
		console.error("error parsing placeParam: ", place);
		console.error(err);

		return ""
	}
}

const buildOptions = function (options)  {
	let queryString = '';

	for(let key in options) {
		queryString += `&${key}=${options[key]}`;
	}
	return queryString;
}

module.exports = {
	buildPlaceParam,
	buildOptions
}
