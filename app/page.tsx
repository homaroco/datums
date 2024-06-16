'use client'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { FaBars } from 'react-icons/fa6'
import { TbGridDots } from "react-icons/tb"
import { LuArrowDownUp, LuListFilter } from "react-icons/lu"

import Datum from './components/Datum'
import StagedDatum from './components/StagedDatum'

import { DatumProps, TagProps } from './types'

export default function App() {
  const [datums, setDatums] = useState<DatumProps[]>([])
  const [tags, setTags] = useState<TagProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch('http://localhost:3000/api/datums')
      .then(res => res.json())
      .then(json => {
        setIsLoading(false)
        setDatums(json)
        const tags = getUniqueTagsFromDatums(json)
        setTags(tags)
      })
  }, [])

  useEffect(() => {
    const latestDatum = datums.sort((a, b) => {
      return a.createdAt - b.createdAt
    })[datums.length - 1]
    if (!latestDatum) return
    const datumEl = document.getElementById(latestDatum.id)
    if (datumEl) datumEl.scrollIntoView({ behavior: 'smooth' })
    fetch('http://localhost:3000/api/datums', {
      method: 'POST',
      body: JSON.stringify(latestDatum)
    }).then(res => res.json())
      .then(data => console.log(data))
  }, [datums])

  function addActiveDatum(tags: TagProps[]) {
    setDatums([
      ...datums,
      {
        id: uuid(),
        createdAt: Date.now(),
        tags,
      }
    ])
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
          {datums.map((datum: any, i: number) => <Datum key={datum.id} {...datum} deleteDatum={() => deleteDatum(datum.id)} />)}
        </ul>
      </section>
      <footer className='flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black'>
        <StagedDatum tags={tags} addActiveDatum={addActiveDatum} />
      </footer>
      {!isLoggedIn && <section className='flex fixed justify-center items-center pt-[5px] top-0 w-full h-full z-30 overflow-auto bg-black'>
        <span className='fixed top-[5px] rainbow text-3xl font-bold select-none'>Datums</span>

        <form className=''>
          <input className={`border border-neutral-700 bg-black py-[5px] px-[20px] rounded mb-[5px] m-auto`} placeholder='Username'></input>
          <input className={`border border-neutral-700 bg-black py-[5px] px-[20px] rounded mb-[5px] m-auto`} placeholder='Email'></input>
          <input className={`border border-neutral-700 bg-black py-[5px] px-[20px] rounded mb-[5px] m-auto`} placeholder='Password'></input>
        </form>
      </section>}

    </main >
  )
}