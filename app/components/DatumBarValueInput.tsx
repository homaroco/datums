import { getContrastColor } from '../lib/utils.js'


export default function DatumBarValueInput({ value, onBlur, onFocus, onChange, tagNameTag }: any) {
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