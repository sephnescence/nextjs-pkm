import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'

type CreateVoidArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId?: string
}

export type UpdateVoidArgs = CreateVoidArgs & {
  historyItemId: string
  voidItemId: string
}

// Get the current void item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentVoidItemForUser = async (
  suiteId: string,
  voidItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const voidItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: voidItemId,
      suite_id: suiteId,
    },
    select: {
      void_item: {
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

  if (!voidItem || !voidItem.void_item || !voidItem.suite) {
    return null
  }

  return voidItem
}

export const storeVoidItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
}: CreateVoidArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmVoid',
        model_id: modelId,
        suite_id: suiteId,
        void_item: {
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
    .then((voidItem) => {
      return {
        success: true,
        voidItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        voidItem: null,
      }
    })
}

export const updateVoidItem = async ({
  content,
  name,
  summary,
  historyItemId,
  voidItemId,
  userId,
  suiteId,
}: UpdateVoidArgs) => {
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
          model_type: 'PkmVoid',
          model_id: voidItemId,
          suite_id: suiteId,
          void_item: {
            create: {
              content,
              name,
              summary,
              model_id: voidItemId,
              user_id: userId,
            },
          },
        },
      }),
    ])
    .then((voidItem) => {
      return {
        success: true,
        voidItem: voidItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        voidItem: null,
      }
    })
}
