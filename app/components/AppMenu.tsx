import { LuCheckSquare } from 'react-icons/lu'
import { LuGalleryVertical } from 'react-icons/lu'
import { LuIterationCcw } from 'react-icons/lu'
import { LuList } from 'react-icons/lu'
import { TbDropletPlus } from 'react-icons/tb'

export default function AppMenu({
  isOpen,
  closeMenu,
  viewPeriodTracker,
}: {
  isOpen: boolean
  closeMenu: () => void
  viewPeriodTracker: () => void
}) {
  let height = 'h-[0]'
  if (isOpen) height = 'h-[33%]'
  return (
    <>
      <ul
        className={`app-menu flex flex-wrap justify-center fixed z-30 left-0 top-[-1px] right-0 ${height} bg-black border-b border-white text-l font-bold overflow-hidden`}
      >
        <li className="flex justify-center items-center mx-[10px] w-[75px] h-[75px]">
          <LuCheckSquare style={{ scale: 3 }} />
        </li>
        <li className="flex justify-center items-center mx-[10px] w-[75px] h-[75px]">
          <LuGalleryVertical style={{ scale: 3 }} />
        </li>
        <li className="flex justify-center items-center mx-[10px] w-[75px] h-[75px]">
          <LuIterationCcw style={{ scale: 3 }} />
        </li>
        <li className="flex justify-center items-center mx-[10px] w-[75px] h-[75px]">
          <LuList style={{ scale: 3 }} />
        </li>
        <li
          className="flex justify-center items-center mx-[10px] w-[75px] h-[75px]"
          onClick={viewPeriodTracker}
        >
          <TbDropletPlus style={{ scale: 3 }} />
        </li>
      </ul>
      {isOpen && (
        <div
          className="app-menu-click-away-listener flex fixed top-0 left-0 right-0 bottom-0 opacity-50 bg-black z-10"
          onClick={closeMenu}
        ></div>
      )}
    </>
  )
}
