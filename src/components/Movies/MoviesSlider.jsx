import React from 'react'
import { Title, Showroom, Unavailable } from './styles'
import MovieCard from './MovieCard'

export default function MoviesSlider({ catTitle, movies, nextPage }) {
	const infinityScroll = (e) => {
		e.target.scrollLeft + e.target.clientWidth > e.target.scrollWidth - 1200 &&
			setTimeout(() => {
				nextPage()
			}, 200)
	}

	return (
		<>
			<Title id={catTitle.replace(/\s/g, '').toLowerCase()}>{catTitle}</Title>
			<Showroom onScroll={!!nextPage ? infinityScroll : undefined}>
				{movies.length !== 0 ? (
					movies.map((movie) => <MovieCard key={movie.id} id={movie.id} title={movie.title} posterPath={movie.poster_path} year={movie.release_date} />)
				) : (
					<Unavailable>
						<div className='unavailableWrapper'>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
							<div className='unavailableItem'></div>
						</div>
					</Unavailable>
				)}
			</Showroom>
		</>
	)
}
