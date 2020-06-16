import React, { useState, useEffect, memo } from 'react'
import MoviesSliderPagination from './MoviesSliderPagination'

function MoviesCatController({ catTitle, apiRequest }) {
	const [movies, setMovies] = useState({ results: [] })
	const [page, setPage] = useState(1)

	useEffect(() => {
		apiRequest(page)
			.then((data) => setMovies({ ...data, results: [...movies.results, ...data.results] }))
			.catch((e) => console.error(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page])

	const nextPage = () => {
		page < movies.total_pages && setPage(page + 1)
	}

	return <MoviesSliderPagination catTitle={catTitle} movies={movies.results} nextPage={nextPage} />
}

export default memo(MoviesCatController)
