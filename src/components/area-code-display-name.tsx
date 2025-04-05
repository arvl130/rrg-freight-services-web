import { api } from "@/utils/api"

function ProvinceDisplayName(props: { areaCode: string }) {
  const { status, data, error } = api.province.getById.useQuery({
    id: props.areaCode,
  })

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return <>{data.name}</>
}

function CityDisplayName(props: { areaCode: string }) {
  const { status, data, error } = api.city.getById.useQuery({
    id: props.areaCode,
  })

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return (
    <>
      {data.name}, {data.provinceName}
    </>
  )
}

function BarangayDisplayName(props: { areaCode: string }) {
  const { status, data, error } = api.barangay.getById.useQuery({
    id: props.areaCode,
  })

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return (
    <>
      Brgy. {data.name}, {data.cityName}, {data.provinceName}
    </>
  )
}

export function AreaCodeDisplayName(props: { areaCode: string }) {
  if (props.areaCode.length === 2)
    return <>Display names are not available for regions.</>

  if (props.areaCode.length === 4)
    return <ProvinceDisplayName areaCode={props.areaCode} />

  if (props.areaCode.length === 6)
    return <CityDisplayName areaCode={props.areaCode} />

  if (props.areaCode.length === 9)
    return <BarangayDisplayName areaCode={props.areaCode} />

  return <>Unsupported area code: {props.areaCode}</>
}
