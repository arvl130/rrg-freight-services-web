/* eslint-disable jsx-a11y/alt-text */
import type { Package } from "@/server/db/entities"
import QRCode from "qrcode"
import { Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    paddingTop: "10px",
    paddingLeft: "13px",
    paddingRight: "13px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerImage: { width: "65px", height: "65px" },
  headerTitle: {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubTitle: {
    fontSize: "8px",
  },
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
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: "10px 5px",
    display: "flex",
    flexDirection: "column",
  },
  tableCell: {
    fontSize: "9px",
    display: "flex",
    flexDirection: "column",
  },
})

function QRCodeImage(props: { url: string }) {
  const urlPromise = QRCode.toDataURL(props.url)
  return <Image style={styles.headerImage} src={urlPromise} />
}

export function WaybillPdfPage({ package: _package }: { package: Package }) {
  return (
    <Page size="A6" style={styles.page}>
      {/*Header*/}
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          src={"/assets/img/logos/logo-white-bg.png"}
        ></Image>
        <View style={styles.headerTitle}>
          <Text style={{ fontWeight: "bold" }}>RRG Freight Services</Text>
          <Text style={styles.headerSubTitle}>
            North Fairview, Quezon City,
          </Text>
          <Text style={styles.headerSubTitle}>Republic of the Philippines</Text>
        </View>

        {QRCodeImage({ url: _package.id })}
      </View>

      {/*Table*/}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
              }}
            >
              <Text>Ship To</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "80%" }}>
            <View style={styles.tableCell}>
              <Text>{_package.receiverFullName}</Text>
              <Text>
                {_package.receiverStreetAddress}, Brgy.{" "}
                {_package.receiverBarangay}, {_package.receiverCity},{" "}
                {_package.receiverStateOrProvince},{" "}
                {_package.receiverCountryCode} {_package.receiverPostalCode}{" "}
              </Text>
              <Text>Phone: {_package.receiverContactNumber}</Text>
              <Text>Email: {_package.receiverEmailAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Text>Shipped From</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "80%" }}>
            <View style={styles.tableCell}>
              <Text>{_package.senderFullName}</Text>
              <Text>
                {_package.senderStreetAddress}, {_package.senderCity}{" "}
                {_package.senderStateOrProvince}, {_package.senderCountryCode}{" "}
                {_package.senderPostalCode}
              </Text>
              <Text>Phone: {_package.senderContactNumber}</Text>
              <Text>Email: {_package.senderEmailAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Text>Package Info</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "55%" }}>
            <View
              style={{
                ...styles.tableCell,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text>Delivery Type</Text>
              <Text>
                {_package.shippingMode} - {_package.shippingType.toLowerCase()}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "25%" }}>
            <View
              style={{
                ...styles.tableCell,
                margin: "auto",
              }}
            >
              <Text>
                {_package.receptionMode === "FOR_PICKUP"
                  ? "For Pickup"
                  : "Door to Door"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Text>Tracking Number</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "80%" }}>
            <View style={styles.tableCell}>
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                {_package.id} (from RRG)
              </Text>
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                {_package.preassignedId} (from agent)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
              }}
            >
              <Text>Fragile?</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "80%" }}>
            <View
              style={{
                ...styles.tableCell,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Text>{_package.isFragile === 1 ? "Yes" : "No"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
              }}
            >
              <Text>Weight</Text>
            </View>
          </View>
          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                margin: "auto",
              }}
            >
              <Text>{_package.weightInKg} Kg</Text>
            </View>
          </View>

          <View style={{ ...styles.tableCol, width: "20%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Text>Receiver Signature</Text>
            </View>
          </View>

          <View style={{ ...styles.tableCol, width: "40%" }}>
            <View
              style={{
                ...styles.tableCell,
                fontSize: "10px",
                margin: "auto",
                textAlign: "center",
              }}
            ></View>
          </View>
        </View>
      </View>
    </Page>
  )
}
