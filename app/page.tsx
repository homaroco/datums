import {
  FaSort,
  FaBars,
  FaPlus
} from 'react-icons/fa6'
import {
  IoApps,
  IoFilter
} from 'react-icons/io5'
import { BsThreeDots } from "react-icons/bs";

import { getRandomHex, getContrastColor } from './lib/utils.js'

interface Tag {
  name: string,
  value: string,
  color: string,
  unit?: string,
}

export function Tag({ name, value, unit, color }: Tag) {
  let roundedValue = 'rounded-tr rounded-br'
  if (unit) roundedValue = ''
  return (
    <span className='inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap'>
      <button className={`inline-flex relative items-center pr-[6px] pl-[8px]`} style={{ backgroundColor: color, color: getContrastColor(color) }}>{name}</button>
      <button className={`inline-flex relative items-center px-[6px] border-2 ${roundedValue}`} style={{ color, borderColor: color, background: getContrastColor(color) }}>{value}</button>
      {unit && <button className='pr-[6px] pl-[4px]' style={{ background: color, color: getContrastColor(color) }}>{unit}</button>}
    </span>
  )
}

export function Datum({ tags }: { tags: Tag[] }) {
  return (
    <li className='flex relative items-center justify-between mx-[10px] border-b border-neutral-700'>
      <span className='container inline-flex relative overflow-auto'>
        <span className='sub-container inline-flex relative grow justify-start overflow-auto'>
          <span className='content inline-flex relative gap-[5px] py-[10px] pr-[20px]'>
            {tags.map(tag => <Tag {...tag} />)}
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-nunito text-sm lg:flex">
        <header className='flex sticky justify-between items-center h-[50px] border-b border-neutral-700 shadow-lg text-2xl'>
          <span className='flex h-full'>
            <button className='flex items-center justify-center p-2 w-[50px]' aria-label='Sort Datums'><FaSort /></button>
            <button className='flex items-center justify-center p-2 w-[50px]' aria-label='Filter Datums'><IoFilter /></button>
          </span>
          <span className='rainbow text-3xl font-bold select-none'>Datums</span>
          <span className='flex h-full'>
            <button className='flex items-center justify-center p-2 w-[50px]' aria-label='View Apps'><IoApps /></button>
            <button className='flex items-center justify-center p-2 w-[50px]' aria-label='View Menu'><FaBars /></button>
          </span>
        </header>
        <section>
          <ul className=''>
            <Datum tags={tags} />
            <Datum tags={tags} />
            <Datum tags={tags} />
          </ul>
        </section>
        <footer className='flex fixed items-center justify-between bottom-0 h-[50px] w-full border-t border-neutral-700'>
          <button className='border rounded border-neutral-700 h-[30px] ml-2 px-2'>New tag</button>
          <button className='flex items-center justify-center text-3xl w-[50px]'><FaPlus /></button>
        </footer>
      </div>
    </main>
  );
}
