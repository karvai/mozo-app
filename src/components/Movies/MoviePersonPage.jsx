import React, { useState, useEffect, useRef } from 'react'
import { tmdbAPI } from '../../api/movieDB'
import { Showroom, Title, ParagraphShortBio, CircleSeparator, MoviePersonHeader, Ambilight } from './styles'
import { Link, withRouter } from 'react-router-dom'
import { formatDate, getFirstLastWord } from '../func'
import MoviesSlider from './MoviesSlider'

function MoviePersonPage({ match }) {
	const [person, setPerson] = useState()
	const [credits, setCredits] = useState()
	const bio = useRef()

	const sortByDate = (arr) => arr.sort((a, b) => (a.release_date > b.release_date ? -1 : 1))
	const filterByDepart = (arr, depart) => arr.filter((item) => item.department === depart)
	const filterUniqueId = (arr) => arr.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

	useEffect(() => {
		tmdbAPI
			.getPersonDetail(match.params.id)
			.then((data) => setPerson(data))
			.catch((e) => console.warn(e))

		tmdbAPI
			.getMovieCredits(match.params.id)
			.then((data) => {
				const actor = { Actor: sortByDate(filterUniqueId(data.cast)) }
				const director = { Director: sortByDate(filterUniqueId(filterByDepart(data.crew, 'Directing'))) }
				const writer = { Writer: sortByDate(filterUniqueId(filterByDepart(data.crew, 'Writing'))) }
				const producer = { Producer: sortByDate(filterUniqueId(filterByDepart(data.crew, 'Production'))) }
				const camera = { Camera: sortByDate(filterUniqueId(filterByDepart(data.crew, 'Visual Effects'))) }
				const visual = { 'Visual Effects': sortByDate(filterUniqueId(filterByDepart(data.crew, 'Lighting'))) }
				const lighting = { Lighting: sortByDate(filterUniqueId(filterByDepart(data.crew, 'Writing'))) }
				const temp = { ...actor, ...director, ...writer, ...producer, ...camera, ...visual, ...lighting }
				setCredits(
					Object.keys(temp)
						.map((k) => {
							return { key: k, value: temp[k] }
						})
						.sort((a, b) => {
							return b.value.length - a.value.length
						})
				)
			})
			.catch((e) => console.warn(e))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const expand = (e) => {
		bio.current.style.height = 'auto'
		e.target.style.display = 'none'
	}

	!!credits && console.log(credits[0].value.map((item) => item.release_date))

	return (
		!!person && (
			<>
				<MoviePersonHeader>
					<div className='wrapper'>
						<Ambilight>
							<img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
							<img id='amb' src={`https://image.tmdb.org/t/p/w45${person.profile_path}`} alt='Ambilight' />
						</Ambilight>
						<h2>{person.name}</h2>
						<p>
							{formatDate(person.birthday)}
							{!!person.deathday && <span> - {formatDate(person.deathday)}</span>}{' '}
							{!!person.place_of_birth && (
								<span>
									<CircleSeparator>●</CircleSeparator> {getFirstLastWord(person.place_of_birth)}
								</span>
							)}
						</p>
					</div>
				</MoviePersonHeader>
				{!!person.biography && (
					<>
						<Title>Biography</Title>
						<ParagraphShortBio ref={bio}>
							{person.biography}
							{!!bio && !!bio.current && bio.current.scrollHeight > bio.current.offsetHeight && <span onClick={expand}>See full bio</span>}
						</ParagraphShortBio>
					</>
				)}
				{!!credits && <>{credits.map((item) => item.value.length !== 0 && <MoviesSlider key={item.key} catTitle={item.key} movies={item.value} />)}</>}
			</>
		)
	)
}

export default withRouter(MoviePersonPage)
