import { AddAssignedAreaModal } from "./add-assigned-area-modal"
import { AreaCodeDisplayName } from "@/components/area-code-display-name"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { useState } from "react"

export function AssignedAreasFormSection(props: {
  assignedAreaCodes: string[]
  onAddAreaCode: (newAreaCode: string) => void
  onRemoveAreaCode: (newAreaCode: string) => void
}) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <div className="col-span-2">
      <p className="font-medium">Assigned Areas</p>
      {props.assignedAreaCodes.length === 0 ? (
        <p className="text-sm text-red-500">
          At least one assigned area is required.
        </p>
      ) : (
        <div className="mt-1 flex flex-wrap gap-y-2 gap-x-1">
          {props.assignedAreaCodes.map((areaCode) => (
            <div
              key={areaCode}
              className="inline-flex px-2 py-1 bg-pink-500 text-white rounded-full font-medium text-sm"
            >
              <AreaCodeDisplayName areaCode={areaCode} />
              <button
                type="button"
                onClick={() => {
                  props.onRemoveAreaCode(areaCode)
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <button
          type="button"
          className="px-4 py-2 bg-rose-500 disabled:bg-rose-300 hover:bg-rose-400 rounded-md font-medium transition-colors duration-200 text-white"
          onClick={() => {
            setIsModalVisible(true)
          }}
        >
          Add Area
        </button>
        <AddAssignedAreaModal
          isOpen={isModalVisible}
          onAddAreaCode={props.onAddAreaCode}
          onClose={() => {
            setIsModalVisible(false)
          }}
        />
      </div>
    </div>
  )
}
