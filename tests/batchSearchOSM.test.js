const batchSearch = require('../index');

describe(('Batching search from Nominatim openStreetMap service'), () => {
  describe('batchSearch function to get multiples address', () => {
		test('should get an OSM info when pass a place', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'json'
			});
			
			expect(places).toHaveLength(1);
			expect(places).toEqual(
				expect.arrayContaining([
					expect.objectContaining({type: 'hospital'}),
				])
			);
			expect(places[0]).toHaveProperty('display_name');
			expect(places[0].display_name).toEqual(expect.stringContaining('Georgia'));
		});

		test('should get multiple latitude and longitude from OSM when pass multiple address', async (done) => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood', 'Miami International Airport'], {
				format: 'json'
			});

			expect(places).toEqual(
				expect.arrayContaining([
					expect.objectContaining({type: 'hospital'}),
					expect.objectContaining({class: 'aeroway'}),
				])
			);
			done();
		});

		test('should get an OSM info with xml format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'xml'
			});

			expect(places[0]).toEqual(expect.stringContaining('xml'));
		});

		test('should get an OSM info with html format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'html'
			});
			expect(places[0]).toEqual(expect.stringContaining('html'));
		});

		test('should get the address detail of place passed with json format', async () => {
			const places = await batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood'], {
				format: 'json',
				addressdetails: 1
			});

			expect(places[0]).toHaveProperty('address');
			expect(places[0].address).toHaveProperty('country');
			expect(places[0].address).toHaveProperty('state');
			expect(places[0].address.country).toEqual(expect.stringContaining('United States of America'));
			expect(places[0].address.state).toEqual(expect.stringContaining('Georgia'));
		});

		test('should get an error when the argument array place passed is not a string', async () => {
			await expect(batchSearch([1]))
			.rejects
			.toThrow()
		});
	});
});