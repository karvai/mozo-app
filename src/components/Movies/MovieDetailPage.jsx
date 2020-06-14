import React, { useState, useEffect } from 'react'
import { HashLink } from 'react-router-hash-link'
import { tmdbAPI } from '../../api/movieDB'
import { omdbAPI } from '../../api/OMDB'
import { ReactComponent as IMDBIcon } from '../../assets/icons/IMDb_Logo.svg'
import { ReactComponent as RottenCertifiedFreshIcon } from '../../assets/icons/Rotten_Tomatoes_Certified_Fresh.svg'
import { ReactComponent as RottenFreshIcon } from '../../assets/icons/Rotten_Tomatoes_Fresh.svg'
import { ReactComponent as RottenRottenIcon } from '../../assets/icons/Rotten_Tomatoes_Rotten.svg'
import { ReactComponent as MetacriticIcon } from '../../assets/icons/Metacritic.svg'
import { Showroom, PersonCard, Paragraph, Title, Genre, MetacriticColor, Video, MovieDetailHeader, PageWrapper, CircleSeparator } from './styles'
import { Link, withRouter } from 'react-router-dom'
import { timeConvert, formatDate } from '../func'

function MovieDetailPage({ match, currentUser }) {
	const [movie, setMovie] = useState()
	const [movieAgeRating, setMovieAgeRating] = useState()
	const [movieRatings, setMovieRatings] = useState()
	const [movieVideo, setMovieVideo] = useState()
	const [movieCast, setMovieCast] = useState()

	useEffect(() => {
		tmdbAPI
			.getMovieDetail(match.params.id)
			.then((data) => setMovie(data))
			.catch((e) => console.warn(e))

		tmdbAPI
			.getMovieReleaseRating(match.params.id)
			.then((results) => {
				const getRating = (country) => {
					const cou = results.filter((item) => item.iso_3166_1 === country)
					if (cou.length !== 0 && cou[0].release_dates.filter((item) => item.certification !== '').length !== 0) {
						setMovieAgeRating(cou[0].release_dates.filter((item) => item.certification !== '')[0].certification)
						return false
					}
					return true
				}
				getRating('GB') && getRating('US')
			})
			.catch((e) => console.warn(e))

		tmdbAPI
			.getMovieVideos(match.params.id)
			.then((data) => {
				const trailer = data.filter((item) => item.name.toLowerCase().includes('trailer'))
				const official = data.filter((item) => item.name.toLowerCase().includes('official'))
				data.length !== 0 && trailer.length !== 0 ? (official.length !== 0 ? setMovieVideo(official[0]) : setMovieVideo(trailer[0])) : setMovieVideo(data[0])
			})
			.catch((e) => console.warn(e))

		tmdbAPI
			.getMovieCast(match.params.id)
			.then((data) => {
				setMovieCast(data)
			})
			.catch((e) => console.warn(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		!!movie &&
			!!movie.imdb_id &&
			omdbAPI
				.getMovieByIMDB(movie.imdb_id)
				.then((data) => {
					data.Ratings.map((item) => setMovieRatings((current) => ({ ...current, [item.Source.replace(/\s/g, '')]: parseInt(item.Value.replace('.', '')) })))
				})
				.catch((e) => console.warn(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [movie])

	return (
		<>
			{!!movie && (
				<PageWrapper backdrop={!!movie.backdrop_path && `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}>
					<MovieDetailHeader>
						<div className='wrapper'>
							<h2>{movie.title}</h2>
							<p>
								{!!movie.runtime && movie.runtime !== 0 && (
									<span>
										{timeConvert(movie.runtime)} <CircleSeparator>●</CircleSeparator>
									</span>
								)}{' '}
								{!!movie.release_date && formatDate(movie.release_date)}{' '}
								{!!movieAgeRating && (
									<span>
										<CircleSeparator>●</CircleSeparator> {movieAgeRating}
									</span>
								)}
							</p>

							<p className='genre'>
								{!!movie.genres &&
									movie.genres.map((item) => (
										<HashLink key={item.name.replace(/\s/g, '').toLowerCase()} to={`/#${item.name.replace(/\s/g, '').toLowerCase()}`}>
											<Genre>{item.name}</Genre>
										</HashLink>
									))}
							</p>

							{!!movieRatings && (
								<div className='ratings'>
									{!!movieRatings.InternetMovieDatabase && (
										<>
											<IMDBIcon className='svg' />
											<span>{(movieRatings.InternetMovieDatabase / 10).toFixed(1)}</span>
										</>
									)}
									{!!movieRatings.RottenTomatoes && (
										<>
											{movieRatings.RottenTomatoes > 59 ? movieRatings.RottenTomatoes > 74 ? <RottenCertifiedFreshIcon className='svg' /> : <RottenFreshIcon className='svg' /> : <RottenRottenIcon className='svg' />}
											<span>{movieRatings.RottenTomatoes}%</span>
										</>
									)}
									{!!movieRatings.Metacritic && (
										<>
											<MetacriticIcon className='svg' />
											<MetacriticColor color={movieRatings.Metacritic > 39 ? (movieRatings.Metacritic > 60 ? '#6c3' : '#fc3') : '#f00'}>{movieRatings.Metacritic}</MetacriticColor>
										</>
									)}
								</div>
							)}
						</div>
					</MovieDetailHeader>

					{!!movieVideo && (
						<Video>
							<div className='iframe-container'>
								<iframe title='youtube-video' src={`https://www.youtube-nocookie.com/embed/${movieVideo.key}`} frameBorder='0' data-allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen='allowfullscreen' mozallowfullscreen='mozallowfullscreen' msallowfullscreen='msallowfullscreen' oallowfullscreen='oallowfullscreen' webkitallowfullscreen='webkitallowfullscreen'></iframe>
							</div>
						</Video>
					)}

					{!!movie.overview && (
						<div>
							<Title style={{ marginTop: 5 }}>Overview</Title>
							<Paragraph>{movie.overview}</Paragraph>
						</div>
					)}

					{!!movieCast && (
						<>
							<Title style={{ paddingBottom: 4 }}>Cast & Crew</Title>
							<Showroom>
								{movieCast.crew.map(
									(item) =>
										!!item.profile_path &&
										item.job === 'Director' && (
											<PersonCard key={item.id}>
												<Link to={`/movie/p/${item.id}`}>
													<img src={`https://image.tmdb.org/t/p/w185${item.profile_path}`} alt={`${item.name}`} />
													<span>
														{item.name}
														<div className='role'>{item.job}</div>
													</span>
												</Link>
											</PersonCard>
										)
								)}
								{movieCast.crew.map(
									(item) =>
										!!item.profile_path &&
										item.job === 'Writer' && (
											<PersonCard key={item.id}>
												<Link to={`/movie/p/${item.id}`}>
													<img src={`https://image.tmdb.org/t/p/w185${item.profile_path}`} alt={`${item.name}`} />
													<span>
														{item.name}
														<div className='role'>{item.job}</div>
													</span>
												</Link>
											</PersonCard>
										)
								)}
								{movieCast.cast.map(
									(item) =>
										!!item.profile_path && (
											<PersonCard key={item.id}>
												<Link to={`/movie/p/${item.id}`}>
													<img src={`https://image.tmdb.org/t/p/w185${item.profile_path}`} alt={`${item.name}`} />
													<span>{item.name}</span>
												</Link>
											</PersonCard>
										)
								)}
							</Showroom>
						</>
					)}

					{!!currentUser && (
						<div className='addTo'>
							<button className='button'>Add to wishlist</button>
							<button className='button'>Add to ownlist</button>
						</div>
					)}
				</PageWrapper>
			)}
		</>
	)
}

export default withRouter(MovieDetailPage)
