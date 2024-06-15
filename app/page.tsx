'use client'

import {
  FaBars,
  FaPlus
} from 'react-icons/fa6'
import { BsThreeDots } from "react-icons/bs";
import { TbGridDots } from "react-icons/tb";
import { LuArrowDownUp, LuListFilter } from "react-icons/lu";
import { v4 as uuid } from 'uuid'


import { getRandomHex, getContrastColor } from './lib/utils.js'
import React, { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
import { getTimestamp } from './lib/time';

import { DatumProps, TagProps } from './types'
import Datum from './components/Datum'

import StagedDatum from './components/StagedDatum'
import { json } from 'stream/consumers';

export default function App() {
  const [datums, setDatums] = useState<DatumProps[]>([])
  const [tags, setTags] = useState<TagProps[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/datums')
      .then(res => res.json())
      .then(json => {
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
      <section className='relative w-full h-full overflow-auto'>
        <ul id='datum-list' className='datum-list overflow-auto'>
          {datums.map((datum: any, i: number) => <Datum key={datum.id} {...datum} />)}
        </ul>
      </section>
      <footer className='flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black'>
        <StagedDatum tags={tags} addActiveDatum={addActiveDatum} />
      </footer>
    </main >
  );
}
