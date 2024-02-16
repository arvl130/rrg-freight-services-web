import { User } from "@/server/db/entities"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import Image from "next/image"

export function OverviewScreen({
  user,
  goToUpdateInfo,
  goBack,
  close,
}: {
  user: User
  goBack: () => void
  goToUpdateInfo: () => void
  close: () => void
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 w-full flex justify-between">
          <button type="button" onClick={goBack}>
            <CaretLeft size={20} />
          </button>
          <button type="button" onClick={close}>
            <X size={20} />
          </button>
        </div>
        <div className="aspect-square h-40">
          {user.photoUrl === null ? (
            <UserCircle size={160} />
          ) : (
            <Image
              height={160}
              width={160}
              alt="Profile picture"
              src={user.photoUrl}
              className="rounded-full"
            />
          )}
        </div>
        <div className="text-xl font-semibold mt-2">{user.displayName}</div>
        <div className="text-sm">{user.role}</div>
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-2">
          <div>Name</div>
          <div>{user.displayName}</div>
          <div>Email Address</div>
          <div>{user.emailAddress}</div>
          <div>Mobile Number</div>
          <div>{user.contactNumber}</div>
          <div>Gender</div>
          <div>{user.gender}</div>
          <div>Role</div>
          <div>{user.role}</div>
        </div>
        <button
          className="p-2 mt-6 text-white	w-full bg-cyan-500 transition-colors hover:bg-cyan-400 rounded-lg font-medium"
          onClick={goToUpdateInfo}
        >
          Edit User
        </button>
      </div>
    </>
  )
}
