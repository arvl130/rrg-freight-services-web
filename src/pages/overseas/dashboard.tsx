import { OverseasLayout } from "@/layouts/overseas"
import { useSession } from "@/utils/auth"
import { ArrowClockwise } from "@phosphor-icons/react/ArrowClockwise"
import { Article } from "@phosphor-icons/react/Article"
import { CalendarBlank } from "@phosphor-icons/react/CalendarBlank"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { FunnelSimple } from "@phosphor-icons/react/FunnelSimple"
import { User } from "@phosphor-icons/react/User"
import { UsersThree } from "@phosphor-icons/react/UsersThree"
import { Package } from "@phosphor-icons/react/Package"
import { getAuth, signOut } from "firebase/auth"
 
 

function RecentActivityTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_6rem] text-gray-400 mb-1">
          <div>User</div>
          <div>Role</div>
          <div>Action</div>
        </div>
        {/* Body */}
        <div>
          <div className="grid grid-cols-[1fr_1fr_6rem]">
            <div className="grid grid-cols-[2rem_1fr] gap-2">
              <div className="bg-gray-200 flex justify-center items-center h-8 rounded-md">
                <User size={16} />
              </div>
              <div className="flex items-center">John Doe</div>
            </div>
            <div className="flex items-center text-gray-400">
              Warehouse Staff
            </div>
            <div className="flex justify-center items-center uppercase bg-yellow-600 text-white rounded-md">
              Updated
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
 

function ManifestSummaryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Manifest Summary</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-5 text-gray-400 mb-1">
          <div>ID</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Items</div>
        </div>
      </div>
    </article>
  )
}

function ManifestHistoryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Manifest History</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-5 text-gray-400 mb-1">
          <div>ID</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>CItems</div>
        </div>
      </div>
    </article>
  )
}

interface CalendarWidgetProps {
  year: number;
  month: string;
}

function CalendarWidgetTile({ year, month }: CalendarWidgetProps) {
  function generateCalendarContent() {
    const daysInMonth = 31;
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

    return days;
  }

  const calendarDays = generateCalendarContent();

  return (
    <div className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <h2 className="font-semibold flex items-center text-md  mb-2  ">{`${month} ${year}  `}<CaretRight size={16}  /></h2>
      <div className="grid grid-cols-7 gap-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div key={index} className="text-center">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationTile() {
  return (
    <div className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <h2 className="font-semibold mb-2">Notifications</h2>
      
    </div>
  )
}

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  if (isLoading || role !== "OVERSEAS_AGENT") return <>...</>

  return (
    <OverseasLayout title="Dashboard">
      <h1 className="text-3xl font-black [color:_#00203F] mb-8">Dashboard</h1>
     
      <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040] mb-6">
        <ManifestSummaryTile />
        <CalendarWidgetTile year={2023} month="October"/>
      </section>

      <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040]">
        <ManifestHistoryTile />
        <NotificationTile />
      </section>
    </OverseasLayout>
  )
}
