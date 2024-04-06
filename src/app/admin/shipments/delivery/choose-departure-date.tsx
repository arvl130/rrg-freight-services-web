export function ChooseDepartureDate(props: {
  minDate: string
  departureDate: string
  onChange: (departureDate: string) => void
}) {
  return (
    <div className="mt-3">
      <label className="font-medium block">Departure Date</label>
      <input
        type="date"
        className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
        min={props.minDate}
        value={props.departureDate}
        onChange={(e) => {
          props.onChange(e.currentTarget.value)
        }}
      />
    </div>
  )
}
