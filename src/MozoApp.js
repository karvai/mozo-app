import React, { useState, useEffect } from 'react'
import MoviesPage from './components/Movies/MoviesPage'
import ScanPage from './components/Scan/ScanPage'
import ProfilePage from './components/Profile/ProfilePage'
import NavBar from './components/NavBar'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { lightTheme, darkTheme } from './styles/themes'
import { GlobalStyles } from './styles/global'
import styled, { ThemeProvider } from 'styled-components'
import MovieDetailPage from './components/Movies/MovieDetailPage'
import MoviePersonPage from './components/Movies/MoviePersonPage'
import base from './api/firebase'

const BottomPadding = styled.div`
	padding-bottom: 75px;
`

export default function MozoApp() {
	const [searchQuery, setSearchQuery] = useState()
	const [currentUser, setCurrentUser] = useState()
	const [isDarkTheme, setIsDarkTheme] = useState(!!localStorage.getItem('isDarkTheme') ? JSON.parse(localStorage.getItem('isDarkTheme').toLowerCase()) : true)

	useEffect(() => {
		base.auth().onAuthStateChanged(setCurrentUser)
	}, [])

	useEffect(() => {
		localStorage.setItem('isDarkTheme', isDarkTheme)
	}, [isDarkTheme])

	return (
		<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
			<GlobalStyles />
			<BrowserRouter>
				<BottomPadding>
					<Switch>
						<Route exact path='/' render={() => <MoviesPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
						<Route exact path={['/movie', '/movie/p']}>
							<Redirect to='/' />
						</Route>
						<Route exact path='/movie/:id' render={() => <MovieDetailPage currentUser={currentUser} isDarkTheme={isDarkTheme} />} />
						<Route exact path='/movie/p/:id' component={MoviePersonPage} />
						<Route exact path='/scan' render={() => <ScanPage setSearchQuery={setSearchQuery} currentUser={currentUser} />} />
						<Route exact path='/profile' render={() => <ProfilePage currentUser={currentUser} setIsDarkTheme={setIsDarkTheme} />} />
					</Switch>
				</BottomPadding>
				<NavBar />
			</BrowserRouter>
		</ThemeProvider>
	)
}
