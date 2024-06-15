import { useEffect, useRef, useState } from 'react'

import { TagNameMenu, TagValueMenu } from './TagMenus'
import DatumBarValueInput from './DatumBarValueInput'
import DatumBarNameInput from './DatumBarNameInput'
import { getRandomHex } from '../lib/utils'

import { TagProps } from '../types'
import { FaPlus } from 'react-icons/fa6'

export default function ActiveDatum({ tags, addActiveDatum }: { tags: Tag[], addActiveDatum: (tags: Tag[]) => void }) {
  const [newTagColor, setNewTagColor] = useState('')
  const [activeTags, setActiveTags] = useState<Tag[]>([])
  const [currentValuelessTag, setCurrentValuelessTag] = useState<Tag | null>(null)
  const [newTagNameInputValue, setNewTagNameInputValue] = useState('')
  const [isTagNameMenuVisible, setIsTagNameMenuVisible] = useState(false)
  const [isTagValueMenuVisible, setIsTagValueMenuVisible] = useState(false)
  const [isNewTagNameInputFocused, setIsNewTagNameInputFocused] = useState(false)

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

  function createTagNameFromInput(e: any) {
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

  function addNameTagToStaging(tag: Tag) {
    setActiveTags([
      ...activeTags,
      tag,
    ])

  }

  function updateTagNameInputValue(e: any) {
    if (e.key === 'Enter') {
      createTagNameFromInput(e)
    }
    else setNewTagNameInputValue(e.target.value)
  }

  function submitActiveDatum() {
    addActiveDatum(activeTags)
    setActiveTags([])
  }

  function addToActiveTags(tag: TagProps) {
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
      <TagNameMenu isVisible={isTagNameMenuVisible} tags={tags} convertToValuelessTag={convertToValuelessTag} createNameTagFromButton={addNameTagToStaging} />
      <TagValueMenu isVisible={isTagValueMenuVisible} nameTag={currentValuelessTag} tags={tags} onClick={addValueToActiveTag} />
      <div className='active-datum flex relative items-center justify-between w-full h-[50px] pl-[10px]'>
        <div className='flex relative overflow-auto'>
          <div className='inline-flex relative grow overflow-auto'>
            <div className='inline-flex relative'>
              {activeTags.map((tag, i) => <Tag key={i} {...tag} />)}
              <form onSubmit={createTagNameFromInput} className='flex items-center justify-center'>
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
                {newTagNameInputValue && <button className={`flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg text-black ${isNewTagNameInputFocused ? 'bg-white' : 'bg-neutral-700'}`} onClick={createTagNameFromInput}><FaPlus /></button>}
              </form>
            </div>
          </div>
        </div>
        {activeTags.length ? <button className='flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white' onClick={submitActiveDatum}><FaPlus /></button> : null}
      </div>
    </>
  )
}
