import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'
import { randomUUID } from 'node:crypto'

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

  if (existingUser) {
    handleExistingUser(existingUser)
    redirect('/reception')
  }

  if (!existingUser) {
    const userId = randomUUID()

    await prisma.user.create({
      data: {
        id: userId,
        clerkId: clerkUserId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.emailAddresses[0].emailAddress,
        suites: {
          create: {
            id: userId,
            name: 'Welcome Center',
            description: 'Enjoy your stay at Innsight',
            storeys: {
              create: {
                id: userId,
                user_id: userId,
                name: 'Foyer',
                description: 'Please head to reception',
                spaces: {
                  create: {
                    id: userId,
                    user_id: userId,
                    name: 'Reception',
                    description: 'Check in',
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  redirect('/reception')
}

const handleExistingUser = async (existingUser: User) => {
  await prisma.suite.upsert({
    where: {
      id: existingUser.id,
    },
    update: {},
    create: {
      id: existingUser.id,
      user_id: existingUser.id,
      name: 'Welcome Center',
      description: 'Enjoy your stay at Innsight',
      storeys: {
        create: {
          id: existingUser.id,
          user_id: existingUser.id,
          name: 'Foyer',
          description: 'Please head to reception',
          spaces: {
            create: {
              id: existingUser.id,
              user_id: existingUser.id,
              name: 'Reception',
              description: 'Check in',
            },
          },
        },
      },
    },
  })
}
