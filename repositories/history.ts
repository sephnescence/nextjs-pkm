import { prisma } from '@/utils/db'

type GetHistoryItemArgs = {
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
  modelId: string
  historyId: string
  userId: string
}

export const getCurrentHistoryItemForUser = async ({
  suiteId,
  storeyId,
  spaceId,
  modelId,
  historyId,
  userId,
}: GetHistoryItemArgs) => {
  return await prisma.pkmHistory
    .findFirst({
      where: {
        user_id: userId,
        is_current: true,
        history_id: historyId,
        model_id: modelId,
        suite_id: suiteId,
        storey_id: storeyId,
        space_id: spaceId,
      },
      select: {
        model_type: true,
        suite: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        epiphany_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        inbox_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        passing_thought_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        todo_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        trash_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        void_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
      },
    })
    .then((historyItem) => {
      return {
        success: true,
        historyItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        historyItem: null,
      }
    })
}

export const getHistoryItem = async (
  modelId: string,
  historyId: string,
  userId: string,
) => {
  return await prisma.pkmHistory
    .findFirst({
      where: {
        user_id: userId,
        is_current: true,
        history_id: historyId,
        model_id: modelId,
      },
      select: {
        model_type: true,
        epiphany_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        inbox_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        passing_thought_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        todo_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        trash_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
        void_item: {
          select: {
            content: true,
            name: true,
            summary: true,
          },
        },
      },
    })
    .then((historyItem) => {
      return {
        success: true,
        historyItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        historyItem: null,
      }
    })
}
