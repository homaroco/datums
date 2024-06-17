export default function DatumBar() {
  return (
    <footer className='flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black'>
      <StagedDatum tags={tags} addActiveDatum={addActiveDatum} />
    </footer>
  )
}