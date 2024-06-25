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
  console.log(datums)
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

  // load tags and datums when user is set
  useEffect(() => {
    // setIsLoading(true)
    async function fetchDatumsAndTags() {
      const datums = await fetchDatums()
      // const tags = await fetchTags(uuids)
      // const datumsWithTags = assignTagsToDatums(datums, tags)
      console.log(datums)
      setDatums(datums)
      // setTags(tags)
    }
    fetchDatumsAndTags()
    // setIsLoading(false)
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
      `http://localhost:3000/api/datums?userId=${publicKey.n}`
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
    const privCryptoKey = await window.crypto.subtle.importKey(
      'jwk',
      privateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    )
    const datumUuid = await decrypt(tag.datumUuid, privCryptoKey)
    const name = await decrypt(tag.name, privCryptoKey)
    const color = await decrypt(tag.color, privCryptoKey)
    const value = tag.value ? await decrypt(tag.value, privCryptoKey) : null
    const unit = tag.unit ? await decrypt(tag.unit, privCryptoKey) : null
    return {
      datumUuid,
      name,
      color,
      value,
      unit,
    }
  }

  async function decryptDatum(datum: any) {
    if (!privateKey) return
    const privCryptoKey = await window.crypto.subtle.importKey(
      'jwk',
      privateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    )
    const uuid = await decrypt(datum.uuid, privCryptoKey)
    const createdAt = await decrypt(datum.createdAt, privCryptoKey)
    // const tags = datum.tags.map(async (tag: any) => await decryptTag(tag))
    let tags = []
    let decryptedTag
    for (const tag of datum.tags) {
      decryptedTag = await decryptTag(tag)
      tags.push(decryptedTag)
    }
    return {
      uuid,
      createdAt,
      tags,
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
    if (!publicKey) return
    const pubCryptoKey = await window.crypto.subtle.importKey(
      'jwk',
      publicKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    )
    const encryptedUuid = await encrypt(uuid, pubCryptoKey)

    const encryptedCreatedAt = await encrypt(createdAt, pubCryptoKey)

    const encryptedTags = await Promise.all(
      newTags.map(async (tag) => {
        return {
          datumUuid: encryptedUuid,
          name: tag.name ? await encrypt(tag.name, pubCryptoKey) : null,
          color: await encrypt(tag.color, pubCryptoKey),
          value: tag.value ? await encrypt(tag.value, pubCryptoKey) : null,
          unit: tag.unit ? await encrypt(tag.unit, pubCryptoKey) : null,
        }
      })
    )
    const fetchBody = JSON.stringify({
      uuid: encryptedUuid,
      createdAt: encryptedCreatedAt,
      tags: encryptedTags,
      userId: publicKey.n, // store the key modulus
    })
    console.log(fetchBody)
    await fetch('http://localhost:3000/api/datums', {
      method: 'POST',
      body: fetchBody,
    })
    // await fetch('http://localhost:3000/api/tags', {
    //   method: 'POST',
    //   body: JSON.stringify(encryptedTags),
    // })
    // setTags([...tags, ...newTags])
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
  }

  async function login(e: any) {
    e.preventDefault()
    fadeOutLoginPage()
    // const testPubKey = await window.crypto.subtle.importKey(
    //   'jwk',
    //   publicKey,
    //   {
    //     name: 'RSA-OAEP',
    //     hash: 'SHA-256',
    //   },
    //   true,
    //   ['encrypt']
    // )
    // const userId = await encrypt(userEmail, testPubKey)
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
