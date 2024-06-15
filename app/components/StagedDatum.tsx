import { useEffect, useRef, useState } from 'react'

import { TagNameMenu, TagValueMenu } from './TagMenus'
import DatumBarValueInput from './DatumBarValueInput'
import DatumBarNameInput from './DatumBarNameInput'
import { getRandomHex } from '../lib/utils'

import { TagProps } from '../types'
import { FaPlus } from 'react-icons/fa6'
import { Tag } from './Tag'

export default function ActiveDatum({ tags, addActiveDatum }: { tags: TagProps[], addActiveDatum: (tags: Tag[]) => void }) {
  const [newTagColor, setNewTagColor] = useState('')
  const [activeTags, setActiveTags] = useState<TagProps[]>([])
  const [currentValuelessTag, setCurrentValuelessTag] = useState<TagProps | null>(null)
  const [tagInputValue, setTagInputValue] = useState('')
  const [isTagNameMenuVisible, setIsTagNameMenuVisible] = useState(false)
  const [isTagValueMenuVisible, setIsTagValueMenuVisible] = useState(false)
  const [isNewTagNameInputFocused, setIsNewTagNameInputFocused] = useState(false)

  const newTagNameDummyRef = useRef(null)

  useEffect(() => {
    setNewTagColor(getRandomHex(6))
  }, [activeTags])

  // useEffect(() => {
  //   if (newTagNameDummyRef.current) {
  //     setInputWidth(newTagNameDummyRef.current.offsetWidth || 72)
  //   }
  // }, [tagInputValue])


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

  function addTagToStaged(e: any) {
    e.preventDefault()
    // TODO check if it exists already
    // if not, add to tag name menu
    let newTag
    if (currentValuelessTag) {
      newTag = {
        color: currentValuelessTag.color,
        name: currentValuelessTag.name,
        value: tagInputValue,
      }
      setCurrentValuelessTag(null)
    } else {
      newTag = {
        color: newTagColor,
        name: tagInputValue,
      }
    }
    setActiveTags([
      ...activeTags,
      newTag,
    ])
    setTagInputValue('')
    endCreateActiveTag(e)
    if (currentValuelessTag) { }
  }

  function addNameTagToStaging(tag: TagProps) {
    setActiveTags([
      ...activeTags,
      tag,
    ])

  }

  function updateTagNameInputValue(e: any) {
    if (e.key === 'Enter') {
      addTagToStaged(e)
    }
    else setTagInputValue(e.target.value)
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

  function convertToValuelessTag(tag: TagProps) {
    setCurrentValuelessTag(tag)
    setIsTagNameMenuVisible(false)
    setIsTagValueMenuVisible(true)
  }

  function addValueToActiveTag(value: string) {
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
              <form onSubmit={addTagToStaged} className='flex items-center justify-center'>
                {
                  currentValuelessTag
                    ? <DatumBarValueInput
                      value={tagInputValue}
                      // onFocus={beginCreateActiveTag}
                      onBlur={endCreateActiveTag}
                      onChange={updateTagNameInputValue}
                      tagNameTag={currentValuelessTag}
                    />
                    : <DatumBarNameInput
                      value={tagInputValue}
                      onFocus={beginCreateActiveTag}
                      onBlur={endCreateActiveTag}
                      onChange={updateTagNameInputValue}
                      tagNameTag={currentValuelessTag}
                    />
                }
                {tagInputValue && <button className={`flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg text-black ${isNewTagNameInputFocused ? 'bg-white' : 'bg-neutral-700'}`} onClick={addTagToStaged}><FaPlus /></button>}
              </form>
            </div>
          </div>
        </div>
        {activeTags.length ? <button className='flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white' onClick={submitActiveDatum}><FaPlus /></button> : null}
      </div>
    </>
  )
}
