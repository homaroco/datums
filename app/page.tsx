'use client'
import React, { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

import StagedDatum from './components/StagedDatum'
import Header from './components/Header'
import DatumList from './components/DatumList'
import LoginPage from './components/LoginPage'
import MainMenu from './components/MainMenu'
import AppMenu from './components/AppMenu'

// import { encrypt, decrypt } from './lib/crypto.js'
import { encrypt, decrypt, passwordEncrypt } from './lib/asymmetricCrypto.js'

import { TagProps } from './types'
import SettingsMenu from './components/SettingsMenu'

const API_ROUTE = 'http://localhost:3000/api'
const SALT = 'this is my salt, there are many like it but this one is mine'

function getAllTags(datums: any) {
  let allTags: any = []
  datums.forEach((datum: any) => {
    datum.tags.forEach((tag: any) => {
      allTags.push(tag)
    })
  })
  return allTags
}

export default function App() {
  const [datums, setDatums] = useState<any[]>([])
  const [view, setView] = useState<string>('datums')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [rememberUser, setRememberUser] = useState(false)
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const [keyKey, setKeyKey] = useState('')
  const [publicKey, setPublicKey] = useState<JsonWebKey | null>(null)
  const [privateKey, setPrivateKey] = useState<JsonWebKey | null>(null)

  // ref used to fade out login page
  const loginPageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function getKeyKey() {
      const keyKey = await passwordEncrypt(userPassword, SALT, userEmail)
      setKeyKey(keyKey)
    }
    const email = localStorage.getItem('userEmail')
    if (email) {
      setRememberUser(true)
      setIsLoggedIn(true)
      getKeyKey()
    }
    const password = localStorage.getItem('userPassword')
    if (password) setUserPassword(password)
  }, [])

  useEffect(() => {
    console.log('useEffect[keyKey]')
    async function getKeys() {
      const keys = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      )
      const { publicKey, privateKey } = keys
      const exportedPublicKey = await window.crypto.subtle.exportKey(
        'jwk',
        publicKey
      )
      const exportedPrivateKey = await window.crypto.subtle.exportKey(
        'jwk',
        privateKey
      )
      setPublicKey(exportedPublicKey)
      setPrivateKey(exportedPrivateKey)
      localStorage.setItem(
        `${keyKey}-public`,
        JSON.stringify(exportedPublicKey)
      )
      localStorage.setItem(
        `${keyKey}-private`,
        JSON.stringify(exportedPrivateKey)
      )
    }
    if (!keyKey.length) return
    const publicKey = localStorage.getItem(`${keyKey}-public`)
    const privateKey = localStorage.getItem(`${keyKey}-private`)
    if (publicKey === null || privateKey === null) {
      getKeys()
    } else {
      setPublicKey(JSON.parse(publicKey))
      setPrivateKey(JSON.parse(privateKey))
    }
  }, [keyKey])

  useEffect(() => {
    console.log('useEffect[privateKey]')
    async function fetchDatumsAndTags() {
      const datums = await fetchDatums()
      setDatums(datums)
    }
    console.log(privateKey)
    if (privateKey) fetchDatumsAndTags()
  }, [privateKey])

  async function fetchDatums() {
    if (!publicKey) throw new Error('Unable to fetch datums without userId set')
    console.log('Fetching datums...')
    const datums = await fetch(
      `${API_ROUTE}/datums?userId=${publicKey.n}`
    ).then((res) => res.json())
    console.log('Fetched datums!')
    return await Promise.all(
      datums.map(async (datum: any) => await decryptDatum(datum))
    )
  }

  async function getPublicKey() {
    if (!publicKey) return
    return await window.crypto.subtle.importKey(
      'jwk',
      publicKey,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    )
  }

  async function getPrivateKey() {
    if (!privateKey) return
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
        datum.tags.map(async (tag: any) => await decryptTag(tag))
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
    if (!publicKey)
      throw new Error('Unable to create datums without userId set')
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
    const keyKey = await passwordEncrypt(userPassword, SALT, userEmail)
    setKeyKey(keyKey)
  }

  function openMenu() {
    setIsMainMenuOpen(true)
  }

  function openAppMenu() {
    setIsAppMenuOpen(true)
  }

  function closeMenu() {
    setIsMainMenuOpen(false)
    setIsSettingsMenuOpen(false)
    setIsAppMenuOpen(false)
  }

  function logout() {
    closeMenu()
    setUserEmail('')
    setUserPassword('')
    setIsLoggedIn(false)
    setRememberUser(false)
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPassword')
    setDatums([])
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-between font-nunito text-sm text-neutral-700">
      <MainMenu
        isOpen={isMainMenuOpen}
        closeMenu={closeMenu}
        logout={logout}
        openSettings={() => setIsSettingsMenuOpen(true)}
      />
      <SettingsMenu
        isOpen={isSettingsMenuOpen}
        closeMenu={closeMenu}
        privateKey={privateKey}
        loadPrivateKey={() => console.log('TODO: load private key')}
      />
      <AppMenu
        isOpen={isAppMenuOpen}
        closeMenu={closeMenu}
        viewPeriodTracker={() => setView('period-tracker')}
      />
      <Header openMenu={openMenu} openAppMenu={openAppMenu} />
      {isLoading && <span className="loader color-neutral-700"></span>}
      {view === 'datums' && (
        <>
          <DatumList datums={datums} deleteDatum={deleteDatum} />
          <StagedDatum tags={getAllTags(datums)} createDatum={createDatum} />
        </>
      )}
      {!isLoggedIn && (
        <LoginPage
          loginPageRef={loginPageRef}
          login={login}
          userEmail={userEmail}
          userPassword={userPassword}
          setUserEmail={setUserEmail}
          setUserPassword={setUserPassword}
          rememberUser={rememberUser}
          setRememberUser={setRememberUser}
        />
      )}
    </main>
  )
}
