import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'

type CreateInboxArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId?: string
}

export type UpdateInboxArgs = CreateInboxArgs & {
  historyItemId: string
  inboxItemId: string
}

// Get the current inbox item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentInboxItemForUser = async (
  suiteId: string,
  inboxItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const inboxItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: inboxItemId,
      suite_id: suiteId,
    },
    select: {
      inbox_item: {
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

  if (!inboxItem || !inboxItem.inbox_item || !inboxItem.suite) {
    return null
  }

  return inboxItem
}

export const storeInboxItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
}: CreateInboxArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmInbox',
        model_id: modelId,
        suite_id: suiteId,
        inbox_item: {
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
    .then((inboxItem) => {
      return {
        success: true,
        inboxItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        inboxItem: null,
      }
    })
}

export const updateInboxItem = async ({
  content,
  name,
  summary,
  historyItemId,
  inboxItemId,
  userId,
  suiteId,
}: UpdateInboxArgs) => {
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
          model_type: 'PkmInbox',
          model_id: inboxItemId,
          suite_id: suiteId,
          inbox_item: {
            create: {
              content,
              name,
              summary,
              model_id: inboxItemId,
              user_id: userId,
            },
          },
        },
      }),
    ])
    .then((inboxItem) => {
      return {
        success: true,
        inboxItem: inboxItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        inboxItem: null,
      }
    })
}
