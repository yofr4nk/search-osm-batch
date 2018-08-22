const {exception, value} = require('unit.js');
const {buildPlaceParam, buildOptions} = require('../src/utils');

describe('UTILs function testing', () => {
	describe('buildPlaceParam replacing spaces with "%20" within places name', () => {
		it('should replace spaces with "%20" within places name', () => {
			const place = 'Hey, Here you got some spaces';
			const parsePlace = buildPlaceParam(place);
			value(parsePlace).is('Hey,%20Here%20you%20got%20some%20spaces');
		});

		it('should return an error if some argument is not a string', () => {
			let errorMsg;
			try {
				buildPlaceParam(1);
			} catch(err) {
				errorMsg = err;
			}
			exception(errorMsg);
			value(errorMsg).isInstanceOf(Error);
		});
	});

	describe('buildOptions parsin object supplied to OSM query string', () => {
		it('buildOptions append format json needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json'
			};
			const optionParam = buildOptions(OptionObject);
			value(optionParam).is('&format=json');
		});

		it('buildOptions append format and addressdetails needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json',
				addressdetails: 1
			};
			const optionParam = buildOptions(OptionObject);
			value(optionParam).is('&format=json&addressdetails=1');
		});

		it('buildOptions append format, addressdetails and dedupe needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json',
				addressdetails: 1,
				dedupe: 1
			};
			const optionParams = buildOptions(OptionObject);
			value(optionParams).is('&format=json&addressdetails=1&dedupe=1');
		});
	});

});