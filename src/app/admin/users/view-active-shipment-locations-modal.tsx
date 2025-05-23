import * as Dialog from "@radix-ui/react-dialog"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { ViewLocationWithHistorySection } from "@/components/shipments/view-location-with-history-section"

function ActiveShipment(props: { shipmentId: number }) {
  const { status, data, error } =
    api.shipment.location.getByShipmentId.useQuery(
      {
        shipmentId: props.shipmentId,
      },
      {
        refetchInterval: 5000,
      },
    )

  return (
    <>
      {status === "pending" && <div className="text-center">Loading ...</div>}
      {status === "error" && (
        <div className="text-center">
          An error occured while retrieving locations: {error.message}
        </div>
      )}
      {status === "success" && (
        <ViewLocationWithHistorySection locations={data} />
      )}
    </>
  )
}

export function ViewActiveShipmentLocationsModal({
  driverId,
  isOpen,
  onClose,
}: {
  driverId: string
  isOpen: boolean
  onClose: () => void
}) {
  const { status, data, error } =
    api.shipment.getActiveShipmentByDriverId.useQuery({
      driverId,
    })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={() => {
            onClose()
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_56rem)] h-[38.5rem] grid grid-rows-[auto_1fr] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center grid grid-cols-[1.5rem_1fr_1.5rem]">
            <div></div>
            <div>View Location History</div>
            <button
              type="button"
              className="flex items-center justify-center"
              onClick={() => {
                onClose()
              }}
            >
              <X size={20} />
            </button>
          </Dialog.Title>
          {status === "pending" && (
            <div className="text-center">Loading ...</div>
          )}
          {status === "error" && (
            <div className="text-center">
              An error occured while retrieving locations: {error.message}
            </div>
          )}
          {status === "success" && (
            <>
              {data === null ? (
                <div className="flex justify-center items-center">
                  <p>No active shipment for this driver.</p>
                </div>
              ) : (
                <ActiveShipment shipmentId={data.id} />
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
