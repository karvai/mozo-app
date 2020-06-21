import React, { useState, useEffect, memo } from 'react'
import MoviesSlider from './MoviesSlider'

function MoviesController({ apiRequest, searchQuery, catTitle }) {
	const [movies, setMovies] = useState({ results: [] })
	const [page, setPage] = useState(1)

	useEffect(() => {
		if (apiRequest.length === 2) {
			setPage(1)
			setMovies({ results: [] })
			!!searchQuery &&
				apiRequest(searchQuery, page)
					.then((data) => setMovies(data))
					.catch((e) => console.error(e))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery])

	useEffect(() => {
		if (apiRequest.length === 2) {
			!!searchQuery &&
				apiRequest(searchQuery, page)
					.then((data) => setMovies({ ...data, results: [...movies.results, ...data.results] }))
					.catch((e) => console.error(e))
		} else {
			apiRequest(page)
				.then((data) => setMovies({ ...data, results: [...movies.results, ...data.results] }))
				.catch((e) => console.error(e))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page])

	const nextPage = () => {
		page < movies.total_pages && setPage(page + 1)
	}

	return <>{apiRequest.length === 2 ? !!searchQuery && <MoviesSlider catTitle={movies.total_results !== 0 ? `Results for "${searchQuery}"` : `No results found for "${searchQuery}"`} movies={movies.results} nextPage={nextPage} /> : <MoviesSlider catTitle={catTitle} movies={movies.results} nextPage={nextPage} />}</>
}

export default memo(MoviesController)
