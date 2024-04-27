import {
  Body,
  Html,
  Container,
  Tailwind,
  Text,
  Heading,
  Img,
  Section,
  Link,
  Hr,
} from "@react-email/components"

type ManifestedPackage = {
  id: string
  preassignedId: string
}

type UnmanifestedPackage = {
  id: string
  preassignedId: string
  senderFullName: string
  senderContactNumber: string
  senderEmailAddress: string
  senderStreetAddress: string
  senderCity: string
  senderStateOrProvince: string
  senderCountryCode: string
  senderPostalCode: number
  receiverFullName: string
  receiverContactNumber: string
  receiverEmailAddress: string
  receiverStreetAddress: string
  receiverCity: string
  receiverBarangay: string
  receiverStateOrProvince: string
  receiverCountryCode: string
  receiverPostalCode: number
}

export function IncomingShipmentReportEmail(props: {
  agentName: string
  warehouseName: string
  manifestedPackages: ManifestedPackage[]
  unmanifestedPackages: UnmanifestedPackage[]
}) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white my-12 ">
          <Container className=" flex flex-col px-16 rounded-lg shadow-2xl font-sans">
            <Img
              className="mx-auto mt-12 mb-2"
              src="https://i.pinimg.com/originals/1e/94/82/1e948264dffc366a735a49c0de6cb56c.jpg"
              width={50}
              height={50}
            />
            <Section>
              <Heading className="m-0">Hello!</Heading>
              <Text className="text-sm font-medium text-gray-700">
                Hi, {props.agentName}. Your shipment was received at one of the
                warehouses of RRG Freight Services ({props.warehouseName}). Here
                are the total packages we received.
              </Text>
              {props.manifestedPackages.map(({ id, preassignedId }) => (
                <Text key={id} className="text-sm font-medium text-gray-700">
                  {preassignedId}
                </Text>
              ))}
              {props.unmanifestedPackages.length > 0 && (
                <>
                  <Text className="text-sm font-medium text-gray-700">
                    We also received a set of unmanifested packages. The
                    following are the details of these packages:
                  </Text>
                  {props.unmanifestedPackages.map((unmanifestedPackage) => (
                    <Section key={unmanifestedPackage.id} className="mt-3">
                      <Hr />
                      <Text className="text-sm font-medium text-gray-700">
                        Tracking Number: {unmanifestedPackage.preassignedId}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Sender: {unmanifestedPackage.senderFullName}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Contact No.: {unmanifestedPackage.senderContactNumber}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Email Address: {unmanifestedPackage.senderEmailAddress}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Full Address: {unmanifestedPackage.senderStreetAddress},{" "}
                        {unmanifestedPackage.senderCity},{" "}
                        {unmanifestedPackage.senderStateOrProvince},
                        {unmanifestedPackage.senderCountryCode}{" "}
                        {unmanifestedPackage.senderPostalCode}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Receiver: {unmanifestedPackage.receiverFullName}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Contact No.: {unmanifestedPackage.receiverContactNumber}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Email Address:{" "}
                        {unmanifestedPackage.receiverEmailAddress}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700">
                        Full Address:{" "}
                        {unmanifestedPackage.receiverStreetAddress},{" "}
                        {unmanifestedPackage.receiverBarangay},{" "}
                        {unmanifestedPackage.receiverCity},{" "}
                        {unmanifestedPackage.receiverStateOrProvince},
                        {unmanifestedPackage.receiverCountryCode}{" "}
                        {unmanifestedPackage.receiverPostalCode}
                      </Text>
                    </Section>
                  ))}
                </>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default IncomingShipmentReportEmail
