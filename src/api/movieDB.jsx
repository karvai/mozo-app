import Axios from 'axios'

const apiKey = '8257746268f027ce5e25496e2451ca39'
const settings = `language=en-GB&api_key=${apiKey}`

const instance = Axios.create({
	baseURL: 'https://api.themoviedb.org/3/',
})

export const tmdbAPI = {
	getMovieDetail(id) {
		return instance.get(`movie/${id}?${settings}`).then((response) => response.data)
	},
	getRecommendations(id) {
		return instance.get(`movie/${id}/recommendations?${settings}`).then((response) => response.data.results)
	},
	getMovieReleaseRating(id) {
		return instance.get(`movie/${id}/release_dates?api_key=${apiKey}`).then((response) => response.data.results)
	},
	getMovieVideos(id) {
		return instance.get(`movie/${id}/videos?api_key=${apiKey}`).then((response) => response.data.results)
	},
	getMovieCast(id) {
		return instance.get(`movie/${id}/credits?api_key=${apiKey}`).then((response) => response.data)
	},
	getSearchResult(query, page) {
		return instance.get(`search/movie?${settings}&query=${query}&page=${page}`).then((response) => response.data)
	},
	getNowPlaying(page) {
		return instance.get(`movie/now_playing?${settings}&page=${page}`).then((response) => response.data)
	},
	getPopular(page) {
		return instance.get(`movie/popular?${settings}&page=${page}`).then((response) => response.data)
	},
	getTopRated(page) {
		return instance.get(`movie/top_rated?${settings}&page=${page}`).then((response) => response.data)
	},
	getUpcoming(page) {
		return instance.get(`movie/upcoming?${settings}&page=${page}`).then((response) => response.data)
	},
	getDailyTrending(page) {
		return instance.get(`trending/movie/day?api_key=${apiKey}&page=${page}`).then((response) => response.data)
	},
	getWeeklyTrending(page) {
		return instance.get(`trending/movie/week?api_key=${apiKey}&page=${page}`).then((response) => response.data)
	},
	getAction(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=28&page=${page}`).then((response) => response.data)
	},
	getAdventure(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=12&page=${page}`).then((response) => response.data)
	},
	getAnimation(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=16&page=${page}`).then((response) => response.data)
	},
	getComedy(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=35&page=${page}`).then((response) => response.data)
	},
	getCrime(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=80&page=${page}`).then((response) => response.data)
	},
	getDocumentary(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=99&page=${page}`).then((response) => response.data)
	},
	getDrama(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=18&page=${page}`).then((response) => response.data)
	},
	getFamily(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=10751&page=${page}`).then((response) => response.data)
	},
	getFantasy(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=14&page=${page}`).then((response) => response.data)
	},
	getRomance(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=10749&page=${page}`).then((response) => response.data)
	},
	getHistory(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=36&page=${page}`).then((response) => response.data)
	},
	getHorror(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=27&page=${page}`).then((response) => response.data)
	},
	getMusic(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=10402&page=${page}`).then((response) => response.data)
	},
	getMystery(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=9648&page=${page}`).then((response) => response.data)
	},
	getScienceFiction(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=878&page=${page}`).then((response) => response.data)
	},
	getTVMovie(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=10770&page=${page}`).then((response) => response.data)
	},
	getThriller(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=53&page=${page}`).then((response) => response.data)
	},
	getWar(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=10752&page=${page}`).then((response) => response.data)
	},
	getWestern(page) {
		return instance.get(`discover/movie?${settings}&sort_by=popularity.desc&with_genres=37&page=${page}`).then((response) => response.data)
	},
	// People
	getPersonDetail(id) {
		return instance.get(`person/${id}?api_key=${apiKey}`).then((response) => response.data)
	},
	getMovieCredits(id) {
		return instance.get(`/person/${id}/movie_credits?api_key=${apiKey}`).then((response) => response.data)
	},
}
