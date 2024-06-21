import React, {
  MutableRefObject,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TagNameMenu, TagValueMenu } from './TagMenus'
import { getContrastColor, getRandomHex } from '../lib/utils'
import { FaPlus } from 'react-icons/fa6'
import { v4 as uuid } from 'uuid'

import { TagProps, StagedTag } from '../types'

function getFocusedTag(tags: StagedTag[]) {
  const focusedTag = [...tags].filter((tag) => tag.focused !== false)
  if (!focusedTag.length) return false
  else return focusedTag[0]
}

export default function StagedDatum({
  tags,
  createDatum,
}: {
  tags: TagProps[]
  createDatum: (tags: TagProps[]) => void
}) {
  const [stagedTags, setStagedTags] = useState<StagedTag[]>([])
  const [nameWidths, setNameWidths] = useState<number[]>([])
  const [valueWidths, setValueWidths] = useState<number[]>([])
  const [nameInput, setNameInput] = useState<string>('')
  const [isNameInputFocused, setIsNameInputFocused] = useState<boolean>(false)
  const [activeTag, setActiveTag] = useState<StagedTag | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState<'name' | 'value' | false>(false)

  const createDatumBtnRef = useRef<HTMLButtonElement>(null)

  const nameInputRefs = useRef<MutableRefObject<HTMLInputElement>[]>([])
  nameInputRefs.current = stagedTags.map(
    (tag, i) => nameInputRefs.current[i] ?? React.createRef()
  )

  const nameSpanRefs = useRef<MutableRefObject<HTMLElement>[]>([])
  nameSpanRefs.current = stagedTags.map(
    (tag, i) => nameSpanRefs.current[i] ?? React.createRef()
  )

  const valueInputRefs = useRef<MutableRefObject<HTMLInputElement>[]>([])
  valueInputRefs.current = stagedTags.map(
    (tag, i) => valueInputRefs.current[i] ?? React.createRef()
  )

  const valueSpanRefs = useRef<MutableRefObject<HTMLElement>[]>([])
  valueSpanRefs.current = stagedTags.map(
    (tag, i) => valueSpanRefs.current[i] ?? React.createRef()
  )

  useEffect(() => {
    const nameWidths = stagedTags.map((tag, i) => {
      return nameSpanRefs.current[i].current.offsetWidth
    })
    setNameWidths(nameWidths)
    const valueWidths = stagedTags.map((tag, i) => {
      return valueSpanRefs.current[i].current.offsetWidth
    })
    setValueWidths(valueWidths)

    // if (getFocusedTag(stagedTags) === false && isNameInputFocused === false)
    //   (document.activeElement as HTMLElement).blur()
  }, [stagedTags])

  function focusNameInput() {
    blurTags()
    setIsNameInputFocused(true)
    setIsMenuOpen('name')
  }

  function focusTag(nameOrValue: 'name' | 'value', index: number) {
    // focus the name or value of the ith tag
    const newTags = [...stagedTags].map((tag, i) =>
      i === index ? { ...tag, focused: nameOrValue } : tag
    )
    setIsMenuOpen(nameOrValue)
    setActiveTag(newTags[index])
    setStagedTags(newTags)
  }

  function changeTag(nameOrValue: 'name' | 'value', index: number, e: any) {
    // set the name or value of the ith tag to the input value
    const newTags = [...stagedTags].map((tag, i) =>
      i === index ? { ...tag, [nameOrValue]: e.target.value } : tag
    )
    setActiveTag(newTags[index])
    setStagedTags(newTags)
  }

  function blurTags() {
    // false everything
    const newTags = [...stagedTags].map((tag) => ({
      ...tag,
      focused: false,
    }))
    setStagedTags(newTags)
    createDatumBtnRef.current?.focus()
  }

  function createTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') {
      return
    }
    const newTags = [...stagedTags].concat({
      id: uuid(),
      color: getRandomHex(6),
      name: (e.target as HTMLInputElement).value,
      value: undefined,
      focused: false,
      width: 0,
    })
    setStagedTags(newTags)
    setNameInput('')
    setIsNameInputFocused(false)
    setIsMenuOpen(false)
    createDatumBtnRef.current?.focus()
  }

  function convertAddValueBtnToInput(index: number) {
    const newTags = [...stagedTags].map((tag, i) =>
      i === index ? { ...tag, value: '' } : tag
    )
    setStagedTags(newTags)
  }

  function createStagedTagFromNameMenu(tag: StagedTag) {
    const newTags = [...stagedTags].concat(tag)
    setStagedTags(newTags)
  }

  function updateStagedTagFromValueMenu(value: string) {
    const newTags = [...stagedTags].map((tag) =>
      activeTag && tag.id === activeTag.id ? { ...tag, value } : tag
    )
    setStagedTags(newTags)
    setIsMenuOpen(false)
  }

  return (
    <footer
      onBlur={() => setIsMenuOpen(false)}
      className="flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black"
    >
      <TagNameMenu
        isVisible={isMenuOpen === 'name' && tags.length !== 0}
        tags={tags}
        selectTag={createStagedTagFromNameMenu}
      />
      {activeTag && (
        <TagValueMenu
          isVisible={isMenuOpen === 'value' && tags.length !== 0}
          nameTag={activeTag}
          tags={tags}
          selectValue={updateStagedTagFromValueMenu}
        />
      )}
      <div className="active-datum flex relative items-center justify-between w-full h-[50px] pl-[10px]">
        <div className="flex relative overflow-auto">
          <div className="inline-flex relative grow overflow-auto">
            <div className="inline-flex relative">
              {stagedTags.map((tag, i) => {
                return (
                  <span
                    key={i}
                    className="staged-tag inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap"
                  >
                    <input
                      className="inline-flex relative items-center pr-[8px] pl-[8px] min-w-[17px]"
                      value={tag.name}
                      onFocus={() => focusTag('name', i)}
                      onBlur={blurTags}
                      onKeyDown={(e) => e.key === 'Enter' && blurTags()}
                      onChange={(e) => changeTag('name', i, e)}
                      ref={nameInputRefs.current[i]}
                      style={{
                        backgroundColor: tag.color,
                        color: getContrastColor(tag.color),
                        width: nameWidths[i] + 1, // extra pixel allows selecting end of string
                      }}
                    ></input>
                    <span
                      ref={nameSpanRefs.current[i]}
                      className="dummy-staged-tag-name absolute z-[-10] inline-flex items-center pr-[8px] pl-[8px]"
                    >
                      {tag.name}
                    </span>
                    {typeof tag.value === 'string' ? (
                      <input
                        className="flex items-center rounded-tr rounded-br border-2 px-[6px]"
                        value={tag.value === undefined ? '' : tag.value}
                        placeholder="value"
                        autoFocus
                        onFocus={() => focusTag('value', i)}
                        onBlur={() => blurTags()}
                        onKeyDown={(e) => e.key === 'Enter' && blurTags()}
                        onChange={(e) => changeTag('value', i, e)}
                        style={{
                          color: tag.color,
                          backgroundColor: getContrastColor(tag.color),
                          borderColor: tag.color,
                          width: tag.value === '' ? '50px' : valueWidths[i] + 1, // extra pixel allows selecting end of string
                        }}
                      ></input>
                    ) : (
                      <button
                        className="flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg"
                        style={{
                          backgroundColor: tag.color,
                          color: getContrastColor(tag.color),
                        }}
                        onClick={() => convertAddValueBtnToInput(i)}
                      >
                        <FaPlus />
                      </button>
                    )}
                    <span
                      ref={valueSpanRefs.current[i]}
                      className="dummy-staged-tag-name absolute z-[-10] inline-flex items-center pl-[8px] pr-[8px]"
                    >
                      {tag.value}
                    </span>
                  </span>
                )
              })}
              <input
                className="flex items-center border rounded px-[5px] h-[30px] ph-[1px] w-[66px] placeholder-neutral-700 border-neutral-700 bg-black focus:border-white text-neutral-700 focus:text-white focus:outline-none focus:placeholder:text-white"
                onFocus={focusNameInput}
                onBlur={() => setIsNameInputFocused(false)}
                onKeyDown={(e) => createTag(e)}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="New tag"
                value={nameInput}
              ></input>
            </div>
          </div>
        </div>
        <button
          className="flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white"
          disabled={stagedTags.length === 0}
          ref={createDatumBtnRef}
          onClick={() => {
            createDatum(stagedTags)
            setStagedTags([])
          }}
        >
          <FaPlus />
        </button>
      </div>
    </footer>
  )
}
