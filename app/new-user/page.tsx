import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function NewUserIndex() {
  const clerkUser = await currentUser()

  if (!clerkUser || !clerkUser.id) {
    return redirect('/')
  }

  const clerkUserId: string | null = clerkUser.id

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUserId,
    },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.emailAddresses[0].emailAddress,
        suites: {
          create: {
            name: 'Foyer',
            description: 'Enjoy your stay at Innsight',
          },
        },
      },
    })
  }

  redirect('/foyer')
}
