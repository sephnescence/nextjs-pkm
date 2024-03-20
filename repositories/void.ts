import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'

type CreateVoidArgs = {
  content: string
  name: string
  summary: string
  userId: string
}

export type UpdateVoidArgs = CreateVoidArgs & {
  historyItemId: string
  voidItemId: string
}

// Get the current void item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentVoidItemForUser = async (
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
    },
  })

  if (!voidItem || !voidItem.void_item) {
    return null
  }

  return voidItem.void_item
}

export const storeVoidItem = async ({
  userId,
  content,
  name,
  summary,
}: CreateVoidArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmVoid',
        model_id: modelId,
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
      revalidatePath('/dashboard')
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
      revalidatePath('/dashboard')
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
