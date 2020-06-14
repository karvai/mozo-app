import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { withRouter, Redirect } from 'react-router-dom'
import base from '../../api/firebase'

const LoginWrapper = styled.div`
	height: calc(100vh - 75px);
	display: flex;
	justify-content: center;
	align-items: center;
	form {
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
		p {
			text-align: center;
			font-size: 12px;
			color: red;
		}
		.center {
			display: flex;
			justify-content: center;
		}
		button {
			margin-top: 16px;
		}
	}
`

function LogInPage({ history, currentUser }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState()

	const handleSignIn = async (event) => {
		event.preventDefault()
		try {
			await base.auth().signInWithEmailAndPassword(email, password)
			history.push('/profile')
		} catch (error) {
			setError(error.message)
		}
	}

	const handleRegister = async (event) => {
		event.preventDefault()
		try {
			await base.auth().createUserWithEmailAndPassword(email, password)
			history.push('/profile')
		} catch (error) {
			setError(error.message)
		}
	}

	if (!!currentUser) {
		return <Redirect to='/profile' />
	}

	return (
		<LoginWrapper>
			<form>
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
				{!!error && <p>{error}</p>}
				<div className='center'>
					<button className='button' onClick={handleSignIn}>
						Sign In
					</button>

					<button className='button' onClick={handleRegister}>
						Register
					</button>
				</div>
			</form>
		</LoginWrapper>
	)
}

export default withRouter(LogInPage)
