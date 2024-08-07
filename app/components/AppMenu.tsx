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
  let boxShadow = 'shadow-[0_0_0_0_rgba(0,0,0,0.75)]'
  let opacity = 'opacity-0'
  if (isOpen) {
    height = 'h-[20%]'
    boxShadow = 'shadow-[0_10px_15px_15px_rgba(0,0,0,0.75)]'
    opacity = 'opacity-50'
  }
  return (
    <>
      <ul
        className={`app-menu flex transition-all duration-[500ms] flex-wrap justify-start items-start fixed z-30 left-0 top-[-1px] right-0 ${height} ${boxShadow} bg-black border-b border-white text-l font-bold overflow-hidden`}
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
          className={`app-menu-click-away-listener flex fixed top-0 left-0 right-0 ${opacity} transition-opacity bottom-0 bg-black z-10`}
          onClick={closeMenu}
        ></div>
      )}
    </>
  )
}
