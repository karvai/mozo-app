import React, { useState, useEffect } from 'react'
import MoviesSliderPagination from './MoviesSliderPagination'

export default function MoviesSearchController({ apiRequest, searchQuery }) {
	const [movies, setMovies] = useState({ results: [] })
	const [page, setPage] = useState(1)

	useEffect(() => {
		if (searchQuery !== '') {
			apiRequest(searchQuery, page)
				.then((data) => setMovies({ ...data, results: [...movies.results, ...data.results] }))
				.catch((e) => console.warn(e))
		} else {
			setPage(1)
			setMovies({ results: [] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page])

	useEffect(() => {
		if (searchQuery !== '') {
			apiRequest(searchQuery, 1)
				.then((data) => setMovies(data))
				.catch((e) => console.warn(e))
		} else {
			setPage(1)
			setMovies({ results: [] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery])

	const nextPage = () => {
		page < movies.total_pages && setPage(page + 1)
	}

	return <>{searchQuery !== '' && <MoviesSliderPagination catTitle={movies.total_results !== 0 ? `Results for "${searchQuery}"` : `No results found for "${searchQuery}"`} movies={movies.results} nextPage={nextPage} />}</>
}
