import { PersonCarryingPackageVector } from "@/components/vector/person-carrying-package"
import { Path } from "@phosphor-icons/react/dist/ssr/Path"
import Link from "next/link"

export function TrackSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 sm:grid grid-cols-[minmax(0,_1fr)_minmax(0,_3fr)] gap-12">
      {/* Track Section */}
      <div className="hidden sm:flex justify-end">
        <div className="h-96 w-fit">
          <PersonCarryingPackageVector />
        </div>
      </div>
      <div className="flex flex-col justify-center font-bold text-center text-3xl sm:text-left">
        <p className="max-w-md leading-relaxed">
          Track now your package and ensure your cargo arrives safely and on
          schedule!
        </p>

        <div>
          <Link
            href="/tracking"
            className="drop-shadow-lg inline-flex items-center gap-1 bg-red-500 hover:bg-red-400 transition-colors text-white px-6 py-3.5 text-base rounded-full font-bold font-family my-5"
          >
            <span>Track Now</span>
            <Path className="ml-1" size={22} color="#FFFFFF" weight="thin" />
          </Link>
        </div>
      </div>
    </section>
  )
}
