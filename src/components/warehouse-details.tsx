import { api } from "@/utils/api"

export function WarehouseDetails(props: { warehouseId: number }) {
  const { status, data, error } = api.warehouse.getById.useQuery({
    id: props.warehouseId,
  })

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error: {error.message}</>

  return <>{data.displayName}</>
}
