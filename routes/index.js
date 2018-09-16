var express = require('express');
var router = express.Router();

const nameToImdb = require('name-to-imdb');
const request = require('request');
const cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'MovDow', sub_title: 'a movie search app', displayResults: '' });
});
/* /* GET search page.  
router.get('/search', (req, res, next) => {
	res.render('search', { title: 'Search Page', search_results: `${id}` });
}); */

router.post('/', (req, res, err) => {
	/* req has the imdb movie name, passing it thru nametoimdb to get movie id */
	var movie_name = req.body.id_field;
	var mainRes = res;

	nameToImdb({ name: movie_name }, (err, res) => {
		// const movie_id = res;

		var movieSet = {
			id: res,
			title: '',
			name: '',
			search: movie_name,
			raw: [],
			json: [],
			rarbg: [],
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
		};
		if (!err) {
			/* This is for IMDB, searching the movie id to get info */
			new request(`https://imdb.com/title/${movieSet.id}/`, (error, response, html) => {
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
						displayResults: `Showing results for ${movieSet.title}`,
						title: 'MovDow - a movie search app',
						sub_title: `ohh! I love ${movieSet.name}`,
					});

					console.log(movieSet.title, movieSet.id, movie_name);
				}
			});

			new request(`https://rarbg.to/torrents.php?imdb=${movieSet.id}`, (error, response, html) => {
				if (!error && response.statusCode === 200) {


				}
			});
		}
	});

	/* res.render('index', {
		displayResults: movie_name,
		title: 'MovDow - a movie torrent search app',
		sub_title: movie_name,
	}); */
});
module.exports = router;