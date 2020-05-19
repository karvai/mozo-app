import React from 'react'
import Movies from './components/Movies'
import Scan from './components/Scan'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { lightTheme, darkTheme } from './styles/themes'
import { GlobalStyles } from './styles/global'
import styled, { ThemeProvider } from 'styled-components'

const ContentWrapper = styled.div`
	padding-bottom: 61px;
`

export default function MozoApp() {
	return (
		<ThemeProvider theme={darkTheme}>
			<GlobalStyles />
			<BrowserRouter>
				<ContentWrapper>
					<Switch>
						<Route path='/' exact component={Movies} />
						<Route path='/scan' component={Scan} />
						<Route path='/profile' component={Profile} />
					</Switch>
				</ContentWrapper>
				<NavBar />
			</BrowserRouter>
		</ThemeProvider>
	)
}
