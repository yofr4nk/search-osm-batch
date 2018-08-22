# Search-osm-batch
Based on [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/), to Batch searching multiple positions.

- Reference taken from needs to get multiple positions info, the API accept only one position per request, with this library it can request many places with only array of them. 


# How to use
- Import lib.
- The first argument is an array with places to search:
```
batchSearch(['Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood', 'Miami International Airport'], {
 format: 'json'
})
```
- The lib returns a Promise.

# Options
- The second argument is a object with params to set in search request.
- There are many params to parse, some of them could be follows:

## format: 
- It will get a response with ```json | html | xml | jsonv2``` formats.

## addressdetails [0|1]
- Include a breakdown of the address into elements.

## limit
- Limit the number of returned results. Default is 10.

## dedupe
- It will attempt to detect such duplicates and only return one match. Default is 1.

## polygon_svg = 1
- Output geometry of results in svg format. 

# Example: 
- The native request to Nominatim with only one allowed place is:
```
https://nominatim.openstreetmap.org/search/Berlin?format=json&addressdetails=1&limit=1&polygon_svg=1
```
- This lib lets build a smart query with an array of places and the option object with all of params allowed by Nominatim 
- The Query could be:
```
batchSearch(['Berlin', 'Doctors Hospital of Augusta, 3651, Wheeler Road, Westwood', 'Miami International Airport'], {
 format: 'xml',
 addressdetails: 1,
 limit: 1,
 dedupe: 1,
 polygon_svg: 1
})
```
- The response will be an array of info about places supplied.








