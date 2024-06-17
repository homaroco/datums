'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

import { FaBars } from 'react-icons/fa6'
import { TbGridDots } from "react-icons/tb"
import { LuArrowDownUp, LuListFilter } from "react-icons/lu"

import Datum from './components/Datum'
import StagedDatum from './components/StagedDatum'

import { DatumProps, TagProps } from './types'
import { encrypt, decrypt } from './lib/crypto.js'
import { decode } from 'punycode'
import Header from './components/Header'
import DatumList from './components/DatumList'
import LoginPage from './components/LoginPage'

export default function App() {
  const [datums, setDatums] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const loginPageRef = useRef(null)

  useEffect(() => {
    setIsLoading(true)
    async function fetchDatumsAndTags() {

      // const [datumsRes, tagsRes] = await Promise.all([
      //   fetch('http://localhost:3000/api/datums')
      //     .then(res => res.json()),
      //   fetch('http://localhost:3000/api/tags')
      //     .then(res => res.json())
      // ])
      const datums = await fetchDatums()
      const tags = await fetchTags()
      // let decryptedTags = []
      // await Promise.all([tagsRes.forEach(async tag => {
      //   const decryptedTag = await decryptTag(tag, userPassword)
      //   decryptedTags.push(decryptedTag)
      // })])
      // let decryptedDatums = await Promise.all(datumsRes.map(async datum => {
      //   const decryptedDatum = await decryptDatum(datum, userPassword)
      //   return decryptedDatum
      //   decryptedDatums.push(decryptedDatum)
      //   console.log(decryptedDatums)
      // }))
      // const decryptedDatums = await Promise.all(datumsRes.map(async datum => await decryptDatum(datum)))
      // const decryptedTags = await Promise.all(tagsRes.map(async tag => await decryptTag(tag)))
      const datumsWithTags = assignTagsToDatums(datums, tags)
      setDatums(datumsWithTags)
      setTags(tags)
    }
    if (userId.length) fetchDatumsAndTags()
    setIsLoading(false)
  }, [userId])

  async function fetchTags() {
    console.log('Fetching tags...')
    const tags = await fetch('http://localhost:3000/api/tags').then(res => res.json())
    let decryptedTags = []
    for (const tag of tags) {
      const decryptedTag = await decryptTag(tag)
      decryptedTags.push(decryptedTag)
    }
    return decryptedTags
  }

  async function fetchDatums() {
    console.log('Fetching datums...')
    const datums = await fetch('http://localhost:3000/api/datums').then(res => res.json())
    console.log('Fetched datums!')
    let decryptedDatums: any = []
    let decryptedDatum: any
    for (const [i, datum] of datums.entries()) {
      decryptedDatum = await decryptDatum(datum)
      decryptedDatums.push(decryptedDatum)

    }
    return decryptedDatums
  }

  async function decryptTag(tag: any) {
    const datumUuid = await decrypt(tag.datumUuid, userPassword)
    const name = await decrypt(tag.name, userPassword)
    const color = await decrypt(tag.color, userPassword)
    const value = tag.value ? await decrypt(tag.value, userPassword) : null
    const unit = tag.unit ? await decrypt(tag.unit, userPassword) : null
    return {
      datumUuid,
      name,
      color,
      value,
      unit,
    }
  }

  async function decryptDatum(datum: any) {
    const uuid = await decrypt(datum.uuid, userPassword)
    const createdAt = await decrypt(datum.createdAt, userPassword)
    return {
      uuid,
      createdAt,
    }
  }

  function assignTagsToDatums(datums: any, tags: any) {
    let datumsWithTags: any[] = []
    datums.forEach((datum: any) => {
      datum.tags = []
      tags.forEach(async (tag: any) => {
        if (datum.uuid === tag.datumUuid) {
          datum.tags.push(tag)
        }
      })
      datumsWithTags.push(datum)
    })
    console.log(datumsWithTags)
    return datumsWithTags
  }

  function scrollToLatestDatum() {
    // slice to copy the state array and avoid mutating it
    const timeSortedDatums = datums.slice().sort((a, b) => {
      return a.createdAt - b.createdAt
    })
    const latest = timeSortedDatums.pop()
    if (!latest) return
    const datumEl = document.getElementById(latest.uuid)
    if (datumEl) datumEl.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToLatestDatum()
  }, [datums])

  async function addActiveDatum(tags: TagProps[]) {
    const uuid: string = v4()
    const createdAt: string = Date.now().toString()
    setDatums([
      ...datums, {
        uuid,
        createdAt,
        tags,
      }
    ])
    await fetch('http://localhost:3000/api/datums', {
      method: 'POST',
      body: JSON.stringify({
        uuid: await encrypt(uuid, userPassword),
        createdAt: await encrypt(createdAt, userPassword),
        userId: await encrypt(userEmail, userPassword),
      })
    })
    const encryptedTags = await Promise.all(tags.map(async tag => {
      return {
        datumUuid: await encrypt(uuid, userPassword),
        name: tag.name ? await encrypt(tag.name, userPassword) : null,
        color: await encrypt(tag.color, userPassword),
        value: tag.value ? await encrypt(tag.value, userPassword) : null,
        unit: tag.unit ? await encrypt(tag.unit, userPassword) : null,
      }
    }))
    console.log(encryptedTags)
    await fetch('http://localhost:3000/api/tags', {
      method: 'POST',
      body: JSON.stringify(encryptedTags)
    })
  }

  function deleteDatum(id: string) {
    setDatums(datums.filter(d => d.id !== id))
  }

  function getUniqueTagsFromDatums(datums: any[]) {
    let tags: TagProps[] = []
    datums.forEach(datum => {
      datum.tags.forEach((tag: TagProps) => {
        tags.push(tag)
      })
    })
    return tags
  }

  function fadeOutLoginPage() {
    if (loginPageRef.current) loginPageRef.current.style.opacity = 0
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1000)
    // return () => loginPageRef.current.style.opacity = 1
  }

  async function login(e: any) {
    e.preventDefault()
    fadeOutLoginPage()
    const userId = await encrypt(userEmail, userPassword)
    setUserId(userId)
    // userKey = await encrypt(userPassword, userPassword)
    // localStorage.setItem(userKey, userId)
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-between font-nunito text-sm text-neutral-700">
      <Header />
      {isLoading && <span className='loader color-neutral-700'></span>}
      <DatumList datums={datums} />
      <StagedDatum tags={tags} addActiveDatum={addActiveDatum} />
      {!isLoggedIn && <LoginPage loginPageRef={loginPageRef} login={login} userEmail={userEmail} userPassword={userPassword} />}
    </main >
  )
}