import { useEffect, useRef, useState } from 'react'

import { TagNameMenu, TagValueMenu } from './TagMenus'
import DatumBarValueInput from './DatumBarValueInput'
import DatumBarNameInput from './DatumBarNameInput'
import { getRandomHex } from '../lib/utils'

import { TagProps } from '../types'
import { FaPlus } from 'react-icons/fa6'
import { Tag } from './Tag'

export default function ActiveDatum({ tags, addActiveDatum }: { tags: TagProps[], addActiveDatum: (tags: TagProps[]) => void }) {
  const [stagedTags, setStagedTags] = useState<TagProps[]>([])
  const [activeTag, setActiveTag] = useState<TagProps | null>(null)
  const [tagInputValue, setTagInputValue] = useState('')
  const [isMenuVisible, setIsMenuVisible] = useState<false | 'name' | 'value'>(false)
  const [isNewTagNameInputFocused, setIsNewTagNameInputFocused] = useState(false)

  // useEffect(() => {
  //   if (newTagNameDummyRef.current) {
  //     setInputWidth(newTagNameDummyRef.current.offsetWidth || 72)
  //   }
  // }, [tagInputValue])


  function beginCreateActiveTag() {
    setIsNewTagNameInputFocused(true)
    setIsMenuVisible('name')
  }

  function endCreateActiveTag(e: { target: { value: any; }; }) {
    setIsNewTagNameInputFocused(false)
    if (e.target.value) return
    if (activeTag !== null) return
    setIsMenuVisible(false)
  }

  function addTagToStaged(e: any) {
    e.preventDefault()
    // TODO check if it exists already
    // if not, add to tag name menu
    let newTag
    if (activeTag) {
      newTag = {
        color: activeTag.color,
        name: activeTag.name,
        value: tagInputValue,
      }
      setActiveTag(null)
    } else {
      newTag = {
        color: getRandomHex(6),
        name: tagInputValue,
      }
    }
    setStagedTags([
      ...stagedTags,
      newTag,
    ])
    setTagInputValue('')
    endCreateActiveTag(e)
  }

  function addNameTagToStaging(tag: TagProps) {
    setStagedTags([
      ...stagedTags,
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
    addActiveDatum(stagedTags)
    setStagedTags([])
  }

  function addToActiveTags(tag: TagProps) {
    setStagedTags([
      ...stagedTags,
      tag
    ])
  }

  function convertToValuelessTag(tag: TagProps) {
    setActiveTag(tag)
    setIsMenuVisible('value')
  }

  function addValueToActiveTag(value: string) {
    if (!activeTag) return
    setIsMenuVisible(false)
    addToActiveTags({
      name: activeTag.name,
      value,
      color: activeTag.color,
    })
    setActiveTag(null)
  }

  return (
    <>
      <TagNameMenu isVisible={isMenuVisible === 'name'} tags={tags} convertToValuelessTag={convertToValuelessTag} createNameTagFromButton={addNameTagToStaging} />
      {activeTag && <TagValueMenu isVisible={isMenuVisible === 'value'} nameTag={activeTag} tags={tags} onClick={addValueToActiveTag} />}
      <div className='active-datum flex relative items-center justify-between w-full h-[50px] pl-[10px]'>
        <div className='flex relative overflow-auto'>
          <div className='inline-flex relative grow overflow-auto'>
            <div className='inline-flex relative'>
              {stagedTags.map((tag, i) => <Tag key={i} {...tag} />)}
              <form onSubmit={addTagToStaged} className='flex items-center justify-center'>
                {
                  activeTag
                    ? <DatumBarValueInput
                      value={tagInputValue}
                      // onFocus={beginCreateActiveTag}
                      onBlur={endCreateActiveTag}
                      onChange={updateTagNameInputValue}
                      tagNameTag={activeTag}
                    />
                    : <DatumBarNameInput
                      value={tagInputValue}
                      onFocus={beginCreateActiveTag}
                      onBlur={endCreateActiveTag}
                      onChange={updateTagNameInputValue}
                      tagNameTag={activeTag}
                    />
                }
                {tagInputValue && <button className={`flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg text-black ${isNewTagNameInputFocused ? 'bg-white' : 'bg-neutral-700'}`} onClick={addTagToStaged}><FaPlus /></button>}
              </form>
            </div>
          </div>
        </div>
        {stagedTags.length ? <button className='flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white' onClick={submitActiveDatum}><FaPlus /></button> : null}
      </div>
    </>
  )
}
