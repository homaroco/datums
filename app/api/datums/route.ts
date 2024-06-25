import { v4 as uuid } from 'uuid'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

function assignTagsToDatums(datums: any, tags: any) {
  let datumsWithTags: any[] = []
  datums.forEach((datum: any) => {
    datum.tags = []
    tags.forEach((tag: any) => {
      console.log('uuids:', datum.uuid, tag.datumUuid)
      if (datum.uuid === tag.datumUuid) {
        datum.tags.push(tag)
      }
    })
    datumsWithTags.push(datum)
  })
  return datumsWithTags
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  let datums: any[] = []
  try {
    datums = await prisma.datum.findMany({
      where: {
        userId,
      },
    })
  } catch (e) {
    console.error(e)
  }
  const uuids = datums.map((datum) => datum.uuid)
  let tags: any[] = []
  try {
    tags = await prisma.tag.findMany({
      where: {
        datumUuid: {
          in: uuids,
        },
      },
    })
  } catch (e) {
    console.error(e)
  }

  return Response.json(assignTagsToDatums(datums, tags))
}

export async function POST(req: Request) {
  try {
    const datum = await req.json()
    console.log(datum)
    await prisma.datum.create({
      data: {
        userId: datum.userId,
        createdAt: datum.createdAt,
        uuid: datum.uuid,
      },
    })
    const tags = datum.tags.map((tag: any) => ({
      datumUuid: datum.uuid,
      name: tag.name,
      value: tag.value ? tag.value : null,
      unit: tag.unit ? tag.unit : null,
      color: tag.color,
    }))
    await prisma.tag.createMany({
      data: tags,
    })
    return Response.json({ message: 'new datum added' })
  } catch (e) {
    return Response.json({ error: e })
  }
}
