import { prisma } from '@/utils/db'
import { randomUUID } from 'node:crypto'

type CreateTodoArgs = {
  content: string
  userId: string
}

export type UpdateTodoArgs = CreateTodoArgs & {
  historyItemId: string
  todoItemId: string
}

// Get the current todo item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTodoItemForUser = async (
  todoItemId: string,
  historyItemId: string,
  userId: string,
) => {
  const todoItem = await prisma.pkmHistory.findFirst({
    where: {
      user_id: userId,
      is_current: true,
      history_id: historyItemId,
      model_id: todoItemId,
    },
    select: {
      todo_item: {
        select: {
          content: true,
          model_id: true,
          history_id: true,
        },
      },
    },
  })

  if (!todoItem || !todoItem.todo_item) {
    return null
  }

  return todoItem.todo_item
}

export const storeTodoItem = async ({ userId, content }: CreateTodoArgs) => {
  const modelId = randomUUID()

  return await prisma.pkmHistory
    .create({
      data: {
        user_id: userId,
        is_current: true,
        model_type: 'PkmTodo',
        model_id: modelId,
        todo_item: {
          create: {
            content,
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
  historyItemId,
  todoItemId,
  userId,
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
          todo_item: {
            create: {
              content,
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