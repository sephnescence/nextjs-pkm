import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type IndexFormProps = {
  pageTitle: string
  apiEndpoint: string
  apiMethod: string
  defaultContent?: string
}

export default function IndexForm({
  pageTitle,
  apiEndpoint,
  apiMethod,
  defaultContent,
}: IndexFormProps) {
  const router = useRouter()
  const [actionData, setActionData] = useState({
    errors: { fieldErrors: { general: '', content: '' } },
  })
  const [content, setContent] = useState(() => defaultContent || '')
  const [idle, setIdle] = useState(() => false)
  // Prevent form interaction while submitting and while the page is rendering
  useEffect(() => {
    setIdle(true)
  }, [idle])

  const handleSubmit = async () => {
    setIdle(false)

    const res = await fetch(
      new Request(apiEndpoint, {
        method: apiMethod,
        body: JSON.stringify({ content }),
      }),
    )

    const resJson = await JSON.parse(await res.text())

    if (resJson.success === false) {
      setActionData({
        errors: {
          fieldErrors: {
            general: resJson.errors.fieldErrors.general || '',
            content: resJson.errors.fieldErrors.content || '',
          },
        },
      })
    }

    setIdle(true)

    if (resJson.success === false && resJson.redirect) {
      router.replace(resJson.redirect)
    }

    if (resJson.success === true && resJson.redirect) {
      router.push(resJson.redirect)
    }
  }

  return (
    <>
      <div className="mx-4 my-4">
        {actionData?.errors.fieldErrors.general && (
          <div className="text-red-500">
            {actionData.errors.fieldErrors.general}
          </div>
        )}
        <div className="text-5xl mb-4">{pageTitle}</div>
        <form className="flex" onSubmit={() => false}>
          <div className="w-full">
            <div className="mb-4">
              <label>
                <div className="mb-4">Content</div>
                <textarea
                  className="min-w-full min-h-96 bg-white/20 p-4"
                  name="content"
                  defaultValue={content}
                  disabled={!idle}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>
              <br />
              {actionData?.errors.fieldErrors.content && (
                <div className="text-red-500">
                  {actionData.errors.fieldErrors?.content}
                </div>
              )}
            </div>
            <button
              className={`px-4 py-2 rounded-lg bg-blue-600  ${(!idle && 'bg-gray-400') || 'hover:bg-blue-500'}`}
              type="button"
              onClick={() => {
                void handleSubmit()
              }}
              disabled={!idle}
            >
              Submit
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg ml-4"
              type="button"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
