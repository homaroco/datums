import Link from 'next/link'
import './styles.css'

export default function LandingPage() {
  return (
    <main className="text-white text-center flex flex-col items-center p-[10px]">
      <h1 className="rainbow text-5xl font-bold select-none">Datums</h1>
      <h2 className="text-2xl pt-[10px]">Welcome to your data's new home.</h2>
      <img
        className="app-glow my-[50px] w-[200px] rounded-lg"
        src="app.png"
      ></img>
      <p className="pt-[20px] max-w-[40em] mx-auto text-sm">
        Datums is a repository for your personal and private information, the
        kind you don't want monetized. From your todo list, health metrics,
        finances or habits, the data you store in Datums is up to you.
      </p>
      <Link href="/login">Login</Link>
    </main>
  )
}
