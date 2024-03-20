import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type ItemFormProps = {
  pageTitle: string
  apiEndpoint: string
  apiMethod: string
  defaultContent?: string
  defaultName?: string
  defaultSummary?: string
}

export default function ItemForm({
  pageTitle,
  apiEndpoint,
  apiMethod,
  defaultContent,
  defaultName,
  defaultSummary,
}: ItemFormProps) {
  const router = useRouter()
  const [actionData, setActionData] = useState({
    errors: {
      fieldErrors: { general: '', content: '', name: '', summary: '' },
    },
  })
  const [content, setContent] = useState(() => defaultContent || '')
  const [name, setName] = useState(() => defaultName || '')
  const [summary, setSummary] = useState(() => defaultSummary || '')
  const [interactive, setInteractive] = useState(() => false)
  const [submitting, setSubmitting] = useState(() => false)

  // Prevent form interaction while submitting and while the page is rendering
  useEffect(() => {
    setInteractive(true)
  }, [interactive])

  const handleSubmit = async () => {
    setSubmitting(true)

    const res = await fetch(
      new Request(apiEndpoint, {
        method: apiMethod,
        body: JSON.stringify({ content, name, summary }),
      }),
    )

    const resJson = await JSON.parse(await res.text())

    if (resJson.success === false) {
      setActionData({
        errors: {
          fieldErrors: {
            general: resJson?.errors.fieldErrors.general || '',
            content: resJson?.errors.fieldErrors.content || '',
            name: resJson?.errors.fieldErrors.name || '',
            summary: resJson?.errors.fieldErrors.summary || '',
          },
        },
      })
    }

    if (!resJson.redirect) {
      setSubmitting(false)
    }

    if (resJson.success === false && resJson.redirect) {
      router.replace(resJson.redirect)
    }

    if (resJson.success === true && resJson.redirect) {
      router.push(resJson.redirect)
    }
  }

  return (
    <div className="">
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
              <div className="mb-4">Name</div>
              <input
                type="text"
                className="min-w-full bg-slate-700 p-4"
                name="name"
                defaultValue={name}
                disabled={!interactive || submitting}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            {actionData?.errors.fieldErrors.name && (
              <div className="text-red-500">
                {actionData.errors.fieldErrors?.name}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label>
              <div className="mb-4">Summary</div>
              <input
                type="text"
                className="min-w-full bg-slate-700 p-4"
                name="summary"
                defaultValue={summary}
                disabled={!interactive || submitting}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
            <br />
            {actionData?.errors.fieldErrors.summary && (
              <div className="text-red-500">
                {actionData.errors.fieldErrors?.summary}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label>
              <div className="mb-4">Content</div>
              <textarea
                className="min-w-full min-h-96 bg-slate-700 p-4"
                name="content"
                defaultValue={content}
                disabled={!interactive || submitting}
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
            className={`px-4 py-2 rounded-lg bg-blue-600 ${(!interactive || submitting ? 'bg-gray-400' : '') || 'hover:bg-blue-500'}`}
            type="button"
            onClick={() => {
              void handleSubmit()
            }}
            disabled={!interactive || submitting}
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
  )
}
