import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { PrismaClient } from '@prisma/client'

import { getRandomTag } from '../../lib/random'
import { convertHslValuesToHexString, getRandomHslValues } from '../../lib/color'

const prisma = new PrismaClient()

function color() {
	return convertHslValuesToHexString(getRandomHslValues())
}

const initDatums = [
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'caffeine', value: 100, unit: 'mg', color: color() },
			{ name: 'coffee', color: color() },
			{ name: '$', value: 100, color: color() },

		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'todo', value: 'pay bills', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'meditate', color: color() },
			{ name: 'start', value: 'meditate', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'stop', value: 'meditate', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'no snooze', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'habit', value: 'make bed', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: '$', value: 23.57, color: color() },
			{ name: 'gas', color: color() },
			{ name: 'mpg', value: 29, color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'done', color: color() },
			{ name: 'todo', value: 'dry cleaning', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'start', value: 'nap', color: color() },
		]
	},
	{
		id: uuid(),
		createdAt: moment().valueOf(),
		tags: [
			{ name: 'stop', value: 'nap', color: color() },
		]
	},
]

const DATUMS = 10
const MAX_TAGS = 6

export async function GET(req: Request) {
	const datums = await prisma.datum.findMany()
	return Response.json(datums)
}

export async function POST(req: Request) {
	try {
		const datum = await req.json()
		await prisma.datum.create({
			data: {
				uuid: uuid(),
				userId: 'testUserId',
			}
		})
		return Response.json({ message: 'new datum added' })
	} catch (e) {
		return Response.json({ error: e })
	}
}