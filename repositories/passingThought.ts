import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreatePassingThoughtArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

type GetPassingThoughtArgs = {
  historyItemId: string
  passingThoughtItemId: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

export type UpdatePassingThoughtArgs = CreatePassingThoughtArgs & {
  historyItemId: string
  passingThoughtItemId: string
}

// Get the current passing thought item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentPassingThoughtItemForUser = async ({
  suiteId,
  storeyId,
  spaceId,
  passingThoughtItemId,
  historyItemId,
  userId,
}: GetPassingThoughtArgs) => {
  const passingThoughtItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: passingThoughtItemId,
      suite_id: suiteId,
      storey_id: storeyId,
      space_id: spaceId,
    },
    select: {
      passing_thought_item: {
        select: {
          content: true,
          name: true,
          summary: true,
          model_id: true,
          history_id: true,
          void_at: true,
        },
      },
      suite: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      storey: {
        select: {
          id: true,
          name: true,
          description: true,
          suite: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      space: {
        select: {
          id: true,
          name: true,
          description: true,
          storey: {
            select: {
              id: true,
              name: true,
              description: true,
              suite: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!passingThoughtItem || !passingThoughtItem.passing_thought_item) {
    return null
  }

  return passingThoughtItem
}

export const storePassingThoughtItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
  storeyId,
  spaceId,
}: CreatePassingThoughtArgs) => {
  const modelId = randomUUID()

  const now = new Date()
  const voidAt = new Date(now.setMonth(now.getMonth() + 1))

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmPassingThought',
        model_id: modelId,
        suite_id: suiteId,
        storey_id: storeyId,
        space_id: spaceId,
        passing_thought_item: {
          create: {
            content,
            name,
            summary,
            model_id: modelId,
            user_id: userId,
            void_at: voidAt,
          },
        },
      },
    })
    .then((passingThoughtItem) => {
      return {
        success: true,
        passingThoughtItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        passingThoughtItem: null,
      }
    })
}

export const updatePassingThoughtItem = async ({
  content,
  name,
  summary,
  historyItemId,
  passingThoughtItemId,
  userId,
  suiteId,
  storeyId,
  spaceId,
}: UpdatePassingThoughtArgs) => {
  const now = new Date()
  const voidAt = new Date(now.setMonth(now.getMonth() + 1))

  return await prisma
    .$transaction([
      prisma.pkmHistory.update({
        where: {
          history_id: historyItemId,
          is_current: true,
        },
        data: {
          is_current: false,
        },
      }),
      prisma.pkmHistory.create({
        data: {
          user_id: userId,
          is_current: true,
          model_type: 'PkmPassingThought',
          model_id: passingThoughtItemId,
          suite_id: suiteId,
          storey_id: storeyId,
          space_id: spaceId,
          passing_thought_item: {
            create: {
              content,
              name,
              summary,
              model_id: passingThoughtItemId,
              user_id: userId,
              void_at: voidAt,
            },
          },
        },
      }),
    ])
    .then((passingThoughtItem) => {
      return {
        success: true,
        passingThoughtItem: passingThoughtItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        passingThoughtItem: null,
      }
    })
}
