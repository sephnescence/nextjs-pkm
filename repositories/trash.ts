import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreateTrashArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

type GetTrashArgs = {
  historyItemId: string
  trashItemId: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

export type UpdateTrashArgs = CreateTrashArgs & {
  historyItemId: string
  trashItemId: string
}

// Get the current trash item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTrashItemForUser = async ({
  suiteId,
  storeyId,
  spaceId,
  trashItemId,
  historyItemId,
  userId,
}: GetTrashArgs) => {
  const trashItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: trashItemId,
      suite_id: suiteId,
      storey_id: storeyId,
      space_id: spaceId,
    },
    select: {
      trash_item: {
        select: {
          content: true,
          name: true,
          summary: true,
          model_id: true,
          history_id: true,
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

  if (!trashItem || !trashItem.trash_item) {
    return null
  }

  return trashItem
}

export const storeTrashItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
  storeyId,
  spaceId,
}: CreateTrashArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmTrash',
        model_id: modelId,
        suite_id: suiteId,
        storey_id: storeyId,
        space_id: spaceId,
        trash_item: {
          create: {
            content,
            name,
            summary,
            model_id: modelId,
            user_id: userId,
          },
        },
      },
    })
    .then((trashItem) => {
      return {
        success: true,
        trashItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        trashItem: null,
      }
    })
}

export const updateTrashItem = async ({
  content,
  name,
  summary,
  historyItemId,
  trashItemId,
  userId,
  suiteId,
  storeyId,
  spaceId,
}: UpdateTrashArgs) => {
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
          model_type: 'PkmTrash',
          model_id: trashItemId,
          suite_id: suiteId,
          storey_id: storeyId,
          space_id: spaceId,
          trash_item: {
            create: {
              content,
              name,
              summary,
              model_id: trashItemId,
              user_id: userId,
            },
          },
        },
      }),
    ])
    .then((trashItem) => {
      return {
        success: true,
        trashItem: trashItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        trashItem: null,
      }
    })
}
