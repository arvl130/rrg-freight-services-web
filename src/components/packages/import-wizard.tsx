import { useEffect, useRef, useState } from "react"
import { PackagesImportWizardSelectFile } from "./import-wizard/step1"
import { PackagesImportWizardSelectHeader } from "./import-wizard/step3"
import {
  MatchColumnsFormType,
  PackagesImportWizardSelectColumnNames,
} from "./import-wizard/step4"
import { PackagesImportWizardCreatePackages } from "./import-wizard/step5"
import { PackagesImportWizardSummary } from "./import-wizard/step6"
import { WorkBook } from "xlsx"
import { Package } from "@/server/db/entities"
import { PackagesImportWizardSelectSheetName } from "./import-wizard/step2"

type Selection =
  | {
      workBook: null
      sheetName: null
      headerRow: null
      columnNames: null
      createdPackages: null
    }
  | {
      workBook: WorkBook
      sheetName: null
      headerRow: null
      columnNames: null
      createdPackages: null
    }
  | {
      workBook: WorkBook
      sheetName: string
      headerRow: null
      columnNames: null
      createdPackages: null
    }
  | {
      workBook: WorkBook
      sheetName: string
      headerRow: number
      columnNames: null
      createdPackages: null
    }
  | {
      workBook: WorkBook
      sheetName: string
      headerRow: number
      columnNames: MatchColumnsFormType
      createdPackages: null
    }
  | {
      workBook: WorkBook
      sheetName: string
      headerRow: number
      columnNames: MatchColumnsFormType
      createdPackages: Package[]
    }

export function PackagesImportWizard({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const modalRef = useRef<null | HTMLDialogElement>(null)
  const [selectedItems, setSelectedItems] = useState<Selection>({
    workBook: null,
    sheetName: null,
    headerRow: null,
    columnNames: null,
    createdPackages: null,
  })

  useEffect(() => {
    if (isOpen) modalRef.current?.showModal()
    else {
      modalRef.current?.close()
      setSelectedItems({
        workBook: null,
        sheetName: null,
        headerRow: null,
        columnNames: null,
        createdPackages: null,
      })
    }
  }, [isOpen])

  return (
    <dialog
      ref={modalRef}
      onClose={close}
      onCancel={(e) => {
        e.preventDefault()
        if (selectedItems.createdPackages !== null) {
          e.currentTarget.close()
          return
        }

        if (
          confirm(
            "Are you sure you want to quit? All unsaved changes will be lost.",
          )
        )
          e.currentTarget.close()
      }}
      className={`
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh_-_6rem)]
        ${isOpen ? "grid" : ""}
      `}
    >
      <div className="h-full grid">
        {selectedItems.workBook === null ? (
          <PackagesImportWizardSelectFile
            isOpenModal={isOpen}
            setSelectedWorkBook={(wb) => {
              setSelectedItems((currSelectedItems) => ({
                ...currSelectedItems,
                workBook: wb,
              }))
            }}
          />
        ) : (
          <>
            {selectedItems.sheetName === null ? (
              <PackagesImportWizardSelectSheetName
                selectedWorkBook={selectedItems.workBook}
                setSelectedSheetName={(sheetName) => {
                  setSelectedItems({
                    workBook: selectedItems.workBook!,
                    sheetName,
                    headerRow: selectedItems.headerRow,
                    columnNames: selectedItems.columnNames,
                    createdPackages: selectedItems.createdPackages,
                  })
                }}
                goBack={() => {
                  setSelectedItems({
                    workBook: null,
                    sheetName: null,
                    headerRow: null,
                    columnNames: null,
                    createdPackages: null,
                  })
                }}
              />
            ) : (
              <>
                {selectedItems.headerRow === null ? (
                  <PackagesImportWizardSelectHeader
                    selectedWorkBook={selectedItems.workBook}
                    selectedSheetName={selectedItems.sheetName}
                    setSelectedHeaderRow={(headerRow) => {
                      setSelectedItems({
                        workBook: selectedItems.workBook,
                        sheetName: selectedItems.sheetName,
                        headerRow,
                        columnNames: selectedItems.columnNames,
                        createdPackages: selectedItems.createdPackages,
                      })
                    }}
                    goBack={() => {
                      setSelectedItems({
                        workBook: selectedItems.workBook,
                        sheetName: null,
                        headerRow: null,
                        columnNames: null,
                        createdPackages: null,
                      })
                    }}
                  />
                ) : (
                  <>
                    {selectedItems.columnNames === null ? (
                      <PackagesImportWizardSelectColumnNames
                        selectedWorkBook={selectedItems.workBook}
                        selectedSheetName={selectedItems.sheetName}
                        selectedHeaderRow={selectedItems.headerRow}
                        setColumnNames={(columnNames) => {
                          setSelectedItems({
                            workBook: selectedItems.workBook,
                            sheetName: selectedItems.sheetName,
                            headerRow: selectedItems.headerRow,
                            columnNames,
                            createdPackages: selectedItems.createdPackages,
                          })
                        }}
                        goBack={() => {
                          setSelectedItems({
                            workBook: selectedItems.workBook,
                            sheetName: selectedItems.sheetName,
                            headerRow: null,
                            columnNames: null,
                            createdPackages: null,
                          })
                        }}
                      />
                    ) : (
                      <>
                        {selectedItems.createdPackages === null ? (
                          <PackagesImportWizardCreatePackages
                            selectedWorkBook={selectedItems.workBook}
                            selectedSheetName={selectedItems.sheetName}
                            selectedHeaderRow={selectedItems.headerRow}
                            selectedColumnNames={selectedItems.columnNames}
                            setCreatedPackages={(createdPackages) => {
                              setSelectedItems({
                                workBook: selectedItems.workBook,
                                sheetName: selectedItems.sheetName,
                                headerRow: selectedItems.headerRow,
                                columnNames: selectedItems.columnNames,
                                createdPackages,
                              })
                            }}
                            goBack={() => {
                              setSelectedItems({
                                workBook: selectedItems.workBook,
                                sheetName: selectedItems.sheetName,
                                headerRow: selectedItems.headerRow,
                                columnNames: null,
                                createdPackages: null,
                              })
                            }}
                          />
                        ) : (
                          <PackagesImportWizardSummary
                            createdPackages={selectedItems.createdPackages}
                            close={close}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}