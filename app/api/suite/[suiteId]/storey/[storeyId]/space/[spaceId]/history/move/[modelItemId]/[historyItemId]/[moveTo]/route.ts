'use server'

import { updateEpiphanyItem } from '@/repositories/epiphany'
import { getCurrentHistoryItemForUser } from '@/repositories/history'
import { updateInboxItem } from '@/repositories/inbox'
import { updatePassingThoughtItem } from '@/repositories/passingThought'
import { updateTodoItem } from '@/repositories/todo'
import { updateTrashItem } from '@/repositories/trash'
import { updateVoidItem } from '@/repositories/void'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type HistoryMoveParams = {
  params: {
    suiteId: string | null
    storeyId: string | null
    spaceId: string | null
    historyItemId: string
    modelItemId: string
    moveTo: string
  }
}

type HistoryActionMoveParams = {
  modelId: string
  historyId: string
  suiteId: string | null
  storeyId: string | null
  spaceId: string | null
  moveTo: 'epiphany' | 'inbox' | 'passing-thought' | 'todo' | 'trash' | 'void'
}

export const POST = async (
  request: Request,
  {
    params: { suiteId, storeyId, spaceId, modelItemId, historyItemId, moveTo },
  }: HistoryMoveParams,
) => {
  if (moveTo === 'epiphany') {
    return await historyActionMoveToEpiphany(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  } else if (moveTo === 'inbox') {
    return await historyActionMoveToInbox(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  } else if (moveTo === 'passing-thought') {
    return await historyActionMoveToPassingThought(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  } else if (moveTo === 'todo') {
    return await historyActionMoveToTodo(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  } else if (moveTo === 'void') {
    return await historyActionMoveToVoid(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  } else if (moveTo === 'trash') {
    return await historyActionMoveToTrash(
      modelItemId,
      historyItemId,
      suiteId,
      storeyId,
      spaceId,
    )
  }

  return NextResponse.json({
    success: false,
    redirect: '/',
  })
}

const historyActionMoveToEpiphany = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'epiphany',
  })
const historyActionMoveToInbox = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'inbox',
  })
const historyActionMoveToPassingThought = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'passing-thought',
  })
const historyActionMoveToTodo = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'todo',
  })
const historyActionMoveToTrash = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'trash',
  })
const historyActionMoveToVoid = async (
  modelItemId: string,
  historyItemId: string,
  suiteId: string | null,
  storeyId: string | null,
  spaceId: string | null,
) =>
  await _historyActionMove({
    modelId: modelItemId,
    historyId: historyItemId,
    suiteId,
    storeyId,
    spaceId,
    moveTo: 'void',
  })

const _historyActionMove = async ({
  modelId,
  historyId,
  suiteId,
  storeyId,
  spaceId,
  moveTo,
}: HistoryActionMoveParams) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  try {
    const userId = user.id

    const historyItemResponse = await getCurrentHistoryItemForUser({
      suiteId,
      storeyId,
      spaceId,
      modelId,
      historyId,
      userId,
    })

    if (
      historyItemResponse.success === false ||
      !historyItemResponse.historyItem
    ) {
      return NextResponse.json({
        errors: {
          fieldErrors: {
            general: 'No history item found',
          },
        },
      })
    }

    const item =
      historyItemResponse.historyItem.inbox_item ||
      historyItemResponse.historyItem.epiphany_item ||
      historyItemResponse.historyItem.passing_thought_item ||
      historyItemResponse.historyItem.todo_item ||
      historyItemResponse.historyItem.void_item ||
      historyItemResponse.historyItem.trash_item

    if (!item) {
      return NextResponse.json({
        errors: {
          fieldErrors: {
            general: 'No item found',
          },
        },
      })
    }

    const content = item?.content
    const name = item?.name
    const summary = item?.summary

    let redirectUrl

    if (moveTo === 'epiphany') {
      const response = await updateEpiphanyItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        epiphanyItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })

      if (response.success === true && response.epiphanyItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/epiphany/view/${response.epiphanyItem.model_id}/${response.epiphanyItem.history_id}`
      }
    } else if (moveTo === 'inbox') {
      const response = await updateInboxItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        inboxItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })

      if (response.success === true && response.inboxItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/inbox/view/${response.inboxItem.model_id}/${response.inboxItem.history_id}`
      }
    } else if (moveTo === 'passing-thought') {
      const response = await updatePassingThoughtItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        passingThoughtItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })

      if (response.success === true && response.passingThoughtItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/passing-thought/view/${response.passingThoughtItem.model_id}/${response.passingThoughtItem.history_id}`
      }
    } else if (moveTo === 'todo') {
      const response = await updateTodoItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        todoItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })

      if (response.success === true && response.todoItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/todo/view/${response.todoItem.model_id}/${response.todoItem.history_id}`
      }
    } else if (moveTo === 'trash') {
      const response = await updateTrashItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        trashItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })
      if (response.success === true && response.trashItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/trash/view/${response.trashItem.model_id}/${response.trashItem.history_id}`
      }
    } else if (moveTo === 'void') {
      const response = await updateVoidItem({
        content: content!,
        name: name!,
        summary: summary!,
        historyItemId: historyId!,
        voidItemId: modelId!,
        userId,
        suiteId,
        storeyId,
        spaceId,
      })

      if (response.success === true && response.voidItem) {
        redirectUrl = `/suite/${suiteId}/dashboard/void/view/${response.voidItem.model_id}/${response.voidItem.history_id}`
      }
    }

    if (redirectUrl) {
      return NextResponse.json({
        success: true,
        redirect: redirectUrl,
      })
    }

    return NextResponse.json({
      errors: {
        fieldErrors: {
          general: 'Failed to move history item. Please try again.',
        },
      },
    })
  } catch {
    return NextResponse.json({
      errors: {
        fieldErrors: {
          general: 'No form data found',
        },
      },
    })
  }
}
