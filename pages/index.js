import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import { SyncLoader } from 'react-spinners'
import useSWR from 'swr'

import Layout from '../components/layout.js'
import Header from '../components/header.js'
import Datum from '../components/datum.js'
import DatumBar from '../components/datum-bar.js'

const DatumList = styled.ul`
  margin-bottom: 50px;
`

const Loading = styled(SyncLoader)`
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function ListView() {
  const { data, error } = useSWR('/api/datums', fetcher)

  return (
    <Layout>
      <Head>
        <title>Datums - Private Personal Information</title>
        <link rel="icon" href="icons/datums.ico" />
        <meta name="description" content="The privacy-focused app store for the open web." />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" />
        <meta name="theme-color" content="#0d0d0d" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Header />
      <DatumList>
        {data ? data.map(d => <Datum key={d.id} {...d} />) : <Loading color="hsl(0, 0%, 20%)" margin={4} cssOverride={{ display: 'flex' }} />}
      </DatumList>
      <DatumBar />
    </Layout>
  )
}