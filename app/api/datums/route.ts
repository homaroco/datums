import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { PrismaClient } from '@prisma/client'

import { getRandomTag } from '../../lib/random'
import {
  convertHslValuesToHexString,
  getRandomHslValues,
} from '../../lib/color'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

function color() {
  return convertHslValuesToHexString(getRandomHslValues())
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  console.log('userId', userId)
  let datums
  try {
    datums = await prisma.datum.findMany({
      where: {
        userId,
      },
    })
  } catch (e) {
    console.error(e)
  }
  return Response.json(datums)
}

export async function POST(req: Request) {
  try {
    const datum = await req.json()
    await prisma.datum.create({
      data: datum,
    })
    return Response.json({ message: 'new datum added' })
  } catch (e) {
    return Response.json({ error: e })
  }
}
