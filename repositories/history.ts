import { prisma } from '@/utils/db'

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
          },
        },
        inbox_item: {
          select: {
            content: true,
          },
        },
        passing_thought_item: {
          select: {
            content: true,
          },
        },
        todo_item: {
          select: {
            content: true,
          },
        },
        trash_item: {
          select: {
            content: true,
          },
        },
        void_item: {
          select: {
            content: true,
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