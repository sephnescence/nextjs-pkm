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
import TrashIcon from '@/components/icons/TrashIcon'
import { getSpaceDashboardForUser } from '@/repositories/space'
import ListBulletIcon from '@/components/icons/ListBulletIcon'

export default async function SpaceDashboardIndex({
  params: { suiteId, storeyId, spaceId },
  searchParams: { tab = 'content' },
}: {
  params: { suiteId: string; storeyId: string; spaceId: string; tab: string }
  searchParams: { tab: string }
}) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const space = await getSpaceDashboardForUser(storeyId, spaceId, user.id)

  if (!space) {
    return redirect('/')
  }
  const suiteInformationPacketTabGroupProps = {
    tabGroupInputName: 'space',
    tabs: [
      {
        tabDefaultChecked: tab === 'content',
        tabName: 'content',
        tabHeader: <ListBulletIcon />,
        tabContent: (
          <div dangerouslySetInnerHTML={{ __html: space.content }}></div>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#space--tab--content:checked]:block',
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
                      href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/epiphany/create`}
                    >
                      <LightbulbIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {space?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmEpiphany'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/epiphany/view/${item.model_id}/${item.history_id}`}
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
          'group-has-[.innsight-tab-group#space--tab--epiphany:checked]:block',
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
                      href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/inbox/create`}
                    >
                      <InboxStackIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {space?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmInbox'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/inbox/view/${item.model_id}/${item.history_id}`}
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
          'group-has-[.innsight-tab-group#space--tab--inbox:checked]:block',
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
                      href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/passing-thought/create`}
                    >
                      <BoltIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {space?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmPassingThought'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/passing-thought/view/${item.model_id}/${item.history_id}`}
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
          'group-has-[.innsight-tab-group#space--tab--passing-thought:checked]:block',
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
                      href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/todo/create`}
                    >
                      <BellAlertIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {space?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmTodo'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/todo/view/${item.model_id}/${item.history_id}`}
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
          'group-has-[.innsight-tab-group#space--tab--todo:checked]:block',
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
                      href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/void/create`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {space?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmVoid'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/void/view/${item.model_id}/${item.history_id}`}
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
          'group-has-[.innsight-tab-group#space--tab--void:checked]:block',
      },
      {
        tabName: 'trash',
        tabHeader: <TrashIcon />,
        tabContent: <>Trash NYI</>,
        tabContentClassName:
          'group-has-[.innsight-tab-group#space--tab--trash:checked]:block',
      },
    ],
  }

  return (
    <>
      <p className="text-4xl mb-2">
        <Link
          href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/view`}
        >
          {space.name}
        </Link>
      </p>
      <div className="text-xl text-white/60 mb-2">{space.description}</div>
      <SuiteInformationPacketTabGroup
        suiteInformationPacketTabGroupProps={
          suiteInformationPacketTabGroupProps
        }
      />
    </>
  )
}
