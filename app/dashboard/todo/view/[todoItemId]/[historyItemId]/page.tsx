import { getCurrentTodoItemForUser } from '@/repositories/todo'
import { getUserAuth } from '@/utils/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type TodoViewRouteParams = {
  params: {
    todoItemId: string
    historyItemId: string
  }
}

export default async function TodoViewRoute({
  params: { todoItemId, historyItemId },
}: TodoViewRouteParams) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const todoItem = await getCurrentTodoItemForUser(
    todoItemId,
    historyItemId,
    user.id,
  )

  if (!todoItem) {
    return redirect('/')
  }

  return (
    <div className="mx-4 my-4">
      <div className="text-5xl mb-4">View Todo Item</div>
      <div className="w-full">
        <div className="mb-4">
          <label>
            <div className="mb-4">Content</div>
            <textarea
              className="min-w-full min-h-96 bg-white/20 p-4"
              name="content"
              defaultValue={todoItem.content}
              readOnly
            />
          </label>
        </div>
        <Link href={`/dashboard/todo/edit/${todoItemId}/${historyItemId}`}>
          <button
            className="border-solid border-2 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg mr-4"
            type="button"
          >
            Edit
          </button>
        </Link>
      </div>
    </div>
  )
}
