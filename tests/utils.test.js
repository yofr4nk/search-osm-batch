const {buildPlaceParam, buildOptions} = require('../src/utils');

describe('UTILs function testing', () => {
	describe('buildPlaceParam replacing spaces with "%20" within places name', () => {
		test('should replace spaces with "%20" within places name', () => {
			const place = 'Hey, Here you got some spaces';
			const parsePlace = buildPlaceParam(place);
			expect(parsePlace).toBe('Hey,%20Here%20you%20got%20some%20spaces');
		});

		test('should return an error if some argument is not a string', () => {
			const parsePlace = buildPlaceParam(1);
			expect(parsePlace).toBe('');
		});
	});

	describe('buildOptions parsin object supplied to OSM query string', () => {
		test('buildOptions append format json needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json'
			};
			const optionParam = buildOptions(OptionObject);
			expect(optionParam).toBe('&format=json');
		});

		test('buildOptions append format and addressdetails needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json',
				addressdetails: 1
			};
			const optionParam = buildOptions(OptionObject);
			expect(optionParam).toBe('&format=json&addressdetails=1');
		});

		test('buildOptions append format, addressdetails and dedupe needs to get to OSM query string', () => {
			const OptionObject = {
				format: 'json',
				addressdetails: 1,
				dedupe: 1
			};
			const optionParams = buildOptions(OptionObject);
			expect(optionParams).toBe('&format=json&addressdetails=1&dedupe=1');
		});
	});

});
