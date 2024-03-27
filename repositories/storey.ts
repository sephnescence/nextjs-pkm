import { prisma } from '@/utils/db'

type CreateStoreyArgs = {
  userId: string
  suiteId: string
  name: string
  description: string
}

export type UpdateStoreyArgs = CreateStoreyArgs & {
  storeyId: string
}

export const getStoreyDashboardForUser = async (
  suiteId: string,
  storeyId: string,
  userId: string,
) => {
  const storey = await prisma.storey.findFirst({
    where: {
      user_id: userId,
      suite_id: suiteId,
      id: storeyId,
    },
    select: {
      name: true,
      description: true,
      id: true,
      content: true,
      suite: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      spaces: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      pkm_history: {
        where: {
          suite_id: suiteId,
          storey_id: storeyId,
          space_id: null,
          is_current: true,
          model_type: {
            not: 'PkmTrash',
          },
        },
        select: {
          createdAt: true,
          history_id: true,
          model_id: true,
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
          void_item: {
            select: {
              content: true,
              name: true,
              summary: true,
            },
          },
        },
      },
    },
  })

  if (!storey) {
    return null
  }

  return storey
}

export const getStoreysForUser = async (userId: string, suiteId: string) => {
  return await prisma.storey
    .findMany({
      where: {
        user_id: userId,
        suite_id: suiteId,
      },
      select: {
        name: true,
        description: true,
        content: true,
        id: true,
        suite: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })
    .then((storeys) => storeys)
    .catch(() => {
      console.log('Error?')
      return []
    })
}

export const getStoreyForUser = async (
  suiteId: string,
  storeyId: string,
  userId: string,
) => {
  const storey = await prisma.storey.findFirst({
    where: {
      user_id: userId,
      suite_id: suiteId,
      id: storeyId,
    },
    select: {
      name: true,
      description: true,
      content: true,
      id: true,
      suite: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  })

  if (!storey) {
    return null
  }

  return storey
}

export const storeStorey = async ({
  userId,
  suiteId,
  name,
  description,
}: CreateStoreyArgs) => {
  return await prisma.storey
    .create({
      data: {
        user_id: userId,
        suite_id: suiteId,
        name,
        description,
      },
    })
    .then((storey) => {
      return {
        success: true,
        storey,
      }
    })
    .catch(() => {
      return {
        success: false,
        storey: null,
      }
    })
}

export const updateStorey = async ({
  name,
  description,
  userId,
  suiteId,
  storeyId,
}: UpdateStoreyArgs) => {
  return await prisma.storey
    .update({
      where: {
        user_id: userId,
        suite_id: suiteId,
        id: storeyId,
      },
      data: {
        name,
        description,
      },
    })
    .then((storey) => {
      return {
        success: true,
        storey,
      }
    })
    .catch(() => {
      return {
        success: false,
      }
    })
}
