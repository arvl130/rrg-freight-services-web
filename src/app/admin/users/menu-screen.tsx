import type { User } from "@/server/db/entities"
import type { UsersTableItemScreen } from "@/utils/constants"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import Image from "next/image"

export function MenuScreen({
  user,
  setSelectedScreen,
  close,
}: {
  user: User
  setSelectedScreen: (selectedScreen: UsersTableItemScreen) => void
  close: () => void
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full mb-2 flex justify-end">
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
      <div className="flex flex-col mt-8">
        <button
          type="button"
          className="bg-cyan-400 text-white font-medium flex justify-between text-left px-4 py-3 border-b border-cyan-500 rounded-t-lg"
          onClick={() => setSelectedScreen("OVERVIEW")}
        >
          <div>Personal Information</div>
          <div>
            <CaretRight size={20} />
          </div>
        </button>
        <button
          type="button"
          className="bg-cyan-400 text-white font-medium flex justify-between text-left px-4 py-3 border-b border-cyan-500"
          onClick={() => setSelectedScreen("UPDATE_ROLE")}
        >
          <div>Role</div>
          <div>
            <CaretRight size={20} />
          </div>
        </button>
        <button
          type="button"
          className="bg-cyan-400 text-white font-medium flex justify-between text-left px-4 py-3 rounded-b-lg"
          onClick={() => setSelectedScreen("UPDATE_PHOTO")}
        >
          <div>Profile Picture</div>
          <div>
            <CaretRight size={20} />
          </div>
        </button>
      </div>
    </>
  )
}
