import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreateEpiphanyArgs = {
  content: string
  userId: string
}

export type UpdateEpiphanyArgs = CreateEpiphanyArgs & {
  historyItemId: string
  epiphanyItemId: string
}

// Get the current epiphany item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentEpiphanyItemForUser = async (
  epiphanyItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const epiphanyItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: epiphanyItemId,
    },
    select: {
      epiphany_item: {
        select: {
          content: true,
          model_id: true,
          history_id: true,
        },
      },
    },
  })

  if (!epiphanyItem || !epiphanyItem.epiphany_item) {
    return null
  }

  return epiphanyItem.epiphany_item
}

export const storeEpiphanyItem = async ({
  userId,
  content,
}: CreateEpiphanyArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmEpiphany',
        model_id: modelId,
        epiphany_item: {
          create: {
            content,
            model_id: modelId,
            user_id: userId,
          },
        },
      },
    })
    .then((epiphanyItem) => {
      return {
        success: true,
        epiphanyItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        epiphanyItem: null,
      }
    })
}

export const updateEpiphanyItem = async ({
  content,
  historyItemId,
  epiphanyItemId,
  userId,
}: UpdateEpiphanyArgs) => {
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
          model_type: 'PkmEpiphany',
          model_id: epiphanyItemId,
          epiphany_item: {
            create: {
              content,
              model_id: epiphanyItemId,
              user_id: userId,
            },
          },
        },
      }),
    ])
    .then((epiphanyItem) => {
      return {
        success: true,
        epiphanyItem: epiphanyItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        epiphanyItem: null,
      }
    })
}
