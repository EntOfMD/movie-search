var express = require('express');
var router = express.Router();

const nameToImdb = require('name-to-imdb');
const request = require('request');
const cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'MovDow - movie search app.' });
});
/* GET search page.  */
router.get('/search', (req, res, next) => {
	res.render('search', { title: 'Search Page', search_results: `${id}` });
});

router.post('/', (req, res, err) => {
	var movie_name = req.body.id_field;
	nameToImdb({ name: movie_name }, async (err, res, type) => {
		const movie_id = await res;
		if (res != 0) {
			/* This is for IMDB */
			new request(`https://imdb.com/title/${movie_id}/`, (error, response, html) => {
				if (!error && response.statusCode == 200) {
					const imdbHTML = cheerio.load(html);

					const imdbTitleWrapper = imdbHTML('.title_wrapper');

					const title = imdbTitleWrapper.find('h1').text();

					console.log(`${title} ${movie_id}`);
				}
			});
			/* This is for rarbg */
			new request(
				`https://rarbg.to/torrents.php?search=${movie_id}&category%5B%5D=44&category%5B%5D=50&category%5B%5D=51&category%5B%5D=52&category%5B%5D=42&category%5B%5D=46`,
				(error, response, html) => {
					if (!error && response.statusCode == 200) {
						/* code here */
					}
				}
			);
		}
	});
	// console.log(movie_id);
});
module.exports = router;
