import styled, { keyframes } from 'styled-components'

import { IoFilter } from 'react-icons/io5'
import { BiSort } from 'react-icons/bi'
import { TbGridDots } from 'react-icons/tb'
import { HiMenu } from 'react-icons/hi'

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	align-items: center;
	justify-content: space-between;
	height: 50px;
	padding: 0 15px;
	border-bottom: 1px solid hsl(0, 0%, 20%);
	box-shadow: 0 -15px 15px 15px black;
	z-index: 1;
`

const LeftButtons = styled.span`
	display: inline-flex;
`

const RightButtons = styled.span`
	display: inline-flex;
`

const Button = styled.button`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	background-color: unset;
	border: none;
	cursor: pointer;
	color: white;
	width: 32px;
	aspect-ratio: 1 / 1;
	margin: 0 5px;
	color: grey;
	& :hover {
		color: white;
	}
`

const SettingsMenuButton = styled(Button)`
	font-size: 32px;
`

const ViewMenuButton = styled(Button)`
	font-size: 26px;
`

const SortButton = styled(Button)`
	font-size: 24px;
`

const SortIcon = styled(BiSort)`
	transform: scale(1.33, 1);
`

const FilterButton = styled(Button)`
	font-size: 32px;
`

const FilterIcon = styled(IoFilter)`
	transform: scale(0.8, 1.1);
`

const gradientAnimation = keyframes`
		0% { background-position: 	0% 50%; }
	 50% { background-position: 100% 50%; }
	100% { background-position: 	0% 50%; }
`

const Title = styled.span`
	font-size: 32px;
	font-weight: 700;
	user-select: none;
	background: linear-gradient(
		-45deg, 
		rgba(255, 0, 0, 1) 0%,
		rgba(255, 154, 0, 1) 5%,
		rgba(208, 222, 33, 1) 10%,
		rgba(79, 220, 74, 1) 15%,
		rgba(63, 218, 216, 1) 20%,
		rgba(47, 201, 226, 1) 25%,
		rgba(28, 127, 238, 1) 30%,
		rgba(95, 21, 242, 1) 35%,
		rgba(186, 12, 248, 1) 40%,
		rgba(251, 7, 217, 1) 45%,
		rgba(255, 0, 0, 1) 50%,
		rgba(255, 154, 0, 1) 55%,
		rgba(208, 222, 33, 1) 60%,
		rgba(79, 220, 74, 1) 65%,
		rgba(63, 218, 216, 1) 70%,
		rgba(47, 201, 226, 1) 75%,
		rgba(28, 127, 238, 1) 80%,
		rgba(95, 21, 242, 1) 85%,
		rgba(186, 12, 248, 1) 90%,
		rgba(251, 7, 217, 1) 95%,
		rgba(255, 0, 0, 1) 100%
	);
	-webkit-text-fill-color: transparent;
	background-clip: text;
	-webkit-background-clip: text;
	background-size: 1000% 1000%;
	animation: 30s linear infinite ${gradientAnimation};
`

export default function () {
	return (
		<Header>
			<LeftButtons>
				<SortButton aria-label="Sort Datums">
					<SortIcon />
				</SortButton>
				<FilterButton aria-label="Filter Datums">
					<FilterIcon />
				</FilterButton>
			</LeftButtons>
			<Title>Datums</Title>
			<RightButtons>
				<ViewMenuButton aria-label="Views Menu">
					<TbGridDots />
				</ViewMenuButton>
				<SettingsMenuButton aria-label="Main Menu">
					<HiMenu />
				</SettingsMenuButton>
			</RightButtons>
		</Header>
	)
}