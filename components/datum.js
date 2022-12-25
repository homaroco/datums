import styled from 'styled-components'
import { BsThreeDots as MenuButtonIcon } from 'react-icons/bs'

import Tag from '../components/tag.js'

import { getTimestamp } from '../utils/index.js'

const ListItem = styled.li`
	display: flex;
	position: relative;
	margin: 0 10px;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid hsl(0, 0%, 20%);
`

const Tags = styled.span`
	display: inline-flex;
	position: relative;
	flex-grow: 1;
	justify-content: flex-start;
	overflow: auto;
`

const ScrollContainer = styled.span`
	display: inline-flex;
	position: relative;
	overflow: hidden;
	padding: 10px 0;
	padding-right: 20px;
	gap: 5px;
	overflow: auto;
`

const Fade = styled.span`
	position: absolute;
	right: 0;
	top: 10px;
	width: 30px;
	height: 30px;
	background: linear-gradient(90deg, hsla(0, 0%, 5%, 0) 0%, hsla(0, 0%, 5%, 1) 100%);
`

const RightItems = styled.span`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
`

const Timestamp = styled.span`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	font-size: 12px;
	color: hsl(0, 0%, 20%);
	margin-left: 10px;
	white-space: nowrap;
`

const MenuButton = styled.button`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	color: grey;
	font-size: 24px;
	margin-left: 10px;
	height: 30px;
	aspect-ratio: 1 / 1;
	& :hover {
		color: white;
	}
`


export default function Datum({
	id,
	time,
	tags,
}) {
	return (
		<ListItem>
			<Tags>
				<ScrollContainer>
					{tags.map(t => <Tag key={t.id} {...t} />)}
				</ScrollContainer>
				<Fade />
			</Tags>
			<RightItems>
				<Timestamp>{getTimestamp(time)}</Timestamp>
				<MenuButton aria-label="Datum Menu">
					<MenuButtonIcon />
				</MenuButton>
			</RightItems>
		</ListItem>
	)
}