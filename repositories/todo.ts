import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'

type CreateTodoArgs = {
  content: string
  name: string
  summary: string
  userId: string
  suiteId?: string
}

export type UpdateTodoArgs = CreateTodoArgs & {
  historyItemId: string
  todoItemId: string
}

// Get the current todo item for the user
// Can add another method later if we ever need to grab the non-current one
export const getCurrentTodoItemForUser = async (
  suiteId: string,
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
      suite_id: suiteId,
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
    },
  })

  if (!todoItem || !todoItem.todo_item) {
    return null
  }

  return todoItem.todo_item
}

export const storeTodoItem = async ({
  userId,
  content,
  name,
  summary,
  suiteId,
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
      revalidatePath('/dashboard')
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
      revalidatePath('/dashboard')
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
