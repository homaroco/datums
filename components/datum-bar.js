import { useState } from 'react'
import styled from 'styled-components'
import { BsPlus as AddDatumButtonIcon } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'

import Box from './box'
import Tag from '../components/tag.js'
import { getRandomTag } from '../utils/random.js'

const InputBar = styled(Box)`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 50px;
	border-top: 1px solid hsl(0, 0%, 20%);
	justify-content: space-between;
`

const TagsContainer = styled(Box)`
	display: inline-flex;
	gap: 5px;
	margin-left: 10px;
`

const TagInputButton = styled.button`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	border: 2px solid grey;
	height: 30px;
	border-radius: 5px;
	color: grey;
	font-family: Nunito;
	font-weight: 700;
	font-size: 16px;
	padding-right: 10px;
	padding-left: 5px;
	white-space: nowrap;
	width: 100px;
	&:hover {
		border-color: white;
		color: white;
	}
`

const TagInputButtonIcon = styled(FaPlus)`
	/* padding: 10px; */
	/* width: 20px;
	height: 20px; */
	margin-right: 5px;
	margin-left: 3px;
	font-size: 12px;
`

const TagInput = styled.input`
	border: 2px solid grey;
	height: 30px;
	border-radius: 5px;
	color: white;
	font-family: Nunito;
	font-weight: 700;
	font-size: 16px;
	width: 100px;
	padding: 0 10px;
	&:hover {
		border-color: white;
	}
	&:focus {
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

const initTags = []
for (let i = 0; i < 3; i++) {
	initTags.push(getRandomTag({ values: true }))
}

export default function DatumBar() {
	const [state, setState] = useState({
		tags: initTags,
		input: '',
		newTagInputMode: false,
	})

	function convertButtonToInput() {
		setState({
			...state,
			newTagInputMode: true
		})
	}

	function convertInputToButton() {
		setState({
			...state,
			newTagInputMode: false,
		})
	}

	const NewTagButton = () => (
		<TagInputButton onClick={convertButtonToInput}>
			<TagInputButtonIcon />
			New tag
		</TagInputButton>
	)

	const NewTagInput = () => (
		<TagInput autoFocus onBlur={convertInputToButton} />
	)

	return (
		<InputBar>
			<TagsContainer>
				{state.tags.map(t => <Tag key={t.id} {...t} />)}
				{state.newTagInputMode ? <NewTagInput /> : <NewTagButton aria-label="New Tag" />}
			</TagsContainer>
			<AddDatumButton aria-label="Add Datum">
				<AddDatumButtonIcon />
			</AddDatumButton>
		</InputBar>
	)
}