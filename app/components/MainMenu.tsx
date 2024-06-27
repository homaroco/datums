export default function MainMenu({
  isOpen,
  closeMenu,
  logout,
  openSettings,
}: {
  isOpen: boolean
  closeMenu: () => void
  logout: () => void
  openSettings: () => void
}) {
  //   box-shadow: rgba(0, 0, 0, 0.75) 10px 0px 15px 15px;
  let width = 'w-[0%]'
  let boxShadow = 'shadow-[0_0_0_0_rgba(0,0,0,0.75)]'
  if (isOpen) {
    width = 'w-[50%]'
    boxShadow = 'shadow-[10px_0_15px_15px_rgba(0,0,0,0.75)]'
  }
  return (
    <>
      <ul
        className={`main-menu flex flex-col fixed transition-all duration-[500ms] z-30 bottom-0 top-0 right-[-1px] ${width} bg-black border-l border-white text-l font-bold`}
      >
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={logout}
        >
          Logout
        </li>
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={openSettings}
        >
          Settings
        </li>
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={logout}
        >
          Help
        </li>
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={logout}
        >
          About
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
