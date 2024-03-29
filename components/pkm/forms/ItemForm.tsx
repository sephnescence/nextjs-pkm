'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PkmItem from '../PkmItem'

type ItemFormProps = {
  pageTitle: string
  cancelUrl?: string
  apiEndpoint: string
  apiMethod: string
  defaultContent?: string
  defaultName?: string
  defaultSummary?: string
}

export default function ItemForm({
  pageTitle,
  cancelUrl,
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
  const [content, setContent] = useState(
    () =>
      defaultContent ||
      `<div class="bg-blue-950 p-4">\nEnter your content here\n</div>`,
  )
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
      <div className="text-4xl mb-2">{pageTitle}</div>
      <form className="grid" onSubmit={() => false}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <div>
            <div className="mb-2">
              <label>
                <div className="mb-1">Name</div>
                <input
                  type="text"
                  className="min-w-full bg-slate-700 p-4"
                  name="name"
                  defaultValue={name}
                  disabled={!interactive || submitting}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </label>
              <br />
              {actionData?.errors.fieldErrors.name && (
                <div className="text-red-500">
                  {actionData.errors.fieldErrors?.name}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label>
                <div className="mb-1">Summary</div>
                <textarea
                  className="min-w-full min-h-48 bg-slate-700 p-4"
                  name="summary"
                  defaultValue={summary}
                  disabled={!interactive || submitting}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={`Item description\n- You have four lines to describe your item\n- Note that line breaks are ignored`}
                />
              </label>
              <br />
              {actionData?.errors.fieldErrors.summary && (
                <div className="text-red-500">
                  {actionData.errors.fieldErrors?.summary}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block mb-2">
            <div className="mb-1">Preview</div>
            {(name || summary) && (
              <PkmItem>
                <div className="text-lg line-clamp-1">{name}</div>
                <div className="text-sm line-clamp-4">{summary}</div>
              </PkmItem>
            )}
            {!(name || summary) && (
              <PkmItem>
                <div className="text-lg line-clamp-1">Item name</div>
                <div className="text-sm line-clamp-4">
                  Item description - You have four lines to describe your item -
                  Note that line breaks are ignored
                </div>
              </PkmItem>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <div className="mb-2">
            <label>
              <div className="mb-1">Content</div>
              <textarea
                className="min-w-full min-h-96 bg-slate-700 p-4"
                name="content"
                defaultValue={content}
                disabled={!interactive || submitting}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`<div class="bg-blue-950 p-4">\nEnter your content here\n</div>`}
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
            <div className="mb-1">Content preview</div>
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
            onClick={() => router.push(cancelUrl || '/reception')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
