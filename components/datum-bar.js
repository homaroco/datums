import styled from 'styled-components'
import { BsPlus as AddDatumButtonIcon} from 'react-icons/bs'

import Box from './box'

const InputBar = styled(Box)`
	position: sticky;
	bottom: 0;
	height: 50px;
	border-top: 1px solid hsl(0, 0%, 20%);
	justify-content: space-between;
`

const AddDatumButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 42px;
	width: 48px;
	aspect-ratio: 1 / 1;
`

export default function DatumBar() {
	return (
		<InputBar>
			<AddDatumButton>
				<AddDatumButtonIcon />
			</AddDatumButton>
		</InputBar>
	)
}