import styled from 'styled-components'

export const SearchBar = styled.div`
	margin: 30px;
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
	background-color: rgba(255, 255, 255, 0.3);
	padding: 10px;
	border-radius: 2rem;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	input {
		width: 100%;
		color: ${({ theme }) => theme.colors.text};
		border: none;
		background-color: transparent;
		margin: 0 1rem;
		font-size: 1rem;
		:focus {
			outline: none;
		}
		::-webkit-input-placeholder {
			color: ${({ theme }) => theme.colors.subText};
		}
	}
	svg {
		stroke: ${({ theme }) => theme.colors.subText};
		width: 1.3rem;
		height: auto;
		margin: 0 0.5rem;
	}
`

export const HideSearch = styled.div`
	transition: all 0.6s linear;
	opacity: 0;
`

export const Title = styled.h5`
	font-size: 14px;
	padding: 10px 20px 4px 20px;
`

export const Showroom = styled.div`
	display: flex;
	overflow-x: scroll;
	transition: all 2s linear;
	-webkit-overflow-scrolling: touch;
	&::-webkit-scrollbar {
		display: none;
	}
`

export const Unavailable = styled.div`
	display: flex;
	overflow-x: hidden;
	.unavailableWrapper {
		display: flex;
		.unavailableItem {
			margin: 10px 0 10px 20px;
			height: 300px;
			width: 200px;
			border-radius: 5px;
			background-color: ${({ theme }) => theme.colors.navBar};
		}
	}
`

export const Card = styled.div`
	margin: 10px 0 10px 20px;
	height: 300px;
	:last-child {
		padding-right: 15px;
	}
	.poster {
		background-color: ${({ theme }) => theme.colors.navBar};
		border-radius: 5px;
		width: 200px;
		height: 300px;
		object-fit: cover;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		transition: all 0.2s linear;
		cursor: pointer;
		:hover {
			transform: scale(1.02);
			filter: brightness(105%);
		}
	}
	.noImage {
		border-radius: 5px;
		height: 300px;
		width: 200px;
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		transition: all 0.2s linear;
		background-color: ${({ theme }) => theme.colors.grey};
		cursor: pointer;
		:hover {
			transform: scale(1.02);
			filter: brightness(105%);
		}
	}
`

export const PageWrapper = styled.section`
	background: linear-gradient(to bottom, ${({ theme }) => theme.colors.backgroundTransparent}, ${({ theme }) => theme.colors.background}), url(${({ backdrop }) => backdrop});
	background-position: center top;
	background-size: 100% 55vw;
	background-repeat: no-repeat;
	.addTo {
		margin-top: 15px;
		margin-bottom: 5px;
		display: flex;
		justify-content: center;
	}
`
export const Ambilight = styled.div`
	width: 170px;
	display: block;
	margin: 0 auto;
	position: relative;
	img {
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
		width: 100%;
		border-radius: 5px;
	}
	#amb {
		position: absolute;
		z-index: -1;
		filter: blur(25px);
		width: 90%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
`

export const CircleSeparator = styled.span`
	font-size: 0.4rem;
	vertical-align: 2px;
	padding: 0 3px;
`

export const MovieDetailHeader = styled.header`
	display: flex;
	justify-content: center;
	.wrapper {
		width: 100%;
		margin-top: 50px;
	}
	h2 {
		color: white;
		padding: 10px 5px;
		display: block;
		width: 100%;
		text-align: center;
	}
	p {
		font-size: 0.8rem;
		text-align: center;
		color: #fafafa;
	}
	span {
		color: #fafafa;
	}
	.genre {
		margin-top: 20px;
		overflow: hidden;
		height: 25px;
	}
	.ratings {
		margin-top: 25px;
		display: flex;
		justify-content: center;
		.svg {
			width: 30px;
			margin-left: 10px;
			:first-child {
				margin-left: 0;
			}
		}
		span {
			color: ${({ theme }) => theme.colors.text};
			font-size: 12px;
			vertical-align: 71%;
			padding: 0.6rem;
		}
	}
`
export const MoviePersonHeader = styled.header`
	display: flex;
	justify-content: center;
	.wrapper {
		width: 100%;
		margin-top: 30px;
	}
	h2 {
		padding: 15px 5px;
		display: block;
		width: 100%;
		text-align: center;
	}
	p {
		font-size: 0.8rem;
		text-align: center;
	}
`

export const Video = styled.div`
	width: 85%;
	margin: 0 auto;
	margin-top: 20px;
	background-color: ${({ theme }) => theme.colors.navBar};
	border-radius: 5px;
	.iframe-container {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		height: 0;
		iframe {
			border-radius: 5px;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
		}
	}
`
export const MetacriticColor = styled.div`
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 13px;
	margin-left: 10px;
	width: 30px;
	height: 30px;
	background-color: ${({ color }) => color};
	border-radius: 6px;
	font-weight: 700;
	margin-top: 2px;
	span {
		padding: 0;
	}
`

export const Genre = styled.span`
	color: ${({ isDarkTheme }) => !isDarkTheme && 'black !important'};
	font-size: 10px;
	background-color: ${({ isDarkTheme }) => !isDarkTheme && '#fafafa'};
	border: 1px solid #fafafa;
	border-radius: 2rem;
	padding: 2px 7px;
	cursor: pointer;
	margin: 4px;
	display: inline-block;
`

export const Paragraph = styled.p`
	padding: 0 20px;
	font-size: 12px;
	line-height: 1.4rem;
`

export const ParagraphShortBio = styled(Paragraph)`
	height: 2.8rem;
	overflow: hidden;
	position: relative;
	span {
		position: absolute;
		right: 20px;
		bottom: 0;
		font-size: 12px;
		cursor: pointer;
		text-decoration: underline;
		padding-left: 7px;
		background-color: ${({ theme }) => theme.colors.background};
	}
`

export const PersonCard = styled.div`
	margin: 10px 0 0 10px;
	position: relative;
	transition: all 0.2s linear;
	cursor: pointer;
	:hover {
		filter: brightness(105%);
	}
	:first-child {
		margin-left: 20px;
	}
	:last-child {
		padding-right: 10px;
		span {
			right: 10px;
		}
	}
	img {
		height: 150px;
		border-radius: 5px;
	}
	span {
		border-radius: 5px;
		background: linear-gradient(to bottom, transparent, black 110%);
		position: absolute;
		color: white;
		right: 0;
		left: 0;
		bottom: 4px;
		padding: 10px;
		text-align: center;
		font-size: 9px;
		font-weight: 700;
		.role {
			color: #b7b7b7;
			text-transform: uppercase;
			padding-top: 5px;
			font-size: 7.5px;
		}
	}
`

export const SVG = styled.svg`
	width: 40px;
	vertical-align: -4px;
`
