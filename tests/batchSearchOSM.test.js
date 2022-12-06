const batchSearch = require('../index');
const axios = require('axios');

jest.mock('axios');

describe(('Batching search from Nominatim openStreetMap service'), () => {
    describe('batchSearch function to get multiples address', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        })

        test('should get an OSM info when pass a place', async () => {
            const dataMock = {
                data: [{
                    "place_id": 113659216,
                    "osm_id": 31410359,
                    "lat": "33.4864304",
                    "lon": "-82.09452364191654",
                    "display_name": "Doctors Hospital of Augusta, 3651, Wheeler Road, Augusta, Richmond County, Georgia, 30909, Estados Unidos de América",
                    "type": "hospital",
                }]
            };

            axios.get.mockResolvedValue(dataMock);

            const places = await batchSearch(['Hospital of Augusta'], {
                format: 'jsonv2'
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

        test('should get multiple latitude and longitude from OSM when pass multiple address', async () => {
            axios.get
                .mockReturnValueOnce(Promise.resolve({
                    data: [{
                        "place_id": 113659216,
                        "lat": "33.4864304",
                        "lon": "-82.09452364191654",
                        "display_name": "Doctors Hospital of Augusta, 3651, Wheeler Road, Augusta, Richmond County, Georgia, 30909, Estados Unidos de América",
                        "type": "hospital",
                    }]
                }))
                .mockReturnValueOnce(Promise.resolve({
                    data: [{
                        "place_id": 130947386,
                        "lat": "25.7949789",
                        "lon": "-80.28672341095405",
                        "display_name": "Aeropuerto Internacional de Miami, 2100, Northwest 42nd Avenue, Miami, Condado de Miami-Dade, Florida, 33142, Estados Unidos de América",
                        "category": "aeroway",
                        "type": "aerodrome",
                    }]
                }))

            const places = await batchSearch(['Hospital of Augusta', 'Miami International Airport'], {
                format: 'jsonv2'
            });

            expect(places).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({type: 'hospital'}),
                    expect.objectContaining({type: 'aerodrome'}),
                ])
            );
        });

        test('should get the address detail of place passed with json format', async () => {
            const dataMock = {
                data: [{
                    "place_id": 113659216,
                    "osm_id": 31410359,
                    "lat": "33.4864304",
                    "lon": "-82.09452364191654",
                    "display_name": "Doctors Hospital of Augusta, 3651, Wheeler Road, Augusta, Richmond County, Georgia, 30909, Estados Unidos de América",
                    "type": "hospital",
                    "address": {
                        "amenity": "Doctors Hospital of Augusta",
                        "city": "Augusta",
                        "county": "Richmond County",
                        "state": "Georgia",
                        "country": "United States of America",
                    }
                }]
            };
            axios.get.mockResolvedValue(dataMock);

            const places = await batchSearch(['Hospital of Augusta'], {
                format: 'jsonv2',
                addressdetails: 1
            });

            expect(places[0]).toHaveProperty('address');
            expect(places[0].address).toHaveProperty('country');
            expect(places[0].address).toHaveProperty('state');
            expect(places[0].address.country).toEqual(expect.stringContaining('United States of America'));
            expect(places[0].address.state).toEqual(expect.stringContaining('Georgia'));
        });

        test('should get an empty response when the argument array place passed is not a string', async () => {
            const dataMock = {
                data: [],
            };
            axios.get.mockResolvedValue(dataMock);

            const places = await batchSearch([1], {
                format: 'jsonv2',
            });

            expect(places).toHaveLength(0);
        });

        test('should get an empty response when the API response an error', async () => {
            axios.get.mockRejectedValue('error getting response');

            const places = await batchSearch(['Hospital of Augusta'], {
                format: 'jsonv2',
            });

            expect(places).toHaveLength(0);
        });
    });
});
