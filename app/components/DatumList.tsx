import Datum from './Datum'

export default function DatumList({ datums, deleteDatum }: any) {
  return (
    <section className="relative w-full h-full overflow-auto">
      <ul id="datum-list" className="datum-list overflow-auto">
        {datums.map((datum: any) => (
          <Datum
            key={datum.uuid}
            {...datum}
            deleteDatum={() => deleteDatum(datum.uuid)}
          />
        ))}
      </ul>
    </section>
  )
}
