import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  if (isLoading || role !== "OVERSEAS_AGENT") return <>...</>

  return <>This is the Packages page for the Overseas Agents.</>
}
