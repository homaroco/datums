import { useEffect, useState } from 'react'

export default function LoginPage({
  loginPageRef,
  login,
  userEmail,
  userPassword,
  setUserEmail,
  setUserPassword,
}: any) {
  const [rememberCredentials, setRememberCredentials] = useState(false)

  useEffect(() => {
    if (rememberCredentials) {
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('userPassword', userPassword)
    }
  }, [rememberCredentials])

  return (
    <section
      ref={loginPageRef}
      className="login-page flex fixed justify-center items-center pt-[5px] top-0 w-full h-full z-30 overflow-auto bg-black"
    >
      <span className="fixed top-[5px] rainbow text-3xl font-bold select-none">
        Datums
      </span>
      <form onSubmit={login} className="flex flex-col">
        {userEmail && userPassword && (
          <span className="absolute top-[280px] mx-[20px]">
            <input
              type="checkbox"
              id="rememberCredentials"
              checked={rememberCredentials}
              onChange={() => setRememberCredentials(!rememberCredentials)}
            />
            <label htmlFor="rememberCredentials" className="pl-[5px] pb-[2px]">
              Remember me
            </label>
          </span>
        )}
        <input
          autoComplete="on"
          value={userEmail}
          className={`border border-neutral-700 focus:border-white bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`}
          placeholder="Email"
          onChange={(e) => setUserEmail(e.target.value)}
        ></input>
        <input
          autoComplete="on"
          value={userPassword}
          className={`border border-neutral-700 focus:border-white bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`}
          placeholder="Password"
          onChange={(e) => setUserPassword(e.target.value)}
        ></input>
        {userEmail && userPassword && (
          <button
            type="submit"
            className={`absolute top-[375px] rainbow border border-white rounded mx-[20px] w-[175px] m-auto p-[5px] font-bold`}
            onClick={login}
          >
            Get Datums
          </button>
        )}
      </form>
    </section>
  )
}
