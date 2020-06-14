import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`

	*,
  ::after,
	::before  {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
		-webkit-tap-highlight-color: transparent;
	}
	
	body {
    display: flex;
    flex-direction: column;
    height: 100vh;
		background: ${({ theme }) => theme.colors.background};
	}

	h1,h2,h3,h4,h5,h6,span,p,label {
		color: ${({ theme }) => theme.colors.text};
	}

	h1,h2,h3,h4,h5,h6 {
		font-weight: 700;
	}

	a {
		text-decoration: none;
		color: ${({ theme }) => theme.colors.text};
	}

	input{
		border-color: transparent;
	}

	.active {
		opacity: 1;
	}

	.button {
	margin: 0 1rem;
	color: ${({ theme }) => theme.colors.text};
	background-color: ${({ theme }) => theme.colors.navBar};
	padding: 10px 20px;
	font-size: 13px;
	border: 1px solid ${({ theme }) => theme.colors.text};
	border-radius: 2rem;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.6);
	cursor: pointer;
	:focus {
		outline: none;
	}
}

	
`
