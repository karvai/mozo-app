import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNav = styled.nav`
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: space-around;
	background-color: ${({ theme }) => theme.colors.navBar};
	box-shadow: 0px 0px 5px black;
	z-index: 10;
`

const StyledNavLink = styled(NavLink)`
	width: 5rem;
	text-decoration: none;
	color: ${({ theme }) => theme.colors.subText};
	transition: all 0.1s linear;
	text-align: center;
	padding: 0.5rem 0;
	font-size: 0.8rem;
	-webkit-tap-highlight-color: transparent;
	svg {
		stroke: ${({ theme }) => theme.colors.subText};
		width: auto;
		height: 30px;
		transition: all 0.1s linear;
		margin: 0 auto;
		display: block;
		fill: ${({ theme }) => theme.colors.subText};
	}
	&.active {
		color: ${({ theme }) => theme.colors.primary};
		svg {
			fill: ${({ theme }) => theme.colors.primary};
			stroke: ${({ theme }) => theme.colors.primary};
		}
	}
`

export default function NavBar() {
	return (
		<StyledNav>
			<StyledNavLink exact to='/'>
				<svg viewBox='0 0 512 512'>
					<rect x={48} y={96} width={416} height={320} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={384} y={336} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={384} y={256} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={384} y={176} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={384} y={96} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={48} y={336} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={48} y={256} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={48} y={176} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={48} y={96} width={80} height={80} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={128} y={96} width={256} height={160} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
					<rect x={128} y={256} width={256} height={160} rx={28} ry={28} fill='none' strokeLinejoin='round' strokeWidth={32} />
				</svg>
				Movies
			</StyledNavLink>
			<StyledNavLink to='/scan'>
				<svg viewBox='0 0 512 512'>
					<path d='M384 400.33l35.13-.33A29 29 0 00448 371.13V140.87A29 29 0 00419.13 112l-35.13.33M128 112l-36.8.33c-15.88 0-27.2 13-27.2 28.87v230.27c0 15.87 11.32 28.86 27.2 28.86L128 400M384 192v128M320 160v192M256 176v160M192 160v192M128 192v128' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth={32} />
				</svg>
				Scan
			</StyledNavLink>
			<StyledNavLink to='/profile'>
				<svg viewBox='0 0 512 512'>
					<path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-50.22 116.82C218.45 151.39 236.28 144 256 144s37.39 7.44 50.11 20.94c12.89 13.68 19.16 32.06 17.68 51.82C320.83 256 290.43 288 256 288s-64.89-32-67.79-71.25c-1.47-19.92 4.79-38.36 17.57-51.93zM256 432a175.49 175.49 0 01-126-53.22 122.91 122.91 0 0135.14-33.44C190.63 329 222.89 320 256 320s65.37 9 90.83 25.34A122.87 122.87 0 01382 378.78 175.45 175.45 0 01256 432z' />
				</svg>
				Profile
			</StyledNavLink>
		</StyledNav>
	)
}
