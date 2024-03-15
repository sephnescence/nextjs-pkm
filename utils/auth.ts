import { auth } from '@clerk/nextjs'
import { prisma } from './db'
import { User } from '@prisma/client'

export const getClerkId = async (): Promise<string | null> => {
  const clerkUser = auth()
  const clerkUserId: string | null = clerkUser.userId

  return clerkUserId
}

export const getUserAuth = async (): Promise<User | null> => {
  const clerkUserId = await getClerkId()

  if (!clerkUserId) {
    return null
  }

  return await prisma.user.findUnique({
    where: {
      clerkId: clerkUserId,
    },
  })
}
