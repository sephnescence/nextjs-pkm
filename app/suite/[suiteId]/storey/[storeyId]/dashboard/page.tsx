'use server'

import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import { getUserAuth } from '@/utils/auth'
import Epiphany from '@/components/pkm/Epiphany'
import Inbox from '@/components/pkm/Inbox'
import PassingThought from '@/components/pkm/PassingThought'
import Todo from '@/components/pkm/Todo'
import Void from '@/components/pkm/Void'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SuiteInformationPacketTabGroup from '@/components/pkm/Suites/content/SuiteInformationPacketTabGroup'
import KeyIcon from '@/components/icons/KeyIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getStoreyDashboardForUser } from '@/repositories/storey'
import ListBulletIcon from '@/components/icons/ListBulletIcon'
import SpaceTile from '@/components/pkm/Suites/forms/SpaceTile'

export default async function SuiteDashboardIndex({
  params: { suiteId, storeyId },
  searchParams: { tab = 'content' },
}: {
  params: { suiteId: string; storeyId: string }
  searchParams: { tab: string }
}) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const storey = await getStoreyDashboardForUser(suiteId, storeyId, user.id)

  if (!storey) {
    return redirect('/')
  }

  const suiteInformationPacketTabGroupProps = {
    tabGroupInputName: 'storey',
    tabs: [
      {
        tabDefaultChecked: tab === 'content',
        tabName: 'content',
        tabHeader: <ListBulletIcon />,
        tabContent: (
          <div dangerouslySetInnerHTML={{ __html: storey.content }}></div>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--content:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'spaces',
        tabName: 'spaces',
        tabHeader: <KeyIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2 ml-1">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-900 h-8 mr-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/space/config/new`}
                    >
                      <KeyIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {storey.spaces.map((space) => (
                <div key={space.id}>
                  <SpaceTile
                    suiteId={storey.suite.id}
                    storeyId={storey.id}
                    spaceId={space.id}
                    name={space.name}
                    description={space.description}
                  />
                </div>
              ))}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--spaces:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'epiphany',
        tabName: 'epiphany',
        tabHeader: <LightbulbIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/dashboard/epiphany/create`}
                    >
                      <LightbulbIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {storey?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmEpiphany'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/dashboard/epiphany/view/${item.model_id}/${item.history_id}`}
                      >
                        <Epiphany epiphanyItem={item.epiphany_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--epiphany:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'inbox',
        tabName: 'inbox',
        tabHeader: <InboxStackIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/dashboard/inbox/create`}
                    >
                      <InboxStackIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {storey?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmInbox'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/dashboard/inbox/view/${item.model_id}/${item.history_id}`}
                      >
                        <Inbox inboxItem={item.inbox_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--inbox:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'passing-thought',
        tabName: 'passing-thought',
        tabHeader: <BoltIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-rose-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/dashboard/passing-thought/create`}
                    >
                      <BoltIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {storey?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmPassingThought'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/dashboard/passing-thought/view/${item.model_id}/${item.history_id}`}
                      >
                        <PassingThought
                          passingThoughtItem={item.passing_thought_item!}
                        />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--passing-thought:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'todo',
        tabName: 'todo',
        tabHeader: <BellAlertIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-cyan-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/dashboard/todo/create`}
                    >
                      <BellAlertIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {storey?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmTodo'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/dashboard/todo/view/${item.model_id}/${item.history_id}`}
                      >
                        <Todo todoItem={item.todo_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--todo:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'void',
        tabName: 'void',
        tabHeader: <ArchiveBoxXMarkIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-orange-600"
                      href={`/suite/${suiteId}/storey/${storeyId}/dashboard/void/create`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {storey?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmVoid'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/dashboard/void/view/${item.model_id}/${item.history_id}`}
                      >
                        <Void voidItem={item.void_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--void:checked]:block',
      },
      {
        tabDefaultChecked: tab === 'trash',
        tabName: 'trash',
        tabHeader: <TrashIcon />,
        tabContent: <>Trash NYI</>,
        tabContentClassName:
          'group-has-[.innsight-tab-group#storey--tab--trash:checked]:block',
      },
    ],
  }

  return (
    <>
      <p className="text-4xl mb-2">
        <Link href={`/suite/${suiteId}/storey/${storeyId}/config`}>
          {storey.name}
        </Link>
      </p>
      <div className="text-xl text-white/60 mb-2">{storey.description}</div>
      <SuiteInformationPacketTabGroup
        suiteInformationPacketTabGroupProps={
          suiteInformationPacketTabGroupProps
        }
      />
    </>
  )
}
