import { useState } from 'react'

export default function AppMenu({
  isOpen,
  closeMenu,
  privateKey,
  loadPrivateKey,
}: {
  isOpen: boolean
  closeMenu: () => void
  privateKey: JsonWebKey | null
  loadPrivateKey: (key: string) => void
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [keyInput, setKeyInput] = useState('')

  function copyPrivateKeyToClipboard() {
    navigator.clipboard
      .writeText(JSON.stringify(privateKey))
      .then(() => setIsCopied(true))
  }

  const KeyInput = () => (
    <form onSubmit={() => loadPrivateKey(keyInput)}>
      <label htmlFor="keyInput">Load secret: </label>
      <input
        className="inline-flex items-center border rounded px-[5px] h-[30px] ph-[1px] w-[66px] placeholder-neutral-700 border-neutral-700 bg-black focus:border-white text-neutral-700 focus:text-white focus:outline-none focus:placeholder:text-white"
        id="keyInput"
      ></input>
      <button>+</button>
    </form>
  )

  let width = 'w-[0%]'
  if (isOpen) width = 'w-[100%]'
  return (
    <>
      <ul
        className={`app-menu flex flex-col fixed z-30 bottom-0 top-0 right-[-1px] ${width} bg-black border-l border-white text-l font-bold`}
      >
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={copyPrivateKeyToClipboard}
        >
          {isCopied
            ? 'Keep it secret, keep it safe!'
            : 'Copy secret to clipboard'}
        </li>
        <li className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700">
          <KeyInput />
        </li>
        <li
          className="flex justify-start items-center color-red mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={closeMenu}
        >
          Clear secret
        </li>
        <li
          className="flex justify-start items-center mx-[10px] h-[50px] border-b border-neutral-700"
          onClick={closeMenu}
        >
          Back
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
