import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreatePassingThoughtArgs = {
  content: string
  userId: string
}

export type UpdatePassingThoughtArgs = CreatePassingThoughtArgs & {
  historyItemId: string
  passingThoughtItemId: string
}

// Get the current passingThought item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentPassingThoughtItemForUser = async (
  passingThoughtItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const passingThoughtItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: passingThoughtItemId,
    },
    select: {
      passing_thought_item: {
        select: {
          content: true,
          model_id: true,
          history_id: true,
        },
      },
    },
  })

  if (!passingThoughtItem || !passingThoughtItem.passing_thought_item) {
    return null
  }

  return passingThoughtItem.passing_thought_item
}

export const storePassingThoughtItem = async ({
  userId,
  content,
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
        passing_thought_item: {
          create: {
            content,
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
  historyItemId,
  passingThoughtItemId,
  userId,
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
          passing_thought_item: {
            create: {
              content,
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
