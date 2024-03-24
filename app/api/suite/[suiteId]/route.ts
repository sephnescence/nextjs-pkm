'use server'

import { getSuiteForUser, updateSuite } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SuiteGetParams = {
  params: {
    suiteId: string
  }
}

type SuitePatchParams = {
  params: {
    suiteId: string
  }
}

export const GET = async (
  request: Request,
  { params: { suiteId } }: SuiteGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    suite: {
      name: existingSuite.name,
      description: existingSuite.description,
      content: existingSuite.content,
    },
  })
}

export const PATCH = async (
  request: Request,
  { params: { suiteId } }: SuitePatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
    return NextResponse.json({
      success: false,
      error: 'Suite not found',
    })
  }

  const suiteArgs = (await request.json()) || ''

  if (!suiteArgs.name) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          name: 'Name is required',
        },
      },
    })
  }

  if (!suiteArgs.description) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          description: 'Description is required',
        },
      },
    })
  }

  const updatedSuite = await updateSuite({
    name: suiteArgs.name,
    description: suiteArgs.description,
    suiteId,
    userId: user.id,
  })

  if (!updatedSuite) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'An unexpected error occurred. Please try again.',
        },
      },
    })
  }

  return NextResponse.json({
    success: true,
    redirect: `/suites`,
  })
}
