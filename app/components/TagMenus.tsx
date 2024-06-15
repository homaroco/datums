import { TagProps } from "../types"
import { Tag } from "./Tag"

export function TagNameMenu({ isVisible, tags, convertToValuelessTag, createNameTagFromButton }: { isVisible: boolean, tags: TagProps[], convertToValuelessTag: (tag: TagProps) => void, createNameTagFromButton: (tag: TagProps) => void }) {
  const uniqueTagNames = tags.filter((tag, i) => tags.findIndex(t => tag.name === t.name) === i)
  const uniqueNameTags = uniqueTagNames.map((tag: TagProps, i: number) =>
    <span
      onClick={() => {
        selectTag(tag)
      }}
      key={i}
      className='pb-[5px]'>
      <Tag {...{ name: tag.name, color: tag.color }} />
    </span>
  )

  function selectTag(tag: TagProps) {
    if (!tag.value) {
      createNameTagFromButton(tag)
    } else {
      convertToValuelessTag(tag)
    }
  }

  let height = 'max-h-0 opacity-0'
  let border = 'border-b-0'
  if (isVisible) {
    height = 'max-h-[150px] opacity-100'
    border = 'border-b-[1px]'
  }
  return (
    <div className={`tag-name-menu absolute px-[10px] bottom-full w-full ${height} overflow-scroll bg-black border-t-neutral-700`}>
      <div className={`${border} border-neutral-700`}>
        <div className={`inline-flex flex-wrap justify-start w-auto pt-[10px] pb-[5px]`}>
          {uniqueNameTags}
        </div>
      </div>
    </div>
  )
}

export function TagValueMenu({ isVisible, nameTag, tags, onClick }: { isVisible: boolean, nameTag: TagProps, tags: TagProps[], onClick: (value: string) => void }) {
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
    <div className={`tag-value-menu absolute bottom-full px-[10px] w-full ${height} overflow-scroll bg-black border-t-neutral-700`}>
      <div className={`${border} border-neutral-700`}>
        <div className={`inline-flex flex-wrap justify-start w-auto pt-[10px] pb-[5px]`}>
          {uniqueValueTags}
        </div>
      </div>
    </div>
  )
}