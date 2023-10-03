import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "DOMESTIC_AGENT",
    },
  })

  if (isLoading || role !== "DOMESTIC_AGENT") return <>...</>

  return <>This is the Packages page for the Receiving Agents.</>
}
