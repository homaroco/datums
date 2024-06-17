export default function DatumList({ datums }: any) {
  return (
    <section className='relative w-full h-full overflow-auto'>
      <ul id='datum-list' className='datum-list overflow-auto'>
        {datums.map((datum: any, i: number) => <Datum key={datum.uuid} {...datum} deleteDatum={() => deleteDatum(datum.uuid)} />)}
      </ul>
    </section>
  )
}