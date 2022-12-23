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

const TagInputButton = styled.button`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	border: 1px solid grey;
	height: 30px;
	border-radius: 5px;
	margin-left: 10px;
	color: grey;
	font-family: Nunito;
	font-weight: 700;
	font-size: 14px;
	padding-right: 10px;
	padding-left: 5px;
	white-space: nowrap;
	&:hover {
		border-color: white;
		color: white;
	}
`

const TagInputButtonIcon = styled(AddDatumButtonIcon)`
	/* padding: 10px; */
	width: 20px;
	height: 20px;
	margin-right: 5px;
`

const TagInput = styled.input`
	border: 1px solid grey;
	height: 30px;
	border-radius: 5px;
	margin-left: 10px;
	color: white;
	font-family: Nunito;
	font-weight: 700;
	font-size: 16px;
	&:hover {
		border-color: white;
	}
	&:active {
		border-color: white;
	}
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
			<TagInputButton>
				<TagInputButtonIcon />
				New tag
			</TagInputButton>
			<AddDatumButton>
				<AddDatumButtonIcon />
			</AddDatumButton>
		</InputBar>
	)
}