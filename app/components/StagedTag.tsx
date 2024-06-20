import { FaPlus } from "react-icons/fa6"
import { getContrastColor } from "../lib/color"
import { TagProps } from "../types"
import ValueInput from "./ValueInput"

export default function StagedTag({ name, value, unit, color, onClickAddValue, onClickName, focused, onValueChange, onValueSubmit }: any) {
  let roundedValue = 'rounded-tr rounded-br'
  let padding = 'pr-[6px]'
  if (unit) roundedValue = ''
  if (!value) padding = 'pr-[8px]'
  return (
    <span className='staged-tag inline-flex rounded overflow-hidden h-[30px] font-bold mr-[5px] whitespace-nowrap'>
      {name && <button className={`inline-flex relative items-center ${padding} pl-[8px]`} style={{ backgroundColor: color, color: getContrastColor(color) }}>{name}</button>}
      {focused === false && value && <button className={`inline-flex relative items-center px-[6px] border-2 ${roundedValue}`} style={{ color, borderColor: color, background: getContrastColor(color) }}>{value}</button>}
      {unit && <button className='pr-[6px] pl-[4px]' style={{ background: color, color: getContrastColor(color) }}>{unit}</button>}
      {focused === false && value === undefined && <button className='flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg' style={{ backgroundColor: color, color: getContrastColor(color) }} onClick={onClickAddValue}><FaPlus /></button>}
      {focused === 'value' && <ValueInput color={color} value={value} onChange={onValueChange} onSubmit={e => onValueSubmit(e)} />}
    </span>
  )
}
