"use client"

import { api } from "@/utils/api"
import { UpdatePictureForm } from "./update-picture-form"
import { UpdateInformationForm } from "./update-profile-info-form"
import type { User } from "lucia"

export function RightColumn({ user }: { user: User }) {
  const { isPending, isError, data } = api.user.getById.useQuery({
    id: user.id,
  })

  if (isPending || isError) {
    return <article></article>
  }

  if (data === null) return <article>User profile is not yet created.</article>

  return (
    <article>
      <UpdatePictureForm user={data} />
      <UpdateInformationForm user={data} />
    </article>
  )
}
