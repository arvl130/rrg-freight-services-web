import type { UploadedManifest } from "@/server/db/entities"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { UploadManifestModal } from "./upload-manifest-modal"
import { DateTime } from "luxon"
import { getHumanizedOfuploadedManifestStatus } from "@/utils/humanize"
import { getColorOfUploadedManifestStatus } from "@/utils/colors"
import { ReuploadManifestModal } from "./reupload-manifest-modal"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"

function ListViewItem(props: { item: UploadedManifest }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "REUPLOAD" | "VIEW_SHIPMENT"
  >(null)

  return (
    <>
      <div
        key={props.item.id}
        className="grid grid-cols-subgrid col-span-4 border-x border-b border-gray-300"
      >
        <div className="px-3 py-2 border-r border-gray-300">
          {props.item.id}
        </div>
        <div className="px-3 py-2 border-r border-gray-300">
          {DateTime.fromISO(props.item.createdAt).toLocaleString(
            DateTime.DATETIME_FULL,
          )}
        </div>
        <div className="px-3 py-2 border-r border-gray-300">
          <span
            className={`${getColorOfUploadedManifestStatus(
              props.item.status,
            )} text-white font-medium px-3 rounded-full text-sm py-1`}
          >
            {getHumanizedOfuploadedManifestStatus(props.item.status)}
          </span>
        </div>
        <div className="px-3 py-2 flex gap-x-3 gap-y-2 flex-wrap">
          {props.item.status === "REUPLOAD_REQUESTED" && (
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 transition-colors duration-200 disabled:bg-purple-300 rounded-md text-white font-medium"
              onClick={() => {
                setVisibleModal("REUPLOAD")
              }}
            >
              Re-upload
            </button>
          )}
          {props.item.status === "SHIPMENT_CREATED" && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-400 transition-colors duration-200 disabled:bg-green-300 rounded-md text-white font-medium"
              onClick={() => {
                setVisibleModal("VIEW_SHIPMENT")
              }}
            >
              View Shipment
            </button>
          )}
          <a
            href={props.item.downloadUrl}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          >
            Download
          </a>
        </div>
        {props.item.shipmentId !== null && (
          <ViewDetailsModal
            shipmentId={props.item.shipmentId}
            isOpen={visibleModal === "VIEW_SHIPMENT"}
            close={() => {
              setVisibleModal(null)
            }}
          />
        )}
        <ReuploadManifestModal
          id={props.item.id}
          isOpen={visibleModal === "REUPLOAD"}
          onClose={() => {
            setVisibleModal(null)
          }}
        />
      </div>
    </>
  )
}

function ListView(props: {
  uploadedManifests: UploadedManifest[]
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="px-4 py-3">
      {props.uploadedManifests.length === 0 ? (
        <div className="text-center">
          <p>No manifests have been uploaded.</p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
            onClick={() => setIsOpen(true)}
          >
            New Manifest
          </button>
          <UploadManifestModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between ">
            <div className="flex items-center font-semibold">
              List of manifests uploaded
            </div>
            <div>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
                onClick={() => setIsOpen(true)}
              >
                New Manifest
              </button>
              <UploadManifestModal
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false)
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-[repeat(3,_auto),_1fr] mt-3">
            <div className="grid grid-cols-subgrid col-span-4 border border-gray-300 bg-gray-100">
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                ID
              </div>
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                Upload Date
              </div>
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                Status
              </div>
              <div className="font-semibold px-3 py-2">Actions</div>
            </div>
            {props.uploadedManifests.map((manifest) => (
              <ListViewItem key={manifest.id} item={manifest} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function UploadedManifestsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { status, data, error } =
    api.uploadedManifest.getByCurrentUser.useQuery()

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_48rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Uploaded Manifests
          </Dialog.Title>
          {status === "loading" && <div>...</div>}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && (
            <ListView uploadedManifests={data} onClose={onClose} />
          )}
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
