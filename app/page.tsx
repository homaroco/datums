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

interface Tag {
  color: string,
  name?: string,
  value?: string,
  unit?: string,
}

interface Datum {
  id: string,
  createdAt: number,
  tags: Tag[],
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
  let padding = 'pr-[6px]'
  if (unit) roundedValue = ''
  if (!value) padding = 'pr-[8px]'
  return (
    <span className='tag inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap'>
      {name && <button className={`inline-flex relative items-center ${padding} pl-[8px]`} style={{ backgroundColor: color, color: getContrastColor(color) }}>{name}</button>}
      {value && <button className={`inline-flex relative items-center px-[6px] border-2 ${roundedValue}`} style={{ color, borderColor: color, background: getContrastColor(color) }}>{value}</button>}
      {unit && <button className='pr-[6px] pl-[4px]' style={{ background: color, color: getContrastColor(color) }}>{unit}</button>}
    </span>
  )
}

export function Datum({ id, createdAt, tags }: Datum) {
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
        <span className='py-[10px] w-full text-center'>Delete</span>
      </div>}
    </li>
  )
}

function getValuesForTagName(tagName: string, tags: Tag[]) {
  let values: string[] = []
  tags.forEach((tag: Tag) => {
    if (
      tag.name === tagName
      && tag.value !== undefined
      && values.indexOf(tag.value) === -1
    ) values.push(tag.value)
  })
  return values
}

export function TagNameMenu({ isVisible, tags, convertToValuelessTag }: { isVisible: boolean, tags: Tag[], convertToValuelessTag: (tag: Tag) => void }) {
  const [activeTagNameTag, setActiveTagNameTag] = useState<Tag | null>(null)
  const uniqueTagNames = tags.filter((tag, i) => tags.findIndex(t => tag.name === t.name) === i)
  const uniqueNameTags = uniqueTagNames.map((tag: Tag, i: number) =>
    <span
      onClick={() => {
        selectTag(tag)
      }}
      key={i}
      className='pb-[5px]'>
      <Tag {...{ name: tag.name, color: tag.color }} />
    </span>
  )

  function selectTag(tag) {
    console.log('selectTag tag:', tag)
    setActiveTagNameTag(tag)
    convertToValuelessTag(tag)
  }

  let height = 'max-h-0 opacity-0'
  let border = 'border-b-0'
  if (isVisible) {
    height = 'max-h-[150px] opacity-100'
    border = 'border-b-[1px]'
  }
  return (
    <div className={`tag-name-menu px-[10px] w-full ${height} overflow-scroll`}>
      <div className={`${border} border-neutral-700`}>
        <div className={`inline-flex flex-wrap justify-start w-auto pt-[10px] pb-[5px]`}>
          {uniqueNameTags}
        </div>
      </div>
    </div>
  )
}

export function TagValueMenu({ isVisible, nameTag, tags, onClick }: { isVisible: boolean, nameTag: Tag | null, tags: Tag[], onClick: () => void }) {
  let height = 'max-h-0 opacity-0'
  let border = 'border-b-0'
  if (isVisible) {
    height = 'max-h-[150px] opacity-100'
    border = 'border-b-[1px]'
  }

  let uniqueValues: string[] = []
  tags.forEach(tag => {
    if (nameTag && tag.value && tag.name === nameTag.name) {
      if (uniqueValues.indexOf(tag.value) === -1) uniqueValues.push(tag.value)
    }
  })

  const uniqueValueTags = uniqueValues.map((value, i) => (
    <span
      onClick={() => onClick(value)}
      key={i}
      className='pb-[5px]'
    >
      <Tag {...{ value, color: nameTag.color }} />
    </span>
  ))
  return (
    <div className={`tag-value-menu px-[10px] w-full ${height} overflow-scroll`}>
      <div className={`${border} border-neutral-700`}>
        <div className={`inline-flex flex-wrap justify-start w-auto pt-[10px] pb-[5px]`}>
          {uniqueValueTags}
        </div>
      </div>
    </div>
  )
}

export function ActiveDatum({ tags, addActiveDatum }: { tags: Tag[], addActiveDatum: (tags: Tag[]) => void }) {
  const [newTagColor, setNewTagColor] = useState('')
  const [activeTags, setActiveTags] = useState<Tag[]>([])
  const [currentValuelessTag, setCurrentValuelessTag] = useState<Tag | null>(null)
  const [newTagNameInputValue, setNewTagNameInputValue] = useState('')
  const [isTagNameMenuVisible, setIsTagNameMenuVisible] = useState(false)
  const [isTagValueMenuVisible, setIsTagValueMenuVisible] = useState(false)
  const [isNewTagNameInputFocused, setIsNewTagNameInputFocused] = useState(false)
  const [inputWidth, setInputWidth] = useState(72) // width of 'New tag'

  const newTagNameDummyRef = useRef(null)

  useEffect(() => {
    setNewTagColor(getRandomHex(6))
  }, [activeTags])

  useEffect(() => {
    if (newTagNameDummyRef.current) {
      setInputWidth(newTagNameDummyRef.current.offsetWidth || 72)
    }
  }, [newTagNameInputValue])


  function beginCreateActiveTag() {
    setIsNewTagNameInputFocused(true)
    setIsTagNameMenuVisible(true)
  }

  function endCreateActiveTag(e: { target: { value: any; }; }) {
    setIsNewTagNameInputFocused(false)
    if (e.target.value) return
    if (currentValuelessTag !== null) return
    setIsTagNameMenuVisible(false)
  }

  function createTagName(e: any) {
    e.preventDefault()
    const tagName = newTagNameInputValue
    // TODO check if it exists already
    // if not, add to tag name menu

    setActiveTags([
      ...activeTags,
      {
        name: tagName,
        color: newTagColor,
      }
    ])
    setNewTagNameInputValue('')
    endCreateActiveTag(e)
  }

  function updateTagNameInputValue(e: any) {
    if (e.key === 'Enter') {
      createTagName(e)
    }
    else setNewTagNameInputValue(e.target.value)
  }

  function submitActiveDatum() {
    addActiveDatum(activeTags)
    setActiveTags([])
  }

  function addToActiveTags(tag: Tag) {
    setActiveTags([
      ...activeTags,
      tag
    ])
  }

  function convertToValuelessTag(tag) {
    setCurrentValuelessTag(tag)
    setIsTagNameMenuVisible(false)
    setIsTagValueMenuVisible(true)
  }

  function addValueToActiveTag(value) {
    setIsTagNameMenuVisible(false)
    setIsTagValueMenuVisible(false)
    addToActiveTags({
      name: currentValuelessTag.name,
      value,
      color: currentValuelessTag?.color,
    })

    setCurrentValuelessTag(null)
  }

  return (
    <>
      <TagNameMenu isVisible={isTagNameMenuVisible} tags={tags} convertToValuelessTag={convertToValuelessTag} />
      <TagValueMenu isVisible={isTagValueMenuVisible} nameTag={currentValuelessTag} tags={tags} onClick={addValueToActiveTag} />
      <div className='active-datum flex relative items-center justify-between w-full h-[50px] pl-[10px]'>
        <div className='flex'>{activeTags.map((tag, i) => <Tag key={i} {...tag} />)}

          <form onSubmit={createTagName} className='flex items-center justify-center'>
            {
              currentValuelessTag
                ? <DatumBarValueInput
                  value={newTagNameInputValue}
                  // onFocus={beginCreateActiveTag}
                  onBlur={endCreateActiveTag}
                  onChange={updateTagNameInputValue}
                  tagNameTag={currentValuelessTag}
                />
                : <DatumBarNameInput
                  value={newTagNameInputValue}
                  onFocus={beginCreateActiveTag}
                  onBlur={endCreateActiveTag}
                  onChange={updateTagNameInputValue}
                  tagNameTag={currentValuelessTag}
                />
            }
            {newTagNameInputValue && <button className={`flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg text-black ${isNewTagNameInputFocused ? 'bg-white' : 'bg-neutral-700'}`} onClick={createTagName}><FaPlus /></button>}
          </form>
        </div>
        {activeTags.length ? <button className='flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white' onClick={submitActiveDatum}><FaPlus /></button> : null}
      </div>
    </>
  )
}

function DatumBarNameInput({ value, onBlur, onFocus, onChange, tagNameTag }: any) {
  let rounded = value ? 'rounded-tl rounded-bl' : 'rounded'
  return (

    <input
      className={`new-tag-input flex items-center border ${rounded} px-[5px] h-[30px] pb-[1px] w-[66px] placeholder-neutral-700 border-neutral-700 bg-black focus:border-white text-neutral-700 focus:text-white focus:placeholder-white`}
      placeholder={'New tag'}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
    ></input>
  )
}

function DatumBarValueInput({ value, onBlur, onFocus, onChange, tagNameTag }: any) {
  const rounded = value ? '' : 'rounded-tr rounded-br'
  return (
    <>
      {tagNameTag && <span className='tag inline-flex rounded-tl rounded-bl overflow-hidden h-[30px] font-bold whitespace-nowrap'>
        <button className={`inline-flex relative items-center pl-[8px] pr-[6px]`} style={{ backgroundColor: tagNameTag.color, color: getContrastColor(tagNameTag.color) }}>{tagNameTag.name}</button>
      </span>
      }
      <input
        className={`new-tag-input flex items-center ${rounded} border px-[5px] h-[30px] pb-[1px] w-[66px] bg-black placeholder-neutral-700 focus:text-white`}
        autoFocus
        placeholder={tagNameTag ? 'value' : 'New tag'}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        style={{ borderColor: tagNameTag.color }}
      ></input>
    </>
  )
}

export default function App() {
  const [datums, setDatums] = useState<Datum[]>([])
  const [tags, setTags] = useState<Tag[]>([])

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
  }, [datums])

  function addActiveDatum(tags: Tag[]) {
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
    let tags: Tag[] = []
    datums.forEach(datum => {
      datum.tags.forEach((tag: Tag) => {
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
        <ActiveDatum tags={tags} addActiveDatum={addActiveDatum} />
      </footer>
    </main >
  );
}
