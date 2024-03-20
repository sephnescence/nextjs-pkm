import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type SuiteFormProps = {
  pageTitle: string
  apiEndpoint: string
  apiMethod: string
  defaultName?: string
  defaultDescription?: string
}

const SuiteForm = ({
  pageTitle,
  apiEndpoint,
  apiMethod,
  defaultName,
  defaultDescription,
}: SuiteFormProps) => {
  const router = useRouter()
  const [actionData, setActionData] = useState({
    errors: {
      fieldErrors: { general: '', name: '', description: '' },
    },
  })
  const [name, setName] = useState(() => defaultName || '')
  const [description, setDescription] = useState(() => defaultDescription || '')
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
        body: JSON.stringify({ name, description }),
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
              <div className="mb-4">Description</div>
              <input
                type="text"
                className="min-w-full bg-slate-700 p-4"
                name="summary"
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
            onClick={() => router.push('/suites')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SuiteForm
