'use server'

import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import ListBulletIcon from '@/components/icons/ListBulletIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import { getUserAuth } from '@/utils/auth'
import Epiphany from '@/components/pkm/Epiphany'
import Inbox from '@/components/pkm/Inbox'
import PassingThought from '@/components/pkm/PassingThought'
import Todo from '@/components/pkm/Todo'
import Void from '@/components/pkm/Void'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSuiteDashboardForUser } from '@/repositories/suite'

export default async function SuiteDashboardIndex({
  params: { suiteId },
}: {
  params: { suiteId: string }
}) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }

  return (
    <>
      <p className="text-5xl">
        <Link href={`/suite/view/${suiteId}`}>{suite.name}</Link>
      </p>
      <div className="mt-4 text-xl text-white/60 mb-4">{suite.description}</div>
      {/* <div className="grid grid-cols-1 mb-4 sm:hidden">
        This will show the button summary of the Suite
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* <div className="md:mr-1">Content?</div> */}
        {/* <div className="hidden sm:grid md:ml-1"> */}
        <div className="sm:grid md:ml-1">
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/inbox`}
                    >
                      <InboxStackIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/inbox/create`}
                    >
                      <InboxStackIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {suite?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmInbox'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-yellow-500"
                  >
                    <Link
                      className="rounded-2xl focus:outline-offset-1 focus:outline-yellow-600"
                      href={`/suite/${suiteId}/inbox/view/${item.model_id}/${item.history_id}`}
                    >
                      <Inbox inboxItem={item.inbox_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/epiphany`}
                    >
                      <LightbulbIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/epiphany/create`}
                    >
                      <LightbulbIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {suite?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmEpiphany'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-lime-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/epiphany/view/${item.model_id}/${item.history_id}`}
                    >
                      <Epiphany epiphanyItem={item.epiphany_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/passing-thought`}
                    >
                      <BoltIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-rose-600"
                      href={`/suite/${suiteId}/passing-thought/create`}
                    >
                      <BoltIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {suite?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmPassingThought'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-rose-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-rose-600"
                      href={`/suite/${suiteId}/passing-thought/view/${item.model_id}/${item.history_id}`}
                    >
                      <PassingThought
                        passingThoughtItem={item.passing_thought_item!}
                      />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/todo`}
                    >
                      <BellAlertIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-cyan-600"
                      href={`/suite/${suiteId}/todo/create`}
                    >
                      <BellAlertIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {suite?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmTodo'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-cyan-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-cyan-600"
                      href={`/suite/${suiteId}/todo/view/${item.model_id}/${item.history_id}`}
                    >
                      <Todo todoItem={item.todo_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/void`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-orange-600"
                      href={`/suite/${suiteId}/void/create`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {suite?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmVoid'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-orange-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-orange-600"
                      href={`/suite/${suiteId}/void/view/${item.model_id}/${item.history_id}`}
                    >
                      <Void voidItem={item.void_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
