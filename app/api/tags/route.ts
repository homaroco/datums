import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { PrismaClient } from '@prisma/client'

import { getRandomTag } from '../../lib/random'
import { convertHslValuesToHexString, getRandomHslValues } from '../../lib/color'

const prisma = new PrismaClient()

function color() {
	return convertHslValuesToHexString(getRandomHslValues())
}

export async function GET(req: Request) {
	const tags = await prisma.tag.findMany()
	return Response.json(tags)
}

export async function POST(req: Request) {
	try {
		const tags = await req.json()
		await prisma.tag.createMany({
			data: tags
		})
		return Response.json({ message: 'new tags added' })
	} catch (e) {
		return Response.json({ error: e })
	}
}