export default function LoginPage({ loginPageRef, login, userEmail, userPassword }: any) {
  return (
    <section ref={loginPageRef} className='login-page flex fixed justify-center items-center pt-[5px] top-0 w-full h-full z-30 overflow-auto bg-black'>
      <span className='fixed top-[5px] rainbow text-3xl font-bold select-none'>Datums</span>
      <form onSubmit={login} className='flex flex-col'>
        <input value={userEmail} className={`border border-neutral-700 bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`} placeholder='Email' onChange={e => setUserEmail(e.target.value)}></input>
        <input value={userPassword} className={`border border-neutral-700 bg-black p-[5px] mx-[20px] rounded mb-[5px] m-auto text-white`} placeholder='Password' onChange={e => setUserPassword(e.target.value)}></input>
        {userEmail && userPassword && <button className={`absolute top-[375px] rainbow border border-white rounded mx-[20px] w-[175px] m-auto p-[5px] font-bold`} onClick={login}>Get Datums</button>}
      </form>
    </section>
  )
}