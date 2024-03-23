import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'

type CreateTrashArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId?: string
}

export type UpdateTrashArgs = CreateTrashArgs & {
  historyItemId: string
  trashItemId: string
}

// Get the current trash item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTrashItemForUser = async (
  suiteId: string,
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
      suite_id: suiteId,
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
    },
  })

  if (!trashItem || !trashItem.trash_item || !trashItem.suite) {
    return null
  }

  return trashItem
}

export const updateTrashItem = async ({
  content,
  name,
  summary,
  historyItemId,
  trashItemId,
  userId,
  suiteId,
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
      revalidatePath('/dashboard')
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
