/* eslint-disable jsx-a11y/alt-text */

import React, { useEffect, useState } from "react"
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"

import type {
  Package,
  Shipment,
  IncomingShipment,
  User,
  OverseasAgent,
  ShipmentPackage,
} from "@/server/db/entities"
import { DateTime } from "luxon"

type ShipmentResults = {
  shipments: Shipment
  incoming_shipments: IncomingShipment
  users: User
  overseas_agents: OverseasAgent
}[]

const PDFReportTemplate = (props: {
  packagesByDate: Package[]
  shipmentByDate: ShipmentResults
  startDate: string
  endDate: string
}) => {
  const [totalPackage, setTotalPackage] = useState<number>(0)

  useEffect(() => {
    const totalDeliveredPackages = props.packagesByDate?.forEach((_package) => {
      let count = 0

      if (_package.status === "DELIVERED") {
        count = count + 1
      }
      setTotalPackage(count)
    })
  }, [props.packagesByDate])

  return (
    <Document>
      <Page
        wrap={true}
        size="LEGAL"
        style={styles.page}
        orientation="landscape"
      >
        {" "}
        {/* Header */}
        <View style={styles.header}>
          {/* <Image
            style={styles.headerImage}
            src={"/assets/img/logos/logo-white-bg.png"}
          ></Image> */}
          <View style={styles.headerTitle}>
            <Text style={{ fontWeight: "extrabold", paddingBottom: "5px" }}>
              RRG Freight Services
            </Text>
            <Text style={styles.headerSubTitle}>
              North Fairview, Quezon City, Republic of the Philippines
            </Text>
            <Text style={styles.headerSubTitle}>
              (+02)84616027 / rrgfreight_imports@yahoo.com
            </Text>
          </View>
        </View>
        {/* Body */}
        <View style={styles.section}>
          <Text style={{ textAlign: "center", fontSize: "15px" }}>
            Admin Report
          </Text>
          <Text style={styles.headerSubTitle}>
            Date Range :{" "}
            {DateTime.fromISO(props.startDate).toLocaleString(
              DateTime.DATE_MED,
            )}{" "}
            To{" "}
            {DateTime.fromISO(props.endDate).toLocaleString(DateTime.DATE_MED)}
          </Text>
          <Text style={styles.headerSubTitle}>
            Total Pacakges : {props.packagesByDate?.length}
          </Text>
          <Text style={styles.headerSubTitle}>
            Total Delivered : {totalPackage}
          </Text>
          <Text style={styles.headerSubTitle}>
            Total Shipments : {props.shipmentByDate?.length}
          </Text>

          <View>
            {/*Table*/}
            <View style={styles.table}>
              <View style={{ ...styles.tableRow }}>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "100%",
                    backgroundColor: "#78cfdc",
                    color: "white",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      fontWeight: "extrabold",
                      margin: "auto",
                    }}
                  >
                    <Text>Packages</Text>
                  </View>
                </View>
              </View>
              <View style={{ ...styles.tableRow }}>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "14%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Package ID</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "6%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Weight(Kg)</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "7%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Volume (m³)</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Sender Name</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Receiver Name</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "20%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Receiver Address</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "12%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Receiver Contact No.</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "11%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>Status</Text>
                  </View>
                </View>
              </View>
              {props.packagesByDate?.map((_package) => (
                <View key={_package.id} style={{ ...styles.tableRow }}>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "14%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.id}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "6%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.weightInKg}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "7%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.volumeInCubicMeter}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "15%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.senderFullName}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "15%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.receiverFullName}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "20%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>
                        {_package.receiverStreetAddress}{" "}
                        {_package.receiverBarangay} {_package.receiverCity}{" "}
                        {_package.receiverCountryCode}{" "}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "12%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.receiverContactNumber}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.tableHeader,
                      width: "11%",
                    }}
                  >
                    <View
                      style={{
                        ...styles.tableCell,
                        fontSize: "10px",
                        margin: "auto",
                      }}
                    >
                      <Text>{_package.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text break={true}></Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={{ ...styles.tableRow }}>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "100%",
                  backgroundColor: "#78cfdc",
                  color: "white",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    fontWeight: "extrabold",
                    margin: "auto",
                  }}
                >
                  <Text>Shipments</Text>
                </View>
              </View>
            </View>
            <View style={{ ...styles.tableRow }}>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "15%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Shipment ID</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "12%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Agent Name</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "12%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Company name</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "16%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Agent Contact No.</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "15%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Receiving Warehouse</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "15%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Created At</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableHeader,
                  width: "15%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCell,
                    fontSize: "10px",
                    margin: "auto",
                  }}
                >
                  <Text>Status</Text>
                </View>
              </View>
            </View>

            {props.shipmentByDate?.map((_shipment) => (
              <View key={_shipment.shipments.id} style={{ ...styles.tableRow }}>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>{_shipment.shipments.id}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "12%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>{_shipment.users.displayName}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "12%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>{_shipment.overseas_agents.companyName}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "16%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>{_shipment.users.contactNumber}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>
                      {}
                      {_shipment.incoming_shipments.destinationWarehouseId !==
                        null ||
                      _shipment.incoming_shipments.destinationWarehouseId !==
                        undefined ? (
                        <>
                          {_shipment.incoming_shipments.destinationWarehouseId}
                        </>
                      ) : (
                        <>Not Yet Received</>
                      )}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>
                      {DateTime.fromISO(
                        _shipment.incoming_shipments.createdAt,
                      ).toLocaleString(DateTime.DATE_MED)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.tableHeader,
                    width: "15%",
                  }}
                >
                  <View
                    style={{
                      ...styles.tableCell,
                      fontSize: "10px",
                      margin: "auto",
                    }}
                  >
                    <Text>{_shipment.shipments.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}
const styles = StyleSheet.create({
  page: {
    paddingTop: "20px",
    paddingLeft: "13px",
    paddingRight: "13px",
    paddingBottom: "60px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerImage: { width: "65px", height: "65px" },
  headerTitle: {
    fontStyle: "Rokkitt",
    fontSize: "21px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    letterSpacing: "1px",
    padding: "5px",
    paddingBottom: "10px",
  },
  headerSubTitle: {
    fontSize: "10px",
    letterSpacing: "0px",
  },
  section: {},
  graphSection: {},
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: "10px",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,

    padding: "5px 5px",
    display: "flex",
    flexDirection: "column",
  },
  tableHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: "8px 5px",
    display: "flex",
    flexDirection: "column",
  },
  tableCell: {
    fontSize: "8px",
    display: "flex",
    flexDirection: "column",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
})

export default PDFReportTemplate
