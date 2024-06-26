'use client'
import React, { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

import StagedDatum from './components/StagedDatum'
import Header from './components/Header'
import DatumList from './components/DatumList'
import LoginPage from './components/LoginPage'
import AppMenu from './components/AppMenu'

// import { encrypt, decrypt } from './lib/crypto.js'
import { encrypt, decrypt } from './lib/asymmetricCrypto.js'

import { TagProps } from './types'

const API_ROUTE = 'http://localhost:3000/api'

export default function App() {
  const [datums, setDatums] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false)
  const [publicKey, setPublicKey] = useState<JsonWebKey>(
    JSON.parse(localStorage.getItem('publicKey') || '{}')
  )
  const [privateKey, setPrivateKey] = useState<JsonWebKey>(
    JSON.parse(localStorage.getItem('privateKey') || '{}')
  )

  // ref used to fade out login page
  const loginPageRef = useRef<HTMLElement>(null)

  // useEffect(() => {
  //   async function getKeys() {
  //     const keys = await window.crypto.subtle.generateKey(
  //       {
  //         name: 'RSA-OAEP',
  //         modulusLength: 4096,
  //         publicExponent: new Uint8Array([1, 0, 1]),
  //         hash: 'SHA-256',
  //       },
  //       true,
  //       ['encrypt', 'decrypt']
  //     )
  //     const { publicKey, privateKey } = keys
  //     setPublicKey(await window.crypto.subtle.exportKey('jwk', publicKey))
  //     setPrivateKey(await window.crypto.subtle.exportKey('jwk', privateKey))
  //     localStorage.setItem('publicKey', JSON.stringify(publicKey))
  //     localStorage.setItem('privateKey', JSON.stringify(privateKey))
  //   }
  //   if (!publicKey || !privateKey) {
  //     getKeys()
  //   }
  // }, [])

  useEffect(() => {
    async function fetchDatumsAndTags() {
      const datums = await fetchDatums()
      setDatums(datums)
    }
    fetchDatumsAndTags()
  }, [privateKey])

  // async function fetchTags(uuids: string[]) {
  //   console.log('Fetching tags...')
  //   // const form = []
  //   // const encodedUserId = encodeURIComponent(userId)
  //   // form.push(encodedUserId)
  //   let tags
  //   try {
  //     tags = await fetch(`http://localhost:3000/api/tags`, {
  //       method: 'POST',
  //       body: JSON.stringify(uuids),
  //     }).then((res) => res.json())
  //     console.log('Fetched tags!')
  //   } catch (e) {
  //     console.error(e)
  //     return []
  //   }
  //   // let decryptedTags = []
  //   // for (const tag of tags) {
  //   //   const decryptedTag = await decryptTag(tag)
  //   //   decryptedTags.push(decryptedTag)
  //   // }
  //   return tags
  // }

  async function fetchDatums() {
    console.log('Fetching datums...')
    const datums = await fetch(
      `${API_ROUTE}/datums?userId=${publicKey.n}`
    ).then((res) => res.json())
    console.log('Fetched datums!')
    return await Promise.all(
      datums.map(async (datum) => await decryptDatum(datum))
    )
  }

  async function getPublicKey() {
    return await window.crypto.subtle.importKey(
      'jwk',
      publicKey,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    )
  }

  async function getPrivateKey() {
    return await window.crypto.subtle.importKey(
      'jwk',
      privateKey,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['decrypt']
    )
  }

  async function decryptDatum(datum: any) {
    const key = await getPrivateKey()
    return {
      uuid: await decrypt(datum.uuid, key),
      createdAt: await decrypt(datum.createdAt, key),
      tags: await Promise.all(
        datum.tags.map(async (tag) => await decryptTag(tag))
      ),
    }
  }

  async function decryptTag(tag: any) {
    const key = await getPrivateKey()
    return {
      datumUuid: await decrypt(tag.datumUuid, key),
      name: await decrypt(tag.name, key),
      color: await decrypt(tag.color, key),
      value: tag.value ? await decrypt(tag.value, key) : null,
      unit: tag.unit ? await decrypt(tag.unit, key) : null,
    }
  }

  function scrollToLatestDatum() {
    // slice to copy the state array and avoid mutating it
    const timeSortedDatums = datums.slice().sort((a, b) => {
      return a.createdAt - b.createdAt
    })
    if (!timeSortedDatums.length) return
    const latest = timeSortedDatums.pop()
    const datumEl = document.getElementById(latest.uuid)
    if (datumEl) datumEl.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToLatestDatum()
  }, [datums])

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
    const key = await getPublicKey()

    const encryptedUuid = await encrypt(uuid, key)
    const encryptedCreatedAt = await encrypt(createdAt, key)
    const encryptedTags = await Promise.all(
      newTags.map(async (tag) => {
        return {
          datumUuid: encryptedUuid,
          name: tag.name ? await encrypt(tag.name, key) : null,
          color: await encrypt(tag.color, key),
          value: tag.value ? await encrypt(tag.value, key) : null,
          unit: tag.unit ? await encrypt(tag.unit, key) : null,
        }
      })
    )
    await fetch('http://localhost:3000/api/datums', {
      method: 'POST',
      body: JSON.stringify({
        uuid: encryptedUuid,
        createdAt: encryptedCreatedAt,
        tags: encryptedTags,
        userId: publicKey.n, // store the key modulus
      }),
    })
  }

  function deleteDatum(id: string) {
    setDatums(datums.filter((d) => d.id !== id))
  }

  function fadeOutLoginPage() {
    if (loginPageRef.current) loginPageRef.current.style.opacity = '0'
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1000)
  }

  async function login(e: any) {
    e.preventDefault()
    fadeOutLoginPage()
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
