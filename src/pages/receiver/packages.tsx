import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "RECEIVER",
    },
  })

  if (isLoading || role !== "RECEIVER") return <>...</>

  return <>This is the Packages page for the Receiving Agents.</>
}
