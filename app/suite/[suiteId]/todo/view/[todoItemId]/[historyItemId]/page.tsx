import MoveTo from '@/components/pkm/forms/MoveTo'
import { getCurrentTodoItemForUser } from '@/repositories/todo'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type TodoViewRouteParams = {
  params: {
    suiteId: string
    todoItemId: string
    historyItemId: string
  }
}

export default async function TodoViewRoute({
  params: { suiteId, todoItemId, historyItemId },
}: TodoViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  const todoTodoHistoryItem = await getCurrentTodoItemForUser(
    suiteId,
    todoItemId,
    historyItemId,
    user.id,
  )

  if (
    !todoTodoHistoryItem ||
    !todoTodoHistoryItem.suite ||
    !todoTodoHistoryItem.todo_item
  ) {
    return redirect('/')
  }

  return (
    <div className="">
      <div className="text-5xl mb-4">View Todo Item</div>
      <div className="w-full mb-4">
        <div className="mb-4">
          <label>
            <div className="mb-4">Name</div>
            <input
              type="text"
              className="min-w-full bg-slate-800 p-4"
              name="name"
              defaultValue={todoTodoHistoryItem.todo_item.name}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Summary</div>
            <textarea
              className="min-w-full min-h-48 bg-slate-800 p-4"
              name="summary"
              defaultValue={todoTodoHistoryItem.todo_item.summary}
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <div
              dangerouslySetInnerHTML={{
                __html: todoTodoHistoryItem.todo_item.content,
              }}
            />
          </label>
        </div>
        <Link
          href={`/suite/${suiteId}/todo/edit/${todoItemId}/${historyItemId}`}
        >
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
      <MoveTo
        suiteId={suiteId}
        modelItemId={todoItemId}
        historyItemId={historyItemId}
      />
    </div>
  )
}
