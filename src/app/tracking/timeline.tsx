import type { PackageStatusLog } from "@/server/db/entities"
import { DropboxLogo } from "@phosphor-icons/react/dist/ssr/DropboxLogo"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Moped } from "@phosphor-icons/react/dist/ssr/Moped"
import { DateTime } from "luxon"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Warehouse } from "@phosphor-icons/react/dist/ssr/Warehouse"
import { useState } from "react"
import Image from "next/image"

function SurveyModal({ onClose }) {
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)

  const handleReviewChange = (event) => {
    setReview(event.target.value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleSubmit = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-lg overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative w-full max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-center bg-[#78CFDC] p-5 border-b border-solid border-blueGray-200 rounded-t">
            <div className="flex justify-center mb-2">
              <Image
                src="/assets/img/logos/new-logo-nav-bar.png"
                alt="RRG Freight Services logo with its name on the right"
                className="w-[180px] h-[60px] object-contain"
                width={168}
                height={60}
              />
            </div>
            <h2 className="font-bold mt-4 ml-10 text-lg text-white text-center">
              Customer Survey{" "}
            </h2>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-white h-10 w-10  text-3xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>

          <div className="relative p-6 flex-auto">
            <div className="mb-2">
              <label className="block text-lg font-semibold mb-2">
                Services Rate
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`mr-2 p-2 text-3xl focus:outline-none ${
                      value <= rating ? "text-[#78CFDC]" : "text-gray-300"
                    }`}
                    onClick={() => handleRatingChange(value)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-lg font-semibold mb-2">
              Write a Review (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={review}
              onChange={handleReviewChange}
            ></textarea>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
            <button
              className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-4 ease-linear transition-all duration-150"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({
  packageStatusLog,
}: {
  packageStatusLog: PackageStatusLog
}) {
  const [showSurveyModal, setShowSurveyModal] = useState(false)
  const isDelivered = packageStatusLog.status === "DELIVERED"

  const handleTakeSurvey = () => {
    setShowSurveyModal(true)
  }

  const handleCloseSurveyModal = () => {
    setShowSurveyModal(false)
  }
  return (
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full outline black flex items-center justify-center p-2">
        {packageStatusLog.status === "DELIVERED" && (
          <DropboxLogo size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "OUT_FOR_DELIVERY" && (
          <Moped size={44} color="#1d798b" />
        )}
        {(packageStatusLog.status === "PREPARING_FOR_DELIVERY" ||
          packageStatusLog.status === "PREPARING_FOR_TRANSFER") && (
          <MagnifyingGlass size={44} color="#1d798b" />
        )}
        {(packageStatusLog.status === "INCOMING" ||
          packageStatusLog.status === "TRANSFERRING_FORWARDER" ||
          packageStatusLog.status === "TRANSFERRING_WAREHOUSE") && (
          <Truck size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "TRANSFERRED_FORWARDER" && (
          <Warehouse size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "IN_WAREHOUSE" && (
          <Package size={44} color="#1d798b" />
        )}
      </div>
      <div className="ml-4">
        <div className="text-gray-600">
          {DateTime.fromISO(packageStatusLog.createdAt).toLocaleString(
            DateTime.DATETIME_FULL,
          )}
        </div>
        <div className="text-lg font-semibold">
          {packageStatusLog.status.replaceAll("_", " ")}
          {isDelivered && (
            <button
              className="ml-2 bg-[#ED5959] hover:bg-red-700 text-white font-bold px-4 text-lg rounded-lg"
              onClick={handleTakeSurvey}
            >
              Take Survey
            </button>
          )}
        </div>
        <div className="text-lg">{packageStatusLog.description}</div>
        {showSurveyModal && <SurveyModal onClose={handleCloseSurveyModal} />}
      </div>
    </div>
  )
}

export function VerticalTimeline({
  packageStatusLogs,
}: {
  packageStatusLogs: PackageStatusLog[]
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-4 px-12 py-6">
      {packageStatusLogs.map((packageStatusLog) => (
        <TimelineItem
          key={packageStatusLog.id}
          packageStatusLog={packageStatusLog}
        />
      ))}
    </div>
  )
}
