import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import { v4 as uuid } from 'uuid'

import Layout from '../components/layout.js'
import Header from '../components/header.js'
import Datum from '../components/datum.js'
import DatumBar from '../components/datum-bar.js'

import { getRandomTag } from '../utils/random.js'

const DATUMS = 100
const MAX_TAGS = 6

const DatumList = styled.ul`
 > * {
   &:last-child {
     border-bottom: none;
    }
}
`

export async function getStaticProps() {
  let datums = []
  for (let i = 0; i < DATUMS; i++) {
    let tags = []
    const tagCount = Math.ceil(Math.random() * MAX_TAGS)
    for (let j = 0; j < tagCount; j++) {
      tags.push(getRandomTag())
    }
    datums.push({
      id: uuid(),
      time: Date.now(),
      tags,
    })
  }  

  return {
    props: {
      datums,
    },
  }
}

export default function ListView({ datums }) {
  return (
    <Layout>
      <Head>
        <title>Datums - Private Personal Information</title>
        <link rel="icon" href="icons/datums.ico" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="theme-color" content="#0d0d0d" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Header />
      <DatumList>
        {datums.map(d => <Datum key={d.id} {...d} />)}
      </DatumList>
      <DatumBar />
    </Layout>
  )
}