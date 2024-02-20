"use server"
import { revalidatePath as revalidate } from "next/cache"

export async function revalidatePath(path: string) {
  revalidate(path)
}
