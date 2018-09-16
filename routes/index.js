var express = require('express');
var router = express.Router();

const nameToImdb = require('name-to-imdb');
const request = require('request');
const cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'MovDow', sub_title: 'a movie search app', displayResults_info: '', imdb_url: '' });
});
/* /* GET search page.  
router.get('/search', (req, res, next) => {
	res.render('search', { title: 'Search Page', search_results: `${id}` });
}); */

router.post('/', (req, res, err) => {
	/* req has the imdb movie name, passing it thru nametoimdb to get movie id */
	var movie_name = req.body.id_field;
	var mainRes = res;

	var movieSet = {
		id: '',
		title: '',
		name: '',
		search: movie_name,
		raw: [],
		json: [],
	};
	var rarbg_imdb = {
		title: '',
		people: [],
		languages: [],
		country: '',
		director: [],
		genres: [],
		year: '',
		runtime: '',
		imdbRating: '',
		rottenRating: '',
		raw: [],
	};
	nameToImdb({ name: movie_name }, (err, res) => {
		movieSet.id = res;

		if (!err) {
			/* This is for IMDB, searching the movie id to get info */
			var imdb_url = `https://imdb.com/title/${movieSet.id}/`;
			new request(imdb_url, (error, response, html) => {
				if (!error && response.statusCode === 200) {
					movieSet.raw = html;
					const imdbHTML = cheerio.load(html);

					movieSet.name = imdbHTML('#ratingWidget')
						.find('strong')
						.text();
					movieSet.title = imdbHTML('.title_wrapper')
						.find('h1')
						.text();

					mainRes.render('index', {
						displayResults_info: `Showing results for ${movieSet.title}`,
						title: 'MovDow - a movie search app',
						sub_title: `<b>test</b>`,
						imdb_url: `${imdb_url}`,
					});

					console.log(`User searched for ${movie_name}, found ${movieSet.name} with id# ${movieSet.id}`);
				}
			});
		}
	});

	function rarbg() {
		return new Promise(function(resolve, reject) {
			request(`https://rarbg.to/torrents.php?imdb=${movieSet.id}`, function(err, response, body) {
				if (err) reject(err);
				if (response.statusCode !== 200) {
					reject(`invalid status code: ${response.statusCode}`);
				}

				let $ = cheerio.load(body);
				// rarbg_imdb.raw = $();
			});
		});
	}
});
module.exports = router;
