import styled from 'styled-components'
import { BsThreeDots as MenuButtonIcon } from 'react-icons/bs'

import Tag from '../components/tag.js'

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
`

const ScrollContainer = styled.span`
	display: inline-flex;
	position: relative;
	overflow: scroll;
	padding: 10px 0;
	gap: 5px;
`

const Timestamp = styled.span`
	font-size: 12px;
	color: hsl(0, 0%, 20%);
	font-family: Nunito, Helvetica, sans-serif;
`
const MenuButton = styled.button``


export default function Datum({
	id,
	time,
	tags,
}) {
	return (
		<ListItem>
			<Tags>
				<ScrollContainer>
					{tags.map(t => <Tag key={t} {...t} />)}
				</ScrollContainer>
			</Tags>
			<span>
				<Timestamp>{time}</Timestamp>
				<MenuButton>
					<MenuButtonIcon />
				</MenuButton>
			</span>
		</ListItem>
	)
}