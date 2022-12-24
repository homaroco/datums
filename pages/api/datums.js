import { v4 as uuid } from 'uuid'

import { getRandomTag } from '../../utils/random.js'

const DATUMS = 100
const MAX_TAGS = 6

let datums = []
for (let i = 0; i < DATUMS; i++) {
	let tags = []
	const tagCount = Math.ceil(Math.random() * MAX_TAGS)
	for (let j = 0; j < tagCount; j++) {
		tags.push(getRandomTag())
	}
	datums.push({
		id: uuid(),
		time: Date.now() - 36000 * DATUMS + i * 36000,
		tags,
	})
}

export default function handler(req, res) {
	res.status(200).json(datums)
}