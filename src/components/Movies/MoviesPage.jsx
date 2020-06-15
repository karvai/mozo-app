import React from 'react'
import { tmdbAPI } from '../../api/movieDB'
import { SearchBar, HideSearch } from './styles'
import MoviesCatController from './MoviesCatController'
import MoviesSearchController from './MoviesSearchController'

const moviesHomeLayout = [
	{ title: 'Now Playing', apiRequest: tmdbAPI.getNowPlaying },
	{ title: 'Popular', apiRequest: tmdbAPI.getPopular },
	{ title: 'Top Rated', apiRequest: tmdbAPI.getTopRated },
	{ title: 'Daily Trends', apiRequest: tmdbAPI.getDailyTrending },
	{ title: 'Weekly Trends', apiRequest: tmdbAPI.getWeeklyTrending },
	{ title: 'Upcoming', apiRequest: tmdbAPI.getUpcoming },
	{ title: 'Action', apiRequest: tmdbAPI.getAction },
	{ title: 'Comedy', apiRequest: tmdbAPI.getComedy },
	{ title: 'Drama', apiRequest: tmdbAPI.getDrama },
	{ title: 'Animation', apiRequest: tmdbAPI.getAnimation },
	{ title: 'Fantasy', apiRequest: tmdbAPI.getFantasy },
	{ title: 'Horror', apiRequest: tmdbAPI.getHorror },
	{ title: 'Mystery', apiRequest: tmdbAPI.getMystery },
	{ title: 'Family', apiRequest: tmdbAPI.getFamily },
	{ title: 'Romance', apiRequest: tmdbAPI.getRomance },
	{ title: 'Adventure', apiRequest: tmdbAPI.getAdventure },
	{ title: 'Crime', apiRequest: tmdbAPI.getCrime },
	{ title: 'Documentary', apiRequest: tmdbAPI.getDocumentary },
	{ title: 'Science Fiction', apiRequest: tmdbAPI.getScienceFiction },
	{ title: 'Thriller', apiRequest: tmdbAPI.getThriller },
	{ title: 'Western', apiRequest: tmdbAPI.getWestern },
	{ title: 'War', apiRequest: tmdbAPI.getWar },
	{ title: 'Music', apiRequest: tmdbAPI.getMusic },
	{ title: 'History', apiRequest: tmdbAPI.getHistory },
	{ title: 'TV Movie', apiRequest: tmdbAPI.getTVMovie },
]

export default function MoviesPage({ searchQuery, searchHandler }) {
	return (
		<>
			<SearchBar>
				<input type='text' placeholder='Search' value={searchQuery} onChange={(event) => searchHandler(event.target.value)} />
				<svg viewBox='0 0 512 512'>
					<path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' fill='none' strokeMiterlimit={10} strokeWidth={60} />
					<path fill='none' strokeLinecap='round' strokeMiterlimit={10} strokeWidth={60} d='M338.29 338.29L448 448' />
				</svg>
			</SearchBar>
			<HideSearch className={searchQuery !== '' && 'active'}>
				<MoviesSearchController searchQuery={searchQuery} apiRequest={tmdbAPI.getSearchResult} />
			</HideSearch>

			{moviesHomeLayout.map((category, index) => (
				<MoviesCatController key={index} catTitle={category.title} apiRequest={category.apiRequest} />
			))}
		</>
	)
}