import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "SENDER",
    },
  })

  if (isLoading || role !== "SENDER") return <>...</>

  return <>This is the Packages page for the Sending Agents.</>
}
