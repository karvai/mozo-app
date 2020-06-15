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
				})
				.then(() => {
					setEmail('')
					setPassword('')
					setError()
				})
				.catch((e) => console.warn(e))
	}, [cred])

	useEffect(() => {
		!!currentUser &&
			dbUsers
				.doc(currentUser.uid)
				.get()
				.then((doc) => setMyCollection(doc.data()))
				.catch((e) => console.warn(e))
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
						setError(error)
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
			.catch((e) => console.warn(e))
	}

	return
	;<>
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
	</>
}
