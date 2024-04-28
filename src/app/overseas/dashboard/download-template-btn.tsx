"use client"
import React from "react"
import toast from "react-hot-toast"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
export function DownloadTemplateBtn() {
  const handleDownload = () => {
    const url = "/assets/excel/RRG-Template.xlsx"
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "RRG-Template.xlsx")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <button
      type="button"
      className="flex rounded-md items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
      onClick={() => {
        handleDownload()
        toast.success("Template Downloaded")
      }}
    >
      <DownloadSimple size={16} />
      <span>Download Template</span>
    </button>
  )
}
