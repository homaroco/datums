import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import { getTimestamp } from "../lib/time"
import { DatumProps, TagProps } from "../types"
import { Tag } from "./Tag"

export default function Datum(
  { id, createdAt, tags, deleteDatum }: { id: string, createdAt: number, tags: TagProps[], deleteDatum: (id: string) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  return (
    <li id={`${id}`} className='flex relative items-center justify-between mx-[10px] h-[50px] border-b border-neutral-700 last:border-b-0 w-100%'>
      <span className='container inline-flex relative overflow-auto'>
        <span className='datum-tag-sub-container inline-flex relative grow justify-start overflow-auto'>
          <span className='content inline-flex relative'>
            {tags.map((tag, i) => <Tag key={i} {...tag} />)}
          </span>
        </span>
        <span className='tag-fade absolute right-0 w-[30px] h-[30px]'></span>
      </span>
      <span className='flex'>
        <span className='flex items-center text-xs ml-[10px] text-neutral-600'>{getTimestamp(createdAt)}</span>
        <button className='flex items-center justify-center text-2xl ml-[10px]' onClick={() => setIsMenuOpen(!isMenuOpen)}><BsThreeDots /></button>
      </span>
      {isMenuOpen && <div className='fixed top-0 left-0 right-0 bottom-0 z-20' onClick={() => setIsMenuOpen(false)}></div>}
      {isMenuOpen && <div className='datum-menu flex absolute flex-col items-center justify-center px-[10px] bg-black right-[25px] bottom-[25px] border border-white rounded text-[16px] text-white z-30'>
        <span className='py-[10px] w-full text-center border-b border-white'>Edit</span>
        <span className='py-[10px] w-full text-center' onClick={() => deleteDatum(id)}>Delete</span>
      </div>}
    </li>
  )
}