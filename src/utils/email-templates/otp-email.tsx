import {
  Body,
  Html,
  Container,
  Tailwind,
  Text,
  Heading,
  Img,
  Section,
} from "@react-email/components"

export function OtpEmail(props: { otp: string }) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white my-12 mx-auto">
          <Container className=" flex flex-col pt-4 px-5 rounded-lg shadow-lg h-[600px] w-[450px] text-center font-sans">
            <Img
              className="mx-auto mt-8"
              src="https://i.pinimg.com/originals/1e/94/82/1e948264dffc366a735a49c0de6cb56c.jpg"
              width={100}
              height={100}
            />
            <Heading className="mt-0">Delivery Verification</Heading>
            <Text className="text-sm font-medium text-gray-700">
              Thank you for trusting RRG Freight Services! Please use this
              unique code to verify that the package is being received by its
              rightful receiver.
            </Text>
            <Section className="[background-color:_#78CFDC] rounded-lg my-8 py-2 font-bold text-white w-[200px] mx-auto">
              <Text className="text-2xl">{props.otp}</Text> {/* OTP NUMBER */}
            </Section>
            <Text className="text-sm font-medium text-gray-700">
              You must give this code to the courier that will deliver it to
              you.
            </Text>
            <Text className="text-slate-400 text-sm mt-8">
              If this email is not intended to you, please ignore and delete it.
              Thank you for Understanding.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default OtpEmail
