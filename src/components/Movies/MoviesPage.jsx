import React from 'react'
import { tmdbAPI } from '../../api/movieDB'
import { SearchBar, HideSearch } from './styles'
import MoviesController from './MoviesController'

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

export default function MoviesPage({ searchQuery, setSearchQuery }) {
	return (
		<>
			<SearchBar>
				<input type='text' placeholder='Search' value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
				{!!searchQuery ? (
					<svg viewBox='0 0 512 512' onClick={() => setSearchQuery('')} style={{ cursor: 'pointer' }}>
						<path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z' />
					</svg>
				) : (
					<svg viewBox='0 0 512 512'>
						<path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' fill='none' strokeMiterlimit={10} strokeWidth={60} />
						<path fill='none' strokeLinecap='round' strokeMiterlimit={10} strokeWidth={60} d='M338.29 338.29L448 448' />
					</svg>
				)}
			</SearchBar>
			<HideSearch className={!!searchQuery && 'active'}>
				<MoviesController searchQuery={searchQuery} apiRequest={tmdbAPI.getSearchResult} />
			</HideSearch>

			{moviesHomeLayout.map((category, index) => (
				<MoviesController key={index} catTitle={category.title} apiRequest={category.apiRequest} />
			))}
		</>
	)
}
