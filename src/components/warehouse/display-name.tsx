import { api } from "@/utils/api"

export function DisplayName({ id }: { id: number }) {
  const { status, data, error } = api.warehouse.getById.useQuery({
    id,
  })

  if (status === "loading") return <>...</>
  if (status === "error") return <>error: {error.message}</>

  return <>{data?.displayName}</>
}
