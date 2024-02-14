const request = require('request');

const options = {
  method: 'GET',
  url: 'https://trailapi-trailapi.p.rapidapi.com/trails/%7Bid%7D/maps/',
  headers: {
    'X-RapidAPI-Key': '577e7d9074msh43d81f5d6cd1336p173b83jsn13b67e9f3e4b',
    'X-RapidAPI-Host': 'trailapi-trailapi.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});