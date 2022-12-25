import { useState } from 'react'
import styled from 'styled-components'
import { BsPlus as AddDatumButtonIcon } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'

import Box from './box'
import Tag from '../components/tag.js'
import { getRandomTag } from '../utils/random.js'

const InputBar = styled(Box)`
	position: sticky;
	bottom: 0;
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
for (let i = 0; i < 2; i++) {
	initTags.push(getRandomTag({ values: false }))
}

export default function DatumBar() {
	const [tags, setTags] = useState(initTags)
	const [inputValue, setInputValue] = useState('')
	const [inputMode, setInputMode] = useState(false)

	function convertButtonToInput() {
		setInputMode(true)
	}

	function convertInputToButton() {
		setInputMode(false)
	}

	function updateInputValue(e) {
		setInputValue(e.target.value)
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
				{initTags.map(t => <Tag key={t.id} {...t} />)}
				{inputMode
					? <NewTagInput value={inputValue} onChange={updateInputValue} />
					: <NewTagButton />
				}
			</TagsContainer>
			<AddDatumButton>
				<AddDatumButtonIcon />
			</AddDatumButton>
		</InputBar>
	)
}