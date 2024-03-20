import { useRouter } from 'next/navigation'

export default function MoveTo({
  modelItemId,
  historyItemId,
}: {
  modelItemId: string
  historyItemId: string
}) {
  const router = useRouter()
  const onTrashClick = async (modelItemId: string, historyItemId: string) => {
    // Just using the browser confirm for the moment instead of a modal
    if (confirm('Are you sure you want to move this to the trash?')) {
      return onMoveClick(modelItemId, historyItemId, 'trash')
    }
  }
  const onMoveClick = async (
    modelItemId: string,
    historyItemId: string,
    moveTo: string,
  ) => {
    // const historyAction = moveTo === 'trash' ? 'trash' : 'move'
    const historyAction = 'move' // BTTODO - Ideally don't need a whole new controller

    const res = await fetch(
      `/api/history/${historyAction}/${modelItemId}/${historyItemId}/${moveTo}`,
      {
        method: 'POST',
      },
    )
    const resTest = await res.text()
    const resJson = JSON.parse(resTest)

    if (resJson.success === false) {
      return router.replace(resJson.redirect || '/')
    }

    if (resJson.success && resJson.redirect) {
      return router.push(resJson.redirect)
    }
  }
  return (
    <div className="md:flex">
      <div className="px-4 py-2 rounded-lg mr-4">Move to</div>
      {[
        { display: 'Epiphany', moveTo: 'epiphany' },
        { display: 'Inbox', moveTo: 'inbox' },
        { display: 'Passing Thought', moveTo: 'passing-thought' },
        { display: 'Todo', moveTo: 'todo' },
        { display: 'Void', moveTo: 'void' },
      ].map(({ display, moveTo }) => {
        return (
          <div key={moveTo}>
            <form className="md:flex">
              <button
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg mr-0 md:mr-4 ml-4 md:ml-0 mb-4 md:mb-0"
                type="button"
                onClick={() => {
                  void onMoveClick(modelItemId, historyItemId, moveTo)
                }}
              >
                {display}
              </button>
            </form>
          </div>
        )
      })}
      <div key={'trash'}>
        <form className="md:flex">
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg mr-0 md:mr-4 ml-4 md:ml-0 mb-4 md:mb-0"
            type="button"
            onClick={() => {
              void onTrashClick(modelItemId, historyItemId)
            }}
          >
            Trash
          </button>
        </form>
      </div>
    </div>
  )
}
