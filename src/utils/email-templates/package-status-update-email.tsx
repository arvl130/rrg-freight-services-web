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

export function PackageStatusUpdateEmail(props: {
  body: string
  callToAction: {
    label: string
    href: string
  }
}) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white my-12 ">
          <Container className=" flex flex-col px-16 rounded-lg shadow-2xl h-[325px] w-[608px] font-sans">
            <Img
              className="mx-auto mt-12 mb-2"
              src="https://i.pinimg.com/originals/1e/94/82/1e948264dffc366a735a49c0de6cb56c.jpg"
              width={50}
              height={50}
            />
            <Section>
              <Heading className="m-0">Hello!</Heading>
              <Text className="text-sm font-medium text-gray-700">
                {props.body}
              </Text>
            </Section>
            <Section>
              <Link
                href={props.callToAction.href}
                className="bg-[#78CFDC] rounded-lg my-8 py-2 px-2 font-bold text-white mt-10 h-[25px] w-[130px] border-0 hover:bg-sky-700"
              >
                {props.callToAction.label}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default PackageStatusUpdateEmail
