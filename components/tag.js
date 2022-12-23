import styled from 'styled-components'
import { getContrastColor } from '../utils/color.js'

const Container = styled.span`
	display: inline-flex;
	position: relative;
	border-radius: 5px;
	overflow: hidden;
	cursor: pointer;
	white-space: nowrap;
	font-family: Nunito, Helvetica, sans-serif;
	height: 30px;
	user-select: none;
`

const Name = styled.span`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	background-color: ${p => p.color};
	color: ${p => p.contrastColor};
	font-weight: 700;
	height: 100%;
	padding-left: 8px;
	padding-right: 6px; /* -2 from value border */
`

const Value = styled.span`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	border: 2px solid ${p => p.color};
	color: ${p => p.color};
	background-color: ${p => p.contrastColor};
	border-radius: 5px;
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	font-weight: 700;
	height: 100%;
	padding: 0 6px;
`

export default function Tag({ name, value, color }) {
	const contrastColor = getContrastColor(color)
	const colors = { color, contrastColor }
	return (
		<Container>
			<Name {...colors}>{name}</Name>
			{value && <Value {...colors}>{value}</Value>}
		</Container>
	)
}