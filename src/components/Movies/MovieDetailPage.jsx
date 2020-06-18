import React, { useState, useEffect } from 'react'
import { HashLink } from 'react-router-hash-link'
import { tmdbAPI } from '../../api/movieDB'
import { omdbAPI } from '../../api/OMDB'
import { ReactComponent as IMDBIcon } from '../../assets/icons/IMDb_Logo.svg'
import { ReactComponent as RottenCertifiedFreshIcon } from '../../assets/icons/Rotten_Tomatoes_Certified_Fresh.svg'
import { ReactComponent as RottenFreshIcon } from '../../assets/icons/Rotten_Tomatoes_Fresh.svg'
import { ReactComponent as RottenRottenIcon } from '../../assets/icons/Rotten_Tomatoes_Rotten.svg'
import { ReactComponent as MetacriticIcon } from '../../assets/icons/Metacritic.svg'
import { Showroom, PersonCard, Paragraph, Title, Genre, MetacriticColor, Video, MovieDetailHeader, PageWrapper, CircleSeparator, SVG } from './styles'
import { Link, withRouter } from 'react-router-dom'
import { timeConvert, formatDate } from '../func'
import firebase from 'firebase/app'
import 'firebase/firestore'
import base from '../../api/firebase'

function MovieDetailPage({ match, currentUser, isDarkTheme }) {
	const [movie, setMovie] = useState()
	const [movieAgeRating, setMovieAgeRating] = useState()
	const [movieRatings, setMovieRatings] = useState()
	const [movieVideo, setMovieVideo] = useState()
	const [movieCast, setMovieCast] = useState()
	const [wishlist, setWishlist] = useState()
	const [ownDVD, setOwnDVD] = useState()
	const [ownBD, setOwnBD] = useState()
	const [ownUBD, setOwnUBD] = useState()
	const [ownListArr, setOwnListArr] = useState()
	const [recommendations, setRecommendations] = useState()
	const [isRecommended, setIsRecommended] = useState()

	const dbUsers = base.firestore().collection('users')
	const ownAnyDisc = ownDVD || ownBD || ownUBD

	useEffect(() => {
		tmdbAPI
			.getMovieDetail(match.params.id)
			.then((data) => setMovie(data))
			.catch((e) => console.error(e))

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
			.catch((e) => console.error(e))

		tmdbAPI
			.getMovieVideos(match.params.id)
			.then((data) => {
				const trailer = data.filter((item) => item.name.toLowerCase().includes('trailer'))
				const official = data.filter((item) => item.name.toLowerCase().includes('official'))
				data.length !== 0 && trailer.length !== 0 ? (official.length !== 0 ? setMovieVideo(official[0]) : setMovieVideo(trailer[0])) : setMovieVideo(data[0])
			})
			.catch((e) => console.error(e))

		tmdbAPI
			.getMovieCast(match.params.id)
			.then((data) => {
				setMovieCast(data)
			})
			.catch((e) => console.error(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		!!ownListArr &&
			ownListArr.length !== 0 &&
			ownAnyDisc &&
			tmdbAPI
				.getRecommendations(match.params.id)
				.then((results) => {
					if (results.length !== 0) {
						results.some((item) => {
							if (!ownListArr.includes(item.id)) {
								setRecommendations(item.id)
								return true
							}
							return false
						})
					}
				})
				.catch((e) => console.error(e))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownAnyDisc, ownListArr])

	useEffect(() => {
		if (!!currentUser && !!recommendations)
			ownAnyDisc
				? dbUsers.doc(currentUser.uid).update({
						recommendation: firebase.firestore.FieldValue.arrayUnion(recommendations),
				  })
				: dbUsers.doc(currentUser.uid).update({
						recommendation: firebase.firestore.FieldValue.arrayRemove(recommendations),
				  })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownAnyDisc, recommendations])

	useEffect(() => {
		!!movie &&
			!!movie.imdb_id &&
			omdbAPI
				.getMovieByIMDB(movie.imdb_id)
				.then((data) => {
					data.Ratings.map((item) => setMovieRatings((current) => ({ ...current, [item.Source.replace(/\s/g, '')]: parseInt(item.Value.replace('.', '')) })))
				})
				.catch((e) => console.error(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [movie])

	// gets all owned movies from FB and set into the state ownListArr
	useEffect(() => {
		if (!!currentUser && !!movie) {
			dbUsers
				.doc(currentUser.uid)
				.get()
				.then((doc) => {
					!!doc && !!doc.data() && setOwnListArr(doc.data().ownList)
				})
				.catch((e) => console.error(e))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, movie, ownDVD, ownBD, ownUBD])

	useEffect(() => {
		if (!!currentUser && !!movie) {
			dbUsers
				.doc(currentUser.uid)
				.get()
				.then((doc) => {
					doc.data().wishlist.includes(movie.id) && setWishlist(true)
					doc.data().ownDVD.includes(movie.id) && setOwnDVD(true)
					doc.data().ownBD.includes(movie.id) && setOwnBD(true)
					doc.data().ownUBD.includes(movie.id) && setOwnUBD(true)
				})
				.catch((e) => console.error(e))

			dbUsers
				.doc(currentUser.uid)
				.get()
				.then((doc) => {
					setIsRecommended(doc.data().recommendation.includes(movie.id))
				})
				.catch((e) => console.error(e))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, movie])

	// removes from recommendations if user adds to current movie to the collection
	useEffect(() => {
		if (!!currentUser && !!movie && isRecommended) {
			ownAnyDisc
				? dbUsers.doc(currentUser.uid).update({
						recommendation: firebase.firestore.FieldValue.arrayRemove(movie.id),
				  })
				: dbUsers.doc(currentUser.uid).update({
						recommendation: firebase.firestore.FieldValue.arrayUnion(movie.id),
				  })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, ownAnyDisc, isRecommended])

	// updates wish list
	useEffect(() => {
		!!currentUser &&
			!!movie &&
			dbUsers
				.doc(currentUser.uid)
				.update({
					wishlist: wishlist ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
				})
				.catch((err) => console.error(err))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wishlist])

	// updates DVD collection
	useEffect(() => {
		!!currentUser &&
			!!movie &&
			dbUsers
				.doc(currentUser.uid)
				.update({
					ownDVD: ownDVD ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
					ownList: ownAnyDisc ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
				})
				.then(() => setWishlist(false))
				.catch((err) => console.error(err))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownDVD])

	// updates Blu-ray collection
	useEffect(() => {
		!!currentUser &&
			!!movie &&
			dbUsers
				.doc(currentUser.uid)
				.update({
					ownBD: ownBD ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
					ownList: ownAnyDisc ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
				})
				.then(() => setWishlist(false))
				.catch((err) => console.error(err))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownBD])

	// updates Ultra HD Blu-ray collection
	useEffect(() => {
		!!currentUser &&
			!!movie &&
			dbUsers
				.doc(currentUser.uid)
				.update({
					ownUBD: ownUBD ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
					ownList: ownAnyDisc ? firebase.firestore.FieldValue.arrayUnion(movie.id) : firebase.firestore.FieldValue.arrayRemove(movie.id),
				})
				.then(() => setWishlist(false))
				.catch((err) => console.error(err))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownUBD])

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
											<Genre isDarkTheme={isDarkTheme}>{item.name}</Genre>
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
						<>
							<Title style={{ paddingBottom: 4 }}>Add to my collection</Title>
							<div className='addTo'>
								<button className='button buttonCircle' disabled={ownAnyDisc} onClick={() => setWishlist((prev) => !prev)} style={{ backgroundColor: ownAnyDisc ? '#363e47' : wishlist && '#ea903b', color: wishlist && 'black', opacity: ownAnyDisc && 0.4 }}>
									<SVG style={{ verticalAlign: -26 }} viewBox='0 0 64.34 55.72'>
										<defs>
											<style>{'.prefix__cls-1{fill:#dc2863}.prefix__cls-2{fill:#fff}.prefix__cls-3{fill:#1a1a54}'}</style>
										</defs>
										<path className='prefix__cls-1' d='M60.8 33.7C73.53 13 46.39-9.59 32.2 12.5 19.91-8.14-9.23 11.38 2.5 32.8 23 68 39.54 67.51 60.8 33.7z' transform='translate(.23 -3.41)' />
										<circle className='prefix__cls-2' cx={44.73} cy={21.09} r={8.5} />
										<path className='prefix__cls-3' d='M44.5 19c7.14-.1 7.14 11.11 0 11-7.14.1-7.14-11.11 0-11z' transform='translate(.23 -3.41)' />
										<circle className='prefix__cls-2' cx={19.73} cy={21.09} r={8.5} />
										<path className='prefix__cls-3' d='M19.5 19c7.14-.1 7.14 11.11 0 11-7.14.1-7.14-11.11 0-11z' transform='translate(.23 -3.41)' />
										<path className='prefix__cls-1' d='M44.5 27c12.2-.1 12.2 10.1 0 10-12.2.1-12.2-10.1 0-10z' transform='translate(.23 -3.41)' />
										<path
											d='M40 40v-2.6l-4 .6v1.4l-4 .6c.57 1.83-1.49 12.18 2.1 11.9 4-.15-.05-6.85 4-7a2 2 0 012 2 2 2 0 002 2c3.52.19 1.44-7.72 1.9-9.5z'
											transform='translate(.23 -3.41)'
											style={{
												isolation: 'isolate',
											}}
											opacity={0.5}
											fill='#fff'
										/>
										<ellipse className='prefix__cls-1' cx={19.73} cy={28.59} rx={9.4} ry={5} />
										<path className='prefix__cls-3' d='M34.18 44.09a11.43 11.43 0 01-2.8-.3 4.42 4.42 0 01-3.3-5.3 4.37 4.37 0 015.3-3.3 4.73 4.73 0 003.8-1 4.46 4.46 0 116.4 6.2 13.64 13.64 0 01-9.4 3.7z' transform='translate(.23 -3.41)' />
										<path className='prefix__cls-1' d='M32 43.91c3.93.6 8.53-.1 11.91-3.93-4-2.27-10.83-.43-11.91 3.93z' transform='translate(.23 -3.41)' />
									</SVG>
								</button>

								<button className='button buttonCircle' onClick={() => setOwnDVD((prev) => !prev)} style={{ backgroundColor: ownDVD && '#ea903b', fill: ownDVD ? 'black' : isDarkTheme ? '#FAFAFA' : 'black' }}>
									<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 210 107' style={{ verticalAlign: -11 }}>
										<path d='M118.895 20.346s-13.743 16.922-13.04 18.001c.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H22.175l-2.56 11.068h23.878c12.415 0 19.995 5.132 17.878 14.225-2.287 9.901-13.123 14.128-24.665 14.128H32.39l5.552-24.208H18.647l-8.192 35.368h27.398c20.612 0 40.166-11.067 43.692-25.288.617-2.614.53-9.185-1.054-13.053 0-.093-.091-.271-.178-.537-.087-.093-.178-.722.178-.814.172-.092.525.271.525.358 0 0 .179.456.351.813l17.44 50.315 44.404-51.216 18.761-.092h4.579c12.424 0 20.09 5.132 17.969 14.225-2.29 9.901-13.205 14.128-24.75 14.128h-4.405L161 19.987h-19.287l-8.198 35.368h27.398c20.611 0 40.343-11.067 43.604-25.288 3.347-14.225-11.101-25.293-31.89-25.293H131.757c-10.834 13.049-12.862 15.572-12.862 15.572zM99.424 67.329C47.281 67.329 5 73.449 5 81.012 5 88.57 47.281 94.69 99.424 94.69c52.239 0 94.524-6.12 94.524-13.678.001-7.563-42.284-13.683-94.524-13.683zm-3.346 18.544c-11.98 0-21.58-2.072-21.58-4.595 0-2.523 9.599-4.59 21.58-4.59 11.888 0 21.498 2.066 21.498 4.59 0 2.523-9.61 4.595-21.498 4.595z'></path>
									</SVG>
								</button>

								<button className='button buttonCircle' onClick={() => setOwnBD((prev) => !prev)} style={{ backgroundColor: ownBD && '#ea903b', fill: ownBD ? 'black' : '#0095D5' }}>
									<SVG xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='-0.744 82.256 386 207'>
										<path d='M91.59 237.719c-.693 0-3.053.693-5.135 3.746-2.081 3.053-11.518 18.596-13.183 21.51-1.805 2.914-1.249 4.164.693 4.164h4.163c1.943 0 3.747-2.221 4.441-3.748.972-1.387 12.073-19.428 13.877-22.063 1.526-2.638.556-3.607-.694-3.607-1.108-.002-4.162-.002-4.162-.002zM53.705 267.139c7.078-.277 11.796-.557 17.347-10.686 2.359-4.58-4.302-4.72-4.302-4.72-.972 0 6.106.14 9.853-7.771 3.47-7.217-2.637-6.66-3.746-6.799-5.274-.695-15.127-.418-22.62 0-1.527 0-3.331 2.08-4.303 3.33-.693 1.387-12.212 19.981-13.877 22.619-1.805 2.774 0 3.887 1.804 4.024 5.273.28 11.934.28 19.844.003zm6.106-9.715c-1.942 4.025-5.551 4.164-7.632 4.164h-5.551c-.694 0-1.388 0-.694-1.527.972-1.248 2.359-3.469 2.915-4.303.555-.971 1.109-1.248 2.358-1.248h5.968c1.11 0 4.024-.139 2.636 2.914zm5.134-11.934c-1.942 4.022-5.689 4.022-7.632 4.022h-3.33c-.556 0-1.527 0-.556-1.248.972-1.389 2.081-3.748 2.775-4.58.693-.832 1.249-1.25 2.221-1.25h4.024c1.111.002 4.026.002 2.498 3.056zM284.762 248.82l-9.158 14.57c-1.942 3.053-.276 3.748.693 3.748h4.025c1.525 0 2.637-.139 4.996-3.748l9.158-14.848c2.498-4.025-.556-3.746-2.498-3.746-3.468.138-4.3.001-7.216 4.024zM322.51 249.791h-10.965c-1.109 0-2.637.973-3.469 2.082-.693 1.11-.277 2.221.832 2.221 0-.139 4.44 0 7.771 0 3.47-.139 4.72 2.221.974 7.355-.695 1.108-2.222 2.914-3.472 3.606 0 0-3.053 2.498-12.905 2.498-9.021 0-9.437-.973-9.437-.973-.832-.693-1.108-1.941-.832-2.638.416-.555 1.806-1.108 2.914-1.108H305.3c1.109 0 2.637-.971 3.33-2.221.834-1.109.416-2.496-.693-2.496h-8.464c-4.024 0-3.47-2.64-.416-7.078.832-1.25 2.358-2.775 3.469-3.609 0 0 3.33-2.498 13.045-2.498 3.887 0 10.407-.416 9.992 2.916-.139 1.527-2.36 1.943-3.053 1.943zM351.234 249.93h-8.882c-1.11 0-2.637.973-3.329 2.359l-5.273 8.188c-.695 1.111-.277 2.359.555 2.359h10.547c1.525 0 2.498.139 2.359.555-.139 1.527-2.359 4.164-14.711 4.164-11.102 0-10.408-1.527-10.27-3.19.278-1.806 5.688-10.408 7.354-13.046 1.666-2.774 4.025-6.385 14.988-6.385 10.27 0 9.713 2.359 9.574 2.916.002.554-.552 2.08-2.912 2.08zM299.75 236.469c.832 0 1.805.834 1.109 2.221-.832 1.111-1.109 1.666-1.525 2.498-.555.832-1.805 1.248-3.33 1.248h-5.689c-1.11 0-1.11-.971-.557-1.94a10.2 10.2 0 011.111-1.806c.416-.692 1.109-2.221 3.33-2.221h5.551zM133.777 252.428c-2.081 0-2.914 1.389-3.33 2.082-.278.555-.694.971-1.249 1.943-.417.971-.278 1.94.277 1.94h5.967c1.805 0 2.775-.555 3.33-1.387.556-.971.694-1.25 1.527-2.637.971-1.388-.278-1.943-.972-1.943l-5.55.002zM271.719 258.119c3.607-5.83 1.387-2.222 6.521-10.408 4.996-8.328-2.914-9.992-10.686-9.992-11.935 0-15.544.555-15.544.555-1.247 0-2.913 1.109-3.606 2.498l-14.434 23.314c-.832 1.387-.556 2.496.557 2.774 0 0 3.469.277 15.402.277 16.378.002 17.903-3.051 21.79-9.018zm-4.858-10.408s-6.244 9.852-6.662 10.408c-.555.832-2.498 3.469-5.412 3.469h-6.105c-1.111 0-1.666-.139-.971-1.25l9.99-15.959a2.432 2.432 0 011.943-.971h5.967c1.944 0 2.498 2.082 1.25 4.303zM176.103 253.539c-3.469 0-4.579.276-7.632.416-1.249 0-2.914.971-3.608 2.358l-2.914 4.996c-3.608 5.689 4.163 6.105 10.269 6.105 9.854 0 14.571-2.775 14.571-2.775 1.249-.555 2.776-2.082 3.47-3.33l6.384-10.408c.694-1.11.973-3.053.276-4.163 0 0-.832-1.941-10.685-1.941-9.714 0-13.6 1.525-13.6 1.525-1.11.555-2.498 1.526-2.915 2.082-.276.831.278 1.387 1.389 1.387h14.432c1.111 0 1.527.973.972 1.942-1.249 1.666-3.33 1.806-3.33 1.806h-7.079zm5.551 6.799v.139c-.972 1.39-2.915 2.638-4.024 2.638h-5.551c-1.11 0-1.527-1.248-.556-2.638v-.139c.972-1.525 2.914-2.775 4.024-2.775h5.551c1.111 0 1.527 1.25.556 2.775zM156.953 251.873c.971-1.388 2.497-2.359 3.607-2.359H165c.694 0 2.914-.139 3.054-1.524.139-2.222-4.58-2.775-6.384-2.775-6.522 0-10.131.277-13.878 5.828-2.914 4.438-5.828 9.02-7.771 12.35-1.665 3.054-.138 3.748.833 3.748h4.024c1.526 0 2.637-.139 4.996-3.748l7.079-11.52zM127.949 248.959l-6.245 10.408c-.833 1.108 0 1.664.693 1.664h2.221c.694 0 1.665.834.832 2.082-.693 1.389-.832 1.942-1.525 2.774-.556.973-1.527 1.25-3.192 1.25h-2.637c-1.804 0-.833-2.637-.833-2.637-2.636 2.914-8.742 2.914-15.126 2.914-6.105 0-14.016 0-10.407-6.105l7.771-12.49c1.249-2.082 2.22-2.913 3.469-3.469 0 0 .277-.418 3.607-.418 2.221 0 5.135 0 2.638 3.887l-7.078 11.519c-.832 1.111-.416 2.221.833 2.221h4.856c1.249 0 2.776-1.108 3.747-2.221 0 0 3.608-6.244 6.801-11.379.832-1.248 2.914-4.025 4.995-4.025h3.47c1.527 0 3.33.418 1.11 4.025zM191.091 272.967h11.519l2.359.139c1.248 0 2.775-1.108 3.469-2.498l2.359-3.469c-1.527.277-3.053.277-4.857.277-5.828 0-13.876 0-10.27-6.105l7.494-12.073c.971-1.388 2.498-2.914 3.469-3.47 0-.276.555-.416 3.748-.416 2.08 0 5.412-.555 2.496 3.886l-6.66 11.102c-.832 1.111-.555 2.221.555 2.221h4.72c.971 0 2.774-1.108 3.469-2.221l6.938-11.103c.693-1.387 2.359-2.913 3.47-3.469 0 0 .557-.416 3.745-.416 1.806 0 5.414-.555 2.5 3.885l-5.829 9.3c-.277.416-.416.555-.693 1.248l-7.354 11.934c-.832 1.25-2.359 2.777-3.469 3.471 0 0-4.857 2.775-14.57 2.775h-1.389c-9.021-.277-8.604-.834-9.159-1.25-.556-.139-1.111-.971-.973-2.082.137-.973 1.386-1.666 2.913-1.666zM99.501 117.401c-.278 0-.278.141-.417.278-12.073 16.93-19.15 28.171-26.645 42.048l-.832 1.526-.14.556c-.693 1.389-.555 2.914.417 4.163 4.44 6.938 29.281 15.126 84.651 15.126 41.354 0 85.345-6.661 85.345-19.149 0-11.797-43.297-18.873-85.345-18.873-14.017 0-27.755 1.804-31.641 2.498 3.747-5.829 19.567-27.063 19.567-27.2.277-.277.277-.277.277-.416v-.277c-.277-.139-.416-.278-.693-.278l-44.544-.002zm16.097 44.547c0-2.498 15.682-6.106 40.938-6.106s40.8 3.608 40.8 6.106c0 2.774-15.543 6.244-40.8 6.244-25.257.001-40.938-3.468-40.938-6.244z'></path>
										<path d='M130.863 224.258c7.077.139 206.217 7.076 210.659-63.559 3.606-58.425-142.938-52.873-142.938-52.873-.276 0-1.248 0-1.248.693 0 .833.416.973.972.973 40.659 0 106.717 16.235 104.635 51.207-1.666 28.31-53.289 61.614-172.079 61.614-.555 0-1.11.556-1.11.972-.001.418.415.834 1.109.973z'></path>
										<path d='M313.488 219.123L309.604 219.123 309.604 218.291 318.484 218.291 318.484 219.123 314.877 219.123 314.877 226.061 313.488 226.061z'></path>
										<path d='M320.428 218.291L322.092 218.291 325.008 224.813 328.061 218.291 329.725 218.291 329.725 226.061 328.615 226.061 328.615 219.678 328.477 219.678 325.563 226.061 324.451 226.061 321.537 219.678 321.537 226.061 320.428 226.061z'></path>
									</SVG>
								</button>

								<button className='button buttonCircle' onClick={() => setOwnUBD((prev) => !prev)} style={{ backgroundColor: ownUBD && '#ea903b', fill: ownUBD ? 'black' : '#0096D6' }}>
									<SVG xmlns='http://www.w3.org/2000/svg' viewBox='-4.002 -1.949 191 66'>
										<path d='M74.031 43.023h-1.968c-.337 0-1.361.33-2.353 1.757-1.002 1.443-5.328 8.61-6.157 9.933-.831 1.337-.545 1.975.33 1.975h1.937c.949 0 1.707-1.09 2.125-1.751.409-.666 5.58-8.978 6.325-10.205.743-1.22.269-1.71-.239-1.71M60.546 49.466c.332-.02 3.066-.27 4.635-3.542 1.606-3.347-1.285-3.084-1.818-3.145-2.414-.248-6.956-.236-10.41.026-.76 0-1.552.958-1.967 1.552-.396.598-5.675 9.185-6.472 10.48-.799 1.27-.068 1.763.845 1.824 2.393.137 5.52.15 9.167 0 3.243-.147 5.48-.19 8.04-4.966 1.13-2.114-2.02-2.229-2.02-2.229m-3.233 2.712c-.888 1.85-2.574 1.904-3.47 1.904h-2.56c-.333 0-.693 0-.29-.642.411-.641 1.03-1.648 1.321-2.08.282-.44.523-.529 1.03-.529h2.787c.542 0 1.856-.059 1.181 1.347m2.46-5.539c-.887 1.851-2.683 1.902-3.59 1.902h-1.456c-.337 0-.697 0-.282-.631.406-.655.987-1.661 1.261-2.097.292-.432.54-.548 1.042-.548h1.851c.556 0 1.851-.023 1.174 1.374M94.164 49.824h-2.635l.05.03c-.97 0-1.338.695-1.511.984-.172.274-.332.436-.558.857-.22.432-.16.936.145.936h2.774c.743 0 1.238-.23 1.486-.654.249-.403.368-.606.74-1.205.363-.608-.098-.948-.491-.948M117.77 53.922l2.936-4.732c.365-.588.434-1.49.168-2.019 0 0-.44-.834-4.986-.834-4.506 0-6.276.723-6.276.723-.533.208-1.124.64-1.314.959-.205.316.066.563.591.563h6.7c.525 0 .725.436.388.91-.543.814-1.504.905-1.504.905h-3.236c-1.623 0-2.133.082-3.603.132-.528 0-1.253.482-1.626 1.075l-1.377 2.318c-1.67 2.657 1.978 2.855 4.8 2.855 4.548 0 6.738-1.242 6.738-1.242.518-.295 1.235-1.02 1.6-1.613m-3.95-.443l-.056.083c-.418.68-1.26 1.235-1.861 1.235l-1.324.078-1.182-.078c-.604 0-.748-.556-.327-1.235l.048-.083c.429-.693 1.268-1.246 1.864-1.246h2.513c.609 0 .748.553.325 1.246M107.451 47.768c.155-1.043-2.13-1.32-2.86-1.32-3.066 0-4.773.196-6.54 2.762a304.97 304.97 0 00-3.494 5.736c-.81 1.39-.082 1.75.337 1.75h1.854c.727 0 1.29-.058 2.333-1.75l3.311-5.365c.37-.596 1.119-1.09 1.649-1.09h2.063c.287 0 1.26-.031 1.347-.723M88.952 48.216c.997-1.643.163-1.861-.525-1.861h-1.623c-.98 0-1.957 1.253-2.325 1.861-1.499 2.466-3.205 5.25-3.205 5.25-.37.6-1.098 1.085-1.62 1.085h-2.372c-.525 0-.659-.485-.286-1.085l3.243-5.275c1.174-1.836-.22-1.755-1.197-1.755-1.542 0-1.732.102-1.732.102-.51.312-.933.62-1.607 1.653l-3.538 5.761c-1.702 2.866 1.993 2.846 4.785 2.846 2.904 0 5.818-.013 7.009-1.364 0 0-.436 1.293.365 1.293h1.273c.746 0 1.238-.239 1.491-.655.257-.4.353-.638.725-1.234.376-.607-.106-.956-.501-.956h-.957c-.35 0-.684-.27-.34-.865l2.937-4.8zM135.769 46.593c-1.506 0-1.77.142-1.77.142-.515.29-1.238 1.012-1.61 1.608l-3.17 5.117c-.373.589-1.1 1.075-1.623 1.075h-2.176c-.525 0-.649-.486-.289-1.075l3.178-5.117c1.293-2.044-.234-1.75-1.205-1.75-1.526 0-1.732.117-1.732.117-.512.302-1.245 1.037-1.605 1.633l-3.459 5.589c-1.714 2.879 2 2.85 4.773 2.85.798 0 1.516-.02 2.168-.096l-1.007 1.638c-.378.588-1.106 1.075-1.62 1.075l-1.187-.02-5.262-.01c-.728 0-1.314.31-1.39.794-.06.494.236.839.467.986.238.14.122.47 4.283.482.19 0 .385.01.573.01 4.537 0 6.74-1.235 6.74-1.235.532-.297 1.253-1.027 1.62-1.615l3.465-5.589c.119-.193.205-.352.278-.492l2.701-4.367c1.346-2.07-.312-1.75-1.141-1.75'></path>
										<path d='M98.6416016 20.184082L104.4819336 20.184082 101.5629883 14.7915039z'></path>
										<path d='M180.413 0H2.87C1.876 0 0 .597 0 2.874v31.507c0 .991.599 2.868 2.87 2.868h177.543c.989 0 2.873-.601 2.873-2.868V2.874c0-.995-.604-2.874-2.873-2.874M36.567 20.781v1.127c0 6.47-3.916 7.33-9.573 7.33-1.585 0-3.193-.025-4.777-.025-6.096 0-10.296-.237-10.296-7.599V7.864h5.84v12.032c.112 3.59.317 4.51 4.17 4.602l2.616.024 2.414-.024c3.282 0 3.652-.917 3.74-3.771V7.865h5.866V20.78zm18.336 4.92H40.541v-14.43h4.62v10.566h9.742v3.865zm14.085-10.567h-6.274v10.568h-4.626V15.134h-6.296v-3.865h17.196v3.865zm20.04 7.691v2.877h-4.676v-1.519c0-1.563-.083-2.103-1.701-2.103h-6.725l2.122-3.417h4.476c1.912 0 2.014-.335 2.014-1.738v-.473c-.018-.776-.061-1.189-.724-1.384-.39-.107-.861-.12-1.184-.12h-6.97v10.754h-4.626v-14.43h13.29c3.558 0 4.877 1.253 4.877 4.623 0 1.035-.076 2.116-.619 2.985-.444.689-1.154.964-1.874 1.19 1.45.3 2.32.963 2.32 2.755m18.37 2.877l-1.329-2.566h-8.906l-1.394 2.566h-5.16l8.045-14.43h5.988l.045.083 7.826 14.347h-5.115zm15.598 3.34h-5.835V7.867h5.835v21.175zm19.1 0h-5.866v-8.394h-12.826l2.95-4.768h9.876V7.865h5.866v21.177zm29.623-9.468c0 1.495 0 3.048-.23 4.518-.581 3.34-3.056 4.95-6.393 4.95h-12.963l2.896-4.688h6.674c3.86 0 4.113-1.475 4.113-4.834v-2.161c0-3.277-.05-4.774-4.022-4.774h-9.922v16.457h-5.84V7.865h16.91c6.848 0 8.777 1.701 8.777 8.632v3.077z'></path>
									</SVG>
								</button>
							</div>
						</>
					)}
				</PageWrapper>
			)}
		</>
	)
}

export default withRouter(MovieDetailPage)
