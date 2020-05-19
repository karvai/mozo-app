import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`

	*,
  ::after,
	::before  {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
	}
	
	body {
    display: flex;
    flex-direction: column;
    height: 100vh;
		background: ${({ theme }) => theme.colors.background};
	}

	h1,h2,h3,h4,h5,h6,span,p {
		color: ${({ theme }) => theme.colors.text};
	}

	
`
