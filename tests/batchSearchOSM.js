const {array, object, exception, value} = require('unit.js');
const batchSearch = require('../index');

describe(('Batching search from Nominatim openStreetMap service'), () => {
  describe('batchSearch function to get multiples address', () => {
		it('should get an OSM info when pass a place', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'json'
			});
			
			array(places).isNotEmpty();
			array(places).hasLength(1);
			array(places).matchEach(place => {
				return place.type = 'hospital' && place.display_name.search('Georgia') !== -1;
			});
		});

		it('should get multiple latitude and longitude from OSM when pass multiple address', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood', 
			'Fantasilandia, Parque O\'Higgins', 'Miami International Airport'], {
				format: 'json'
			});
			
			const keyPlaces = {
				'Hospital': 0,
				'Fantasilandia': 1,
				'Airport': 2
			};
			array(places).isNotEmpty();
			array(places).hasLength(3);

			value(places[keyPlaces['Hospital']]).hasValue('33.4864304');
			value(places[keyPlaces['Hospital']]).hasValue('-82.0945236419165');

			value(places[keyPlaces['Fantasilandia']]).hasValue('-33.4603911');
			value(places[keyPlaces['Fantasilandia']]).hasValue('-70.6627724235182');

			value(places[keyPlaces['Airport']]).hasValue('25.7949789');
			value(places[keyPlaces['Airport']]).hasValue('-80.2867234109541');
		});

		it('should get an OSM info with xml format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'xml'
			});
			value(places[0]).hasValue('xml');
		});

		it('should get an OSM info with json format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'json'
			});
			object(places[0]).isValid();
		});

		it('should get an OSM info with html format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'html'
			});
			value(places[0]).hasValue('html');
		});

		it('should get the address detail of place passed with json format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'json',
				addressdetails: 1
			});
			value(places[0]).hasKey('address');
			value(places[0].address.country).is('United States of America');
			value(places[0].address.state).is('Georgia');
		});

		it('should get an error when the argument array place passed is not a string', async () => {
			let errorMsg;
			try {
				await batchSearch([1]);
			} catch(err) {
				errorMsg = err;
			}
			exception(errorMsg);
			value(errorMsg).isInstanceOf(Error);
		});
	});
});