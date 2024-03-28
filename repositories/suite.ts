import { prisma } from '@/utils/db'

type CreateSuiteArgs = {
  userId: string
  name: string
  description: string
  content: string
}

export type UpdateSuiteArgs = CreateSuiteArgs & {
  suiteId: string
}

export const getSuiteDashboardForUser = async (
  suiteId: string,
  userId: string,
) => {
  const suite = await prisma.suite.findFirst({
    where: {
      user_id: userId,
      id: suiteId,
    },
    select: {
      name: true,
      description: true,
      id: true,
      content: true,
      storeys: {
        select: {
          content: true,
          name: true,
          description: true,
          id: true,
        },
      },
      pkm_history: {
        where: {
          suite_id: suiteId,
          storey_id: null,
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

  if (!suite) {
    return null
  }

  return suite
}

export const getSuitesForUser = async (userId: string) => {
  return await prisma.suite
    .findMany({
      where: {
        user_id: userId,
      },
      select: {
        name: true,
        description: true,
        content: true,
        id: true,
      },
    })
    .then((suites) => suites)
    .catch(() => {
      console.log('Error?')
      return []
    })
}

export const getSuiteForUser = async (suiteId: string, userId: string) => {
  const suite = await prisma.suite.findFirst({
    where: {
      user_id: userId,
      id: suiteId,
    },
    select: {
      name: true,
      description: true,
      content: true,
      id: true,
    },
  })

  if (!suite) {
    return null
  }

  return suite
}

export const storeSuite = async ({
  userId,
  name,
  description,
  content,
}: CreateSuiteArgs) => {
  return await prisma.suite
    .create({
      data: {
        user_id: userId,
        name,
        description,
        content,
      },
    })
    .then((suite) => {
      return {
        success: true,
        suite,
      }
    })
    .catch(() => {
      return {
        success: false,
        suite: null,
      }
    })
}

export const updateSuite = async ({
  name,
  description,
  userId,
  suiteId,
  content,
}: UpdateSuiteArgs) => {
  return await prisma.suite
    .update({
      where: {
        user_id: userId,
        id: suiteId,
      },
      data: {
        name,
        description,
        content,
      },
    })
    .then((suite) => {
      return {
        success: true,
        suite,
      }
    })
    .catch(() => {
      return {
        success: false,
      }
    })
}
