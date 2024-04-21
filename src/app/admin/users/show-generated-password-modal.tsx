import { X } from "@phosphor-icons/react/dist/ssr/X"
import { Eye } from "@phosphor-icons/react/dist/ssr/Eye"
import { EyeClosed } from "@phosphor-icons/react/dist/ssr/EyeClosed"
import { Clipboard } from "@phosphor-icons/react/dist/ssr/Clipboard"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import toast from "react-hot-toast"

export function ShowGeneratedPasswordModal({
  generatedPassword,
  isOpen,
  onClose,
}: {
  generatedPassword: string
  isOpen: boolean
  onClose: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Show Generated Password
          </Dialog.Title>
          <div className="px-4 pt-2 pb-4 overflow-auto">
            <div className="overflow-auto">
              <p className="mb-2">This password will only be shown once.</p>
              <div className="font-medium bg-gray-700 w-full px-4 py-2 text-white rounded-md overflow-auto">
                <code className="overflow-auto text-ellipsis">
                  {isVisible ? <>{generatedPassword}</> : <>********</>}
                </code>
              </div>

              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="px-4 py-2 mr-3 inline-flex items-center border text-blue-500 border-blue-500 hover:bg-blue-100 disabled:bg-blue-300 rounded-md font-medium transition-colors duration-200"
                  onClick={() => {
                    setIsVisible((currIsVisible) => !currIsVisible)
                  }}
                >
                  {isVisible ? (
                    <>
                      <Eye size={16} />
                      <span className="ml-2">Hide</span>
                    </>
                  ) : (
                    <>
                      <EyeClosed size={16} />
                      <span className="ml-2">Show</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 inline-flex items-center bg-blue-500 disabled:bg-blue-300 hover:bg-blue-400 rounded-md font-medium transition-colors duration-200 text-white"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedPassword)
                    toast.success("Copied to clipboard")
                  }}
                >
                  <Clipboard size={16} />
                  <span className="ml-2">Copy</span>
                </button>
              </div>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
