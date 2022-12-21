import { useState, useEffect } from 'react'
import Head from 'next/head'

import Layout from '../components/layout.js'
import Header from '../components/header.js'
import Tag from '../components/tag.js'
import { convertHslValuesToHexString, getRandomHslValues } from '../color.js'

export default function Home() {
  const [tag, setTag] = useState({
    name: 'test name',
    value: 'some value',
    color: '#000000',
    onClick: changeToRandomColor
  })

  useEffect(() => {
    setTag({
      ...tag,
      color: convertHslValuesToHexString(getRandomHslValues())
    })
  }, [])

  function changeToRandomColor() {
    setTag({
      ...tag,
      color: convertHslValuesToHexString(getRandomHslValues())
    })
  }

  return (
    <Layout>
      <Head>
        <title>Datums - Private Personal Information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Tag {...tag} />
    </Layout>
  )
}