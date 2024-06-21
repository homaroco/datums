import { FaPlus } from 'react-icons/fa6'
import { getContrastColor } from '../lib/utils.js'

export default function ValueInput({
  color,
  value,
  onBlur,
  onFocus,
  onChange,
  onSubmit,
}: any) {
  const rounded = value ? '' : 'rounded-tr rounded-br'
  return (
    <input
      className={`new-tag-input flex items-center ${rounded} border px-[5px] h-[30px] pb-[1px] w-[66px] bg-black placeholder-neutral-700 focus:text-white`}
      autoFocus
      placeholder={'value'}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      style={{
        borderColor: color,
        marginRight: value ? '0' : '5px',
      }}
    ></input>
  )
}
