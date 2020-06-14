import React from 'react'
import { Card } from './styles'
import { Link, withRouter } from 'react-router-dom'

function MovieCard({ id, title, posterPath, year, history }) {
	const delayRedirect = (e) => {
		e.preventDefault()
		setTimeout(() => {
			history.push(`/movie/${id}`)
		}, 200)
	}

	return (
		<Card>
			<Link to={`/movie/${id}`} onClick={delayRedirect}>
				{posterPath !== null ? (
					<img className='poster' src={`https://image.tmdb.org/t/p/w300${posterPath}`} alt={`${title} poster`} />
				) : (
					<div className='noImage'>
						<span>
							{title} ({!!year ? year.slice(0, 4) : 'n.d.'})
						</span>
					</div>
				)}
			</Link>
		</Card>
	)
}

export default withRouter(MovieCard)
