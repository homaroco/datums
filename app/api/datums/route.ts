import { v4 as uuid } from 'uuid'

import { getRandomTag } from '../../lib/random'

const DATUMS = 10
const MAX_TAGS = 6

export function GET(req: Request) {
	let datums: any[] = []
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

	return Response.json(datums)
}
