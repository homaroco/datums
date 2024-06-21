'use client'
import React, { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

import { DatumProps, TagProps } from './types'
import { encrypt, decrypt } from './lib/crypto.js'

import StagedDatum from './components/StagedDatum'
import Header from './components/Header'
import DatumList from './components/DatumList'
import LoginPage from './components/LoginPage'
import AppMenu from './components/AppMenu'

export default function App() {
  const [datums, setDatums] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false)

  const loginPageRef = useRef<HTMLElement>(null)
  console.log(tags)

  useEffect(() => {
    setIsLoading(true)
    async function fetchDatumsAndTags() {
      const datums = await fetchDatums()
      const tags = await fetchTags()
      const datumsWithTags = assignTagsToDatums(datums, tags)
      setDatums(datumsWithTags)
      setTags(tags)
    }
    if (userId.length) fetchDatumsAndTags()
    setIsLoading(false)
  }, [userId])

  async function fetchTags() {
    console.log('Fetching tags...')
    const form = []
    const encodedUserId = encodeURIComponent(userId)
    form.push(encodedUserId)
    try {
      const tags = await fetch(`http://localhost:3000/api/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userId }),
      }).then((res) => res.json())
      console.log('Fetched tags!')
    } catch (e) {
      console.error(e)
      return []
    }
    let decryptedTags = []
    for (const tag of tags) {
      const decryptedTag = await decryptTag(tag)
      decryptedTags.push(decryptedTag)
    }
    return decryptedTags
  }

  async function fetchDatums() {
    console.log('Fetching datums...')
    const datums = await fetch(
      `http://localhost:3000/api/datums?userId=${userId}`
    ).then((res) => res.json())
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

  useEffect(() => {
    async function login() {
      const userEmail = localStorage.getItem('userEmail')
      const userPassword = localStorage.getItem('userPassword')
      if (userEmail && userPassword) {
        const userId = await encrypt(userEmail, userPassword)
        const test1 = await encrypt('test', 'cool')
        const test2 = await encrypt('test', 'cool')
        console.log(userId, test1, test2)
        setUserId(userId)
        setIsLoggedIn(true)
      }
    }
    login()
  }, [])

  async function createDatum(newTags: TagProps[]) {
    const uuid: string = v4()
    const createdAt: string = Date.now().toString()
    setDatums([
      ...datums,
      {
        uuid,
        createdAt,
        tags: newTags,
      },
    ])
    await fetch('http://localhost:3000/api/datums', {
      method: 'POST',
      body: JSON.stringify({
        uuid: await encrypt(uuid, userPassword),
        createdAt: await encrypt(createdAt, userPassword),
        userId: await encrypt(userEmail, userPassword),
      }),
    })
    const encryptedTags = await Promise.all(
      newTags.map(async (tag) => {
        return {
          datumUuid: await encrypt(uuid, userPassword),
          name: tag.name ? await encrypt(tag.name, userPassword) : null,
          color: await encrypt(tag.color, userPassword),
          value: tag.value ? await encrypt(tag.value, userPassword) : null,
          unit: tag.unit ? await encrypt(tag.unit, userPassword) : null,
        }
      })
    )
    await fetch('http://localhost:3000/api/tags', {
      method: 'POST',
      body: JSON.stringify(encryptedTags),
    })
    setTags([...tags, ...newTags])
  }

  function deleteDatum(id: string) {
    setDatums(datums.filter((d) => d.id !== id))
  }

  function getUniqueTagsFromDatums(datums: any[]) {
    let tags: TagProps[] = []
    datums.forEach((datum) => {
      datum.tags.forEach((tag: TagProps) => {
        tags.push(tag)
      })
    })
    return tags
  }

  function fadeOutLoginPage() {
    if (loginPageRef.current) loginPageRef.current.style.opacity = '0'
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1000)
    // return () => loginPageRef.current.style.opacity = 1
  }

  async function login(e: any) {
    e.preventDefault()
    fadeOutLoginPage()
    const userId = await encrypt(userEmail, userPassword)
    console.log(userId)
    setUserId(userId)
    // userKey = await encrypt(userPassword, userPassword)
    localStorage.setItem('userId', userId)
  }

  function openMenu() {
    setIsAppMenuOpen(true)
  }

  function closeMenu() {
    setIsAppMenuOpen(false)
  }

  function logout() {
    closeMenu()
    localStorage.clear()
    setUserEmail('')
    setUserPassword('')
    setUserId('')
    setIsLoggedIn(false)
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-between font-nunito text-sm text-neutral-700">
      <AppMenu isOpen={isAppMenuOpen} closeMenu={closeMenu} logout={logout} />
      <Header openMenu={openMenu} />
      {isLoading && <span className="loader color-neutral-700"></span>}
      <DatumList datums={datums} deleteDatum={deleteDatum} />
      <StagedDatum tags={tags} createDatum={createDatum} />
      {!isLoggedIn && (
        <LoginPage
          loginPageRef={loginPageRef}
          login={login}
          userEmail={userEmail}
          userPassword={userPassword}
          setUserEmail={setUserEmail}
          setUserPassword={setUserPassword}
        />
      )}
    </main>
  )
}
