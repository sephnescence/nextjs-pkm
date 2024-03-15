import { prisma } from '@/utils/db'

type CreateTrashArgs = {
  content: string
  userId: string
}

export type UpdateTrashArgs = CreateTrashArgs & {
  historyItemId: string
  trashItemId: string
}

// Get the current trash item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTrashItemForUser = async (
  trashItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const trashItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: trashItemId,
    },
    select: {
      trash_item: {
        select: {
          content: true,
          model_id: true,
          history_id: true,
        },
      },
    },
  })

  if (!trashItem || !trashItem.trash_item) {
    return null
  }

  return trashItem.trash_item
}

export const updateTrashItem = async ({
  content,
  historyItemId,
  trashItemId,
  userId,
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
          trash_item: {
            create: {
              content,
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
