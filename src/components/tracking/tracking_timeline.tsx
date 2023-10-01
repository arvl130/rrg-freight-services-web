import React from "react"
import { Truck } from "@phosphor-icons/react/Truck"
import { Path } from "@phosphor-icons/react/Path"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { Package } from "@phosphor-icons/react/Package"

const TimelineItem = ({
  icon,
  date,
  title,
  description,
}: {
  icon: React.ReactNode
  date: string
  title: string
  description: string
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full outline black flex items-center justify-center p-2">
        {icon}
      </div>
      <div className="ml-4">
        <div className="text-gray-600">{date}</div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-lg">{description}</div>
      </div>
    </div>
  )
}

const VerticalTimeline = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto p-10">
        <div className="border-r-2 border-blue-500 mx-5 h-full"></div>
        <div className="flex flex-col space-y-4">
          <TimelineItem
            icon={<Package size={44} color="#1d798b" />}
            date="July 31, 14:27"
            title="Delivered"
            description="Package has been delivered."
          />
          <TimelineItem
            icon={<Truck size={44} color="#1d798b" />}
            date="July 31, 08:47"
            title="Out for Delivery"
            description="RRG Freight Services will attempt parcel delivery within the day. Keep your lines open and prepare exact payment for COD transaction."
          />
          <TimelineItem
            icon={<Path size={44} color="#1d798b" />}
            date="July 29, 10:02"
            title="Departed from Sort Center"
            description="Your package has departed the sortation center. [MANILA]"
          />
          <TimelineItem
            icon={<MapPin size={44} color="#1d798b" />}
            date="July 29, 08:30"
            title="Arrived from Sort Center"
            description="Your package has arrived at the sortation center and is being prepared for shipment [MANILA]"
          />
        </div>
      </div>
    </div>
  )
}

export default VerticalTimeline
