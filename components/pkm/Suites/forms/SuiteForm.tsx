import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SuiteTile from './SuiteTile'

type SuiteFormProps = {
  pageTitle: string
  cancelUrl?: string
  apiEndpoint: string
  apiMethod: string
  defaultName?: string
  defaultDescription?: string
  defaultContent?: string
}

const SuiteForm = ({
  pageTitle,
  cancelUrl,
  apiEndpoint,
  apiMethod,
  defaultName,
  defaultDescription,
  defaultContent,
}: SuiteFormProps) => {
  const router = useRouter()
  const [actionData, setActionData] = useState({
    errors: {
      fieldErrors: { general: '', name: '', description: '', content: '' },
    },
  })
  const [name, setName] = useState(() => defaultName || '')
  const [description, setDescription] = useState(() => defaultDescription || '')
  const [content, setContent] = useState(() => defaultContent || '')
  const [interactive, setInteractive] = useState(() => false)
  const [submitting, setSubmitting] = useState(() => false)

  useEffect(() => {
    setInteractive(true)
  }, [interactive])

  const handleSubmit = async () => {
    setSubmitting(true)

    const res = await fetch(
      new Request(apiEndpoint, {
        method: apiMethod,
        body: JSON.stringify({ name, description, content }),
      }),
    )

    const resJson = await JSON.parse(await res.text())

    if (resJson.success === false) {
      setActionData({
        errors: {
          fieldErrors: {
            general: resJson?.errors.fieldErrors.general || '',
            name: resJson?.errors.fieldErrors.name || '',
            description: resJson?.errors.fieldErrors.description || '',
            content: resJson?.errors.fieldErrors.content || '',
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
      <div className="text-4xl mb-2">{pageTitle}</div>
      {/* flex flex-shrink flex-grow basis-0 */}
      <form className="grid" onSubmit={() => false}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <div>
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
                <div className="mb-4">Description</div>
                <textarea
                  className="min-w-full min-h-48 bg-slate-700 p-4"
                  name="description"
                  defaultValue={description}
                  disabled={!interactive || submitting}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <br />
              {actionData?.errors.fieldErrors.description && (
                <div className="text-red-500">
                  {actionData.errors.fieldErrors?.description}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block mb-4">
            <div className="mb-4">Preview</div>
            {(name || description) && (
              <SuiteTile id={'preview'} name={name} description={description} />
            )}
            {!(name || description) && (
              <SuiteTile
                id={'preview'}
                name={'Name'}
                description={'Description'}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
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
          <div className="hidden md:block">
            <div className="mb-4">Content preview</div>
            {content && (
              <div
                id="innsight-content-preview"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            )}
            {!content && (
              <div className="bg-blue-950 p-4">Enter your content here</div>
            )}
          </div>
        </div>
        <div className="flex">
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
            onClick={() => router.push(cancelUrl || '/suites')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SuiteForm
