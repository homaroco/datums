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

export default function App() {
  const [datums, setDatums] = useState<any[]>([])
  const [tags, setTags] = useState<TagProps[]>([])
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
      const decryptedTag = await decryptTag(tag, userPassword)
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
      decryptedDatum = await decryptDatum(datum, userPassword)
      decryptedDatums.push(decryptedDatum)

    }
    return decryptedDatums
  }

  async function decryptTag(tag) {
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

  async function decryptDatum(datum) {
    const uuid = await decrypt(datum.uuid, userPassword)
    const createdAt = await decrypt(datum.createdAt, userPassword)
    return {
      uuid,
      createdAt,
    }
  }

  function assignTagsToDatums(datums, tags) {
    let datumsWithTags = []
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
        name: await encrypt(tag.name, userPassword),
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
    loginPageRef.current.style.opacity = 0
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1000)
    // return () => loginPageRef.current.style.opacity = 1
  }

  async function login(e) {
    e.preventDefault()
    fadeOutLoginPage()
    const userId = await encrypt(userEmail, userPassword)
    setUserId(userId)
    // userKey = await encrypt(userPassword, userPassword)
    // localStorage.setItem(userKey, userId)
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-between font-nunito text-sm text-neutral-700">
      <header className='flex relative top-0 w-full justify-between items-center h-[50px] border-b border-neutral-700 text-2xl bg-black z-10'>
        <span className='flex h-full'>
          <button className='flex items-center justify-center p-2 w-[50px]' aria-label='Sort Datums'><LuArrowDownUp /></button>
          <button className='flex items-center justify-center p-2 w-[50px] text-3xl' aria-label='Filter Datums'><LuListFilter /></button>
        </span>
        <span className='rainbow text-3xl font-bold select-none'>Datums</span>
        <span className='flex h-full'>
          <button className='flex items-center justify-center p-2 w-[50px]' aria-label='View Apps'><TbGridDots /></button>
          <button className='flex items-center justify-center p-2 w-[50px]' aria-label='View Menu'><FaBars /></button>
        </span>
      </header>
      {isLoading && <span className='loader color-neutral-700'></span>}
      <section className='relative w-full h-full overflow-auto'>
        <ul id='datum-list' className='datum-list overflow-auto'>
          {datums.map((datum: any, i: number) => <Datum key={datum.uuid} {...datum} deleteDatum={() => deleteDatum(datum.uuid)} />)}
        </ul>
      </section>
      <footer className='flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black'>
        <StagedDatum tags={tags} addActiveDatum={addActiveDatum} />
      </footer>
      {!isLoggedIn && <section ref={loginPageRef} className='login-page flex fixed justify-center items-center pt-[5px] top-0 w-full h-full z-30 overflow-auto bg-black'>
        <span className='fixed top-[5px] rainbow text-3xl font-bold select-none'>Datums</span>

        <form onSubmit={login} className='flex flex-col'>
          <input value={userEmail} className={`border border-neutral-700 bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`} placeholder='Email' onChange={e => setUserEmail(e.target.value)}></input>
          <input value={userPassword} className={`border border-neutral-700 bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`} placeholder='Password' onChange={e => setUserPassword(e.target.value)}></input>
          {userEmail && userPassword && <button className={`absolute top-[375px] rainbow border border-white rounded mx-[20px] w-[175px] m-auto p-[5px] font-bold`} onClick={login}>Get Datums</button>}
        </form>
      </section>}

    </main >
  )
}