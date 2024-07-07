import Link from 'next/link'
import './styles.css'

export default function LandingPage() {
  return (
    <main className="text-white text-center flex flex-col items-center p-[20px] pt-[10px]">
      <div className="flex items-end justify-end w-full">
        <Link
          href="/"
          className="rainbow relative border rounded border-neutral-700 p-[5px] right-[-10px]"
        >
          Go to app
        </Link>
      </div>
      <h1 className="text-4xl pb-[20px] pt-[40px] drop-shadow-2xl shadow-white">
        Welcome to your data's new home.
      </h1>
      <img
        className="app-glow my-[50px] w-[90%] max-w-[320px] rounded-lg"
        src="app.png"
      ></img>
      <p className="pt-[20px] max-w-[40em] mx-auto text-md text-justify">
        <span className="rainbow">Datums</span> is a repository for your
        personal and private information, the kind you don't want monetized.
        From your todo list, health metrics, finances or habits, the data you
        store in <span className="rainbow">Datums</span> is up to you.
      </p>
      <h2 className="pt-[20px] mx-auto text-2xl text-center">
        See and interact with your data how you want
      </h2>
      <p className="pt-[20px] max-w-[40em] mx-auto text-md text-justify">
        Install different views (sub-apps) for your different entries. The base
        app will come with views for <span className="rainbow">Datums</span>{' '}
        like todo items, daily habits, finances, statistics, and a period
        tracker.
      </p>
      <h2 className="pt-[20px] mx-auto text-2xl text-center">
        Offline storage, online encryption, by default
      </h2>
      <p className="pt-[20px] max-w-[40em] mx-auto text-md text-justify">
        Your data is stored offline by default, and if you want to access your
        data from any device, our online storage is fully encrypted. We don't
        know what your data is, and we don't want to know.
      </p>
      <h2 className="pt-[20px] mx-auto text-2xl text-center">
        No sign in, no problem
      </h2>
      <p className="pt-[20px] max-w-[40em] mx-auto text-md text-justify">
        Your data is tied to your device, and switching devices is as simple as
        a drag-and-drop. Export all your data in a free and open standard, or
        carry your device secret with you
      </p>
    </main>
  )
}
