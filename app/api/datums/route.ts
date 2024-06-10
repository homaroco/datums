import { v4 as uuid } from 'uuid'
import moment from 'moment'

import { getRandomTag } from '../../lib/random'
import { convertHslValuesToHexString, getRandomHslValues } from '../../lib/color'

function color() {
	return convertHslValuesToHexString(getRandomHslValues())
}

const initDatums = [
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'caffeine', value: 100, unit: 'mg', color: color() },
			{ name: 'coffee', color: color() },
			{ name: '$', value: 100, color: color() },

		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'todo', value: 'pay bills', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'meditate', color: color() },
			{ name: 'start', value: 'meditate', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'stop', value: 'meditate', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'no snooze', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: '$', value: 23.57, color: color() },
			{ name: 'gas', color: color() },
			{ name: 'mpg', value: 29, color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'done', color: color() },
			{ name: 'todo', value: 'dry cleaning', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'start', value: 'nap', color: color() },
		]
	},
	{
		id: uuid(),
		time: moment().valueOf(),
		tags: [
			{ name: 'stop', value: 'nap', color: color() },
		]
	},
]

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
	console.log(initDatums)
	return Response.json(initDatums)
}
