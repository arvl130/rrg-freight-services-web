import type { ZodError } from "zod"

export class HttpError extends Error {
  constructor(props: {
    message: string
    statusCode: number
    validationError?: ZodError
  }) {
    super(props.message)
    this.name = "HttpError"
    this.statusCode = props.statusCode
    this.validationError = props.validationError
  }

  statusCode: number
  validationError: ZodError | undefined
}
