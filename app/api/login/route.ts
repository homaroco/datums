export async function GET(req: Request) {
  console.log(await req.json())
  return Response.json()
}

export async function POST(req: Request) {
  try {
    console.log(await req.json())
    return Response.json({ message: 'login successful' })
  } catch (e) {
    return Response.json({ error: e })
  }
}