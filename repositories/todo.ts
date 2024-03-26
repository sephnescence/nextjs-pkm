import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreateTodoArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

type GetTodoArgs = {
  historyItemId: string
  todoItemId: string
  userId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
}

export type UpdateTodoArgs = CreateTodoArgs & {
  historyItemId: string
  todoItemId: string
}

// Get the current todo item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTodoItemForUser = async ({
  suiteId,
  storeyId,
  spaceId,
  todoItemId,
  historyItemId,
  userId,
}: GetTodoArgs) => {
  const todoItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: todoItemId,
      suite_id: suiteId,
      storey_id: storeyId,
      space_id: spaceId,
    },
    select: {
      todo_item: {
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
      space: {
        select: {
          id: true,
          name: true,
          description: true,
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
      },
    },
  })

  if (!todoItem || !todoItem.todo_item) {
    return null
  }

  return todoItem
}

export const storeTodoItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
  storeyId,
  spaceId,
}: CreateTodoArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmTodo',
        model_id: modelId,
        suite_id: suiteId,
        storey_id: storeyId,
        space_id: spaceId,
        todo_item: {
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
    .then((todoItem) => {
      return {
        success: true,
        todoItem,
      }
    })
    .catch(() => {
      return {
        success: false,
        todoItem: null,
      }
    })
}

export const updateTodoItem = async ({
  content,
  name,
  summary,
  historyItemId,
  todoItemId,
  userId,
  suiteId,
  storeyId,
  spaceId,
}: UpdateTodoArgs) => {
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
          model_type: 'PkmTodo',
          model_id: todoItemId,
          suite_id: suiteId,
          storey_id: storeyId,
          space_id: spaceId,
          todo_item: {
            create: {
              content,
              name,
              summary,
              model_id: todoItemId,
              user_id: userId,
            },
          },
        },
      }),
    ])
    .then((todoItem) => {
      return {
        success: true,
        todoItem: todoItem[1],
      }
    })
    .catch(() => {
      return {
        success: false,
        todoItem: null,
      }
    })
}
