import Link from 'next/link'

type BreadcrumbsProps = {
  suiteId: string
  suiteName: string
  storeyId?: string
  storeyName?: string
  spaceId?: string
  spaceName?: string
}

const Breadcrumbs = ({
  suiteId,
  suiteName,
  storeyId,
  storeyName,
  spaceId,
  spaceName,
}: BreadcrumbsProps) => {
  return (
    <div className="flex gap-2">
      <Link href={`/suites`}>Suites</Link>
      <Link href={`/suite/${suiteId}/dashboard`}>&gt; {suiteName}</Link>
      {storeyId && storeyName && (
        <Link href={`/suite/${suiteId}/storey/${storeyId}/dashboard`}>
          &gt; {storeyName}
        </Link>
      )}
      {spaceId && spaceName && (
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard`}
        >
          &gt; {spaceName}
        </Link>
      )}
    </div>
  )
}

export default Breadcrumbs
