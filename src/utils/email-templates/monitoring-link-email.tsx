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
} from "@react-email/components"

export function MonitoringLinkEmail(props: {
  packageId: string
  accessKey: string
}) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white my-12 ">
          <Container className=" flex flex-col px-16 rounded-lg shadow-2xl max-w-prose font-sans">
            <Img
              className="mx-auto mt-12 mb-2"
              src="https://i.pinimg.com/originals/1e/94/82/1e948264dffc366a735a49c0de6cb56c.jpg"
              width={50}
              height={50}
            />
            <Section>
              <Heading className="m-0">Hello!</Heading>
              <Text className="text-sm font-medium text-gray-700">
                A monitoring link has been requested for your package with
                tracking number {props.packageId}.
              </Text>
              <Text className="text-sm font-medium text-gray-700">
                This link lets you monitor the location history of your package
                as it gets shipped by RRG Freight Services.
              </Text>
              <Text className="text-sm font-medium text-gray-700">
                To use the link, simply click the button below.
              </Text>

              <Link
                href={`https://www.rrgfreight.services/tracking/${props.packageId}/location?accessKey=${props.accessKey}`}
                className="bg-[#78CFDC] rounded-lg my-8 py-2 px-2 font-bold text-white mt-10 h-[25px] w-[130px] border-0 hover:bg-sky-700"
              >
                View Location History
              </Link>
            </Section>
            <Section className="mt-12">
              <Text className="text-sm font-medium text-gray-700">
                Alternatively, you may copy and paste this link manually to the
                address bar of your web browser.
              </Text>
              <Link
                href={`https://www.rrgfreight.services/tracking/${props.packageId}/location?accessKey=${props.accessKey}`}
              >
                {`https://www.rrgfreight.services/tracking/${props.packageId}/location?accessKey=${props.accessKey}`}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default MonitoringLinkEmail
