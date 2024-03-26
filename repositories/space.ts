import { prisma } from '@/utils/db'

type CreateSpaceArgs = {
  userId: string
  storeyId: string
  name: string
  description: string
  content: string
}

export type UpdateSpaceArgs = CreateSpaceArgs & {
  storeyId: string
  spaceId: string
}

export const getSpaceDashboardForUser = async (
  storeyId: string,
  spaceId: string,
  userId: string,
) => {
  const space = await prisma.space.findFirst({
    where: {
      user_id: userId,
      id: spaceId,
      storey_id: storeyId,
    },
    select: {
      name: true,
      description: true,
      id: true,
      content: true,
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
      pkm_history: {
        where: {
          storey_id: storeyId,
          space_id: spaceId,
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

  if (!space) {
    return null
  }

  return space
}

export const getSpacesForUser = async (userId: string, storeyId: string) => {
  return await prisma.space
    .findMany({
      where: {
        user_id: userId,
        storey_id: storeyId,
      },
      select: {
        name: true,
        description: true,
        content: true,
        id: true,
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
    })
    .then((spaces) => spaces)
    .catch(() => {
      console.log('Error?')
      return []
    })
}

export const getSpaceForUser = async (
  storeyId: string,
  spaceId: string,
  userId: string,
) => {
  const space = await prisma.space.findFirst({
    where: {
      user_id: userId,
      storey_id: storeyId,
      id: spaceId,
    },
    select: {
      name: true,
      description: true,
      content: true,
      id: true,
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
  })

  if (!space) {
    return null
  }

  return space
}

export const storeSpace = async ({
  userId,
  storeyId,
  name,
  description,
  content,
}: CreateSpaceArgs) => {
  return await prisma.space
    .create({
      data: {
        user_id: userId,
        storey_id: storeyId,
        name,
        description,
        content,
      },
    })
    .then((space) => {
      return {
        success: true,
        space,
      }
    })
    .catch(() => {
      return {
        success: false,
        space: null,
      }
    })
}

export const updateSpace = async ({
  name,
  description,
  content,
  userId,
  spaceId,
  storeyId,
}: UpdateSpaceArgs) => {
  return await prisma.space
    .update({
      where: {
        user_id: userId,
        storey_id: storeyId,
        id: spaceId,
      },
      data: {
        name,
        description,
        content,
      },
    })
    .then((space) => {
      return {
        success: true,
        space,
      }
    })
    .catch(() => {
      return {
        success: false,
      }
    })
}
