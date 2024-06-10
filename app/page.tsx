'use client'

import {
  FaBars,
  FaPlus
} from 'react-icons/fa6'
import { BsThreeDots } from "react-icons/bs";
import { TbGridDots } from "react-icons/tb";
import { LuArrowDownUp, LuListFilter } from "react-icons/lu";


import { getRandomHex, getContrastColor } from './lib/utils.js'
import React, { useEffect, useState } from 'react';

interface Tag {
  name: string,
  color: string,
  value?: string,
  unit?: string,
}

// flex items-center justify-center text-3xl w-[50px] text-neutral-500 active:hover:text-white
// flex items-center justify-center p-2 w-[50px]
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className='flex relative items-center justify-center w-[50px] text-neutral-500 active:hover:text-white'>
      {children}
    </button>
  )
}

export function Tag({ name, value, unit, color }: Tag) {
  let roundedValue = 'rounded-tr rounded-br'
  if (unit) roundedValue = ''
  return (
    <span className='inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap'>
      <button className={`inline-flex relative items-center pr-[6px] pl-[8px]`} style={{ backgroundColor: color, color: getContrastColor(color) }}>{name}</button>
      {value && <button className={`inline-flex relative items-center px-[6px] border-2 ${roundedValue}`} style={{ color, borderColor: color, background: getContrastColor(color) }}>{value}</button>}
      {unit && <button className='pr-[6px] pl-[4px]' style={{ background: color, color: getContrastColor(color) }}>{unit}</button>}
    </span>
  )
}

export function Datum({ tags }: { tags: Tag[] }) {
  return (
    <li className='flex relative items-center justify-between mx-[10px] border-b border-neutral-700 w-100%'>
      <span className='container inline-flex relative overflow-auto'>
        <span className='sub-container inline-flex relative grow justify-start overflow-auto'>
          <span className='content inline-flex relative gap-[5px] py-[10px] pr-[20px]'>
            {tags.map((tag, i) => <Tag key={i} {...tag} />)}
          </span>
        </span>
        <span className='tag-fade absolute right-0 top-[10px] w-[30px] h-[30px]'></span>
      </span>
      <span className='flex'>
        <span className='flex items-center text-xs ml-[10px] text-neutral-600'>1h</span>
        <button className='flex items-center justify-center text-2xl ml-[10px]'><BsThreeDots /></button>
      </span>
    </li>
  )
}

const datums = [
  {

  }
]



function addActiveDatum(e) {

}

export default function App() {
  const [data, setData] = useState([])
  const tags = [
    {
      name: 'test',
      value: 'val',
      color: getRandomHex(6)
    },
    {
      name: 'another',
      value: 'test',
      unit: 'unit',
      color: getRandomHex(6)
    },
    {
      name: 'something long',
      value: 'a long value',
      color: getRandomHex(6)
    }
  ]
  useEffect(() => {
    fetch('http://localhost:3000/api/datums')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  return (
    <main className="flex flex-col w-full h-full items-center justify-between font-nunito text-sm ">

      <header className='flex relative top-0 w-full justify-between items-center h-[50px] border-b border-neutral-700 shadow-lg text-2xl bg-black z-10'>
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
        <ul className='overflow-auto'>
          {data.map((datum: any, i: number) => <Datum key={i} tags={datum.tags} />)}
        </ul>
      </section>
      <footer className='flex relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black'>
        <button className='border rounded border-neutral-700 h-[30px] ml-2 px-2'>New tag</button>
        <button className='flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white'><FaPlus /></button>
      </footer>
    </main>
  );
}
