import { FaBars } from "react-icons/fa6";
import { LuArrowDownUp, LuListFilter } from "react-icons/lu";
import { TbGridDots } from "react-icons/tb";

export default function Header() {
  return (
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

  )
}