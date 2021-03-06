import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import base from '../../api/firebase'
import MoviesSlider from '../Movies/MoviesSlider'
import { tmdbAPI } from '../../api/movieDB'

const ProfileWrapper = styled.div`
	h2 {
		margin-top: 30px;
		padding: 15px 5px;
		display: block;
		width: 100%;
		text-align: center;
	}
	p {
		text-align: center;
		font-size: 14px;
		margin: 0 20px;
	}
`

const LoginWrapper = styled.div`
	height: calc(100vh - 75px);
	display: flex;
	justify-content: center;
	align-items: center;
	.form {
		width: 400px;
		align-items: center;
		padding: 30px;
		border-radius: 10px;
		background-color: ${({ theme }) => theme.colors.navBar};
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		@media only screen and (max-width: 450px) {
			background-color: transparent;
			box-shadow: none;
		}
		label {
			font-size: 0.8rem;
		}
		h3 {
			margin-bottom: 25px;
			text-align: center;
			font-weight: 400;
		}
		.lock {
			margin: 0 auto;
			margin-bottom: 10px;
			width: 40px;
			height: 40px;
			background-color: #dc004e;
			border-radius: 2rem;
		}
		svg {
			stroke: white;
			width: 40px;
			padding: 7px;
		}
		input {
			font-size: 1rem;
			width: 100%;
			margin: 5px 0 15px 0;
			padding: 10px;
			border-radius: 5px;
			:focus {
				outline: none;
				box-shadow: 0 0 2pt 1pt #dc004e;
			}
		}
		button {
			margin-top: 16px;
		}
	}
`

export default function ProfilePage({ currentUser, setIsDarkTheme }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState()
	const [cred, setCred] = useState()
	const [myCollection, setMyCollection] = useState()
	const [myWishlistMovies, setMyWishlistMovies] = useState([])
	const [myDVDMovies, setDVDMovies] = useState([])
	const [myBDMovies, setBDMovies] = useState([])
	const [myUBDMovies, setUBDMovies] = useState([])
	const [myRecomMovies, setRecomMovies] = useState([])

	const dbUsers = base.firestore().collection('users')

	useEffect(() => {
		!!cred &&
			dbUsers
				.doc(cred.user.uid)
				.set({
					email: cred.user.email,
					wishlist: [],
					ownDVD: [],
					ownBD: [],
					ownUBD: [],
					ownList: [],
					recommendation: [],
				})
				.then(() => {
					setEmail('')
					setPassword('')
					setError()
				})
				.catch((e) => console.error(e))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cred])

	useEffect(() => {
		!!currentUser &&
			dbUsers
				.doc(currentUser.uid)
				.get()
				.then((doc) => setMyCollection(doc.data()))
				.catch((e) => console.error(e))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser])

	useEffect(() => {
		!!myCollection && myCollection.wishlist !== 0 && myCollection.wishlist.map((id) => tmdbAPI.getMovieDetail(id).then((data) => setMyWishlistMovies((prev) => [...prev, data])))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!myCollection && myCollection.wishlist])
	useEffect(() => {
		!!myCollection && myCollection.ownDVD !== 0 && myCollection.ownDVD.map((id) => tmdbAPI.getMovieDetail(id).then((data) => setDVDMovies((prev) => [...prev, data])))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myCollection && myCollection.ownDVD])
	useEffect(() => {
		!!myCollection && myCollection.ownBD !== 0 && myCollection.ownBD.map((id) => tmdbAPI.getMovieDetail(id).then((data) => setBDMovies((prev) => [...prev, data])))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!myCollection && myCollection.ownBD])
	useEffect(() => {
		!!myCollection && myCollection.ownUBD !== 0 && myCollection.ownUBD.map((id) => tmdbAPI.getMovieDetail(id).then((data) => setUBDMovies((prev) => [...prev, data])))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!myCollection && myCollection.ownUBD])
	useEffect(() => {
		!!myCollection && myCollection.recommendation !== 0 && myCollection.recommendation.map((id) => tmdbAPI.getMovieDetail(id).then((data) => setRecomMovies((prev) => [...prev, data])))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!myCollection && myCollection.recommendation])

	const handleSignIn = () => {
		base.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				setEmail('')
				setPassword('')
				setError()
			})
			.catch((error) => setError(error.message))
	}

	const handleRegister = () => {
		base.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((cred) => setCred(cred))
			.catch((error) => setError(error.message))
	}

	const handleDeleteUser = () => {
		const result = window.confirm(`Are you sure you want to delete account with email ${currentUser.email}?`)
		if (result) {
			base.auth()
				.currentUser.delete()
				.then(() => {
					setMyWishlistMovies([])
					setDVDMovies([])
					setBDMovies([])
					setUBDMovies([])
					setError('The account was deleted successfully!')
					setTimeout(() => {
						setError('')
					}, 3000)
				})
				.catch((error) =>
					setTimeout(() => {
						setError(error.message)
					}, 3000)
				)
		}
	}

	const handleThemeChange = () => {
		setIsDarkTheme((prev) => !prev)
	}

	const handleSignOut = () => {
		base.auth()
			.signOut()
			.then(() => {
				setMyWishlistMovies([])
				setDVDMovies([])
				setBDMovies([])
				setUBDMovies([])
			})
			.catch((e) => console.error(e))
	}

	return !!currentUser ? (
		<ProfileWrapper>
			<h2>My collection</h2>
			{myWishlistMovies.length !== 0 || myDVDMovies.length !== 0 || myBDMovies.length !== 0 || myUBDMovies.length !== 0 ? (
				<>
					{myWishlistMovies.length !== 0 && <MoviesSlider catTitle='Wish List' movies={myWishlistMovies} />}
					{myDVDMovies.length !== 0 && <MoviesSlider catTitle='DVD' movies={myDVDMovies} />}
					{myBDMovies.length !== 0 && <MoviesSlider catTitle='Blu-Ray' movies={myBDMovies} />}
					{myUBDMovies.length !== 0 && <MoviesSlider catTitle='Ultra HD Blu-Ray' movies={myUBDMovies} />}
					{myRecomMovies.length !== 0 && <MoviesSlider catTitle='Recommendations' movies={myRecomMovies} />}
				</>
			) : (
				<p className='center' style={{ padding: '50px 0' }}>
					Start adding your movies to the collection in the Movies tab
				</p>
			)}
			{!!error && <p className='error'>{error}</p>}
			<div className='center' style={{ margin: '10px 0' }}>
				<button className='button' onClick={handleThemeChange}>
					Theme
				</button>
				<button className='button' style={{ color: '#c51f1f' }} onClick={handleDeleteUser}>
					Delete Account
				</button>
				<button className='button' onClick={handleSignOut}>
					Sign Out
				</button>
			</div>
		</ProfileWrapper>
	) : (
		<LoginWrapper>
			<div className='form'>
				<div className='lock'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
						<path fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32' d='M336 208v-95a80 80 0 00-160 0v95'></path>
						<rect width='320' height='272' x='96' y='208' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32' rx='48' ry='48'></rect>
					</svg>
				</div>
				<h3>Sign in</h3>
				<div>
					<label>Email address</label>
					<div>
						<input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
				</div>
				<div>
					<label>Password</label>
					<div>
						<input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
				</div>
				{!!error && <p className='error'>{error}</p>}
				<div className='center'>
					<button className='button' onClick={handleSignIn}>
						Sign In
					</button>

					<button className='button' onClick={handleRegister}>
						Register
					</button>
				</div>
			</div>
		</LoginWrapper>
	)
}
