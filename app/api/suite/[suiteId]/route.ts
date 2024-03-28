'use server'

import { storeStorey } from '@/repositories/storey'
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

// Get a Suite
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

// Update a Suite
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

  if (!suiteArgs.content) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          content: 'Content is required',
        },
      },
    })
  }

  const updatedSuite = await updateSuite({
    name: suiteArgs.name,
    description: suiteArgs.description,
    suiteId,
    userId: user.id,
    content: suiteArgs.content,
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

// Create a Storey
export const POST = async (
  request: Request,
  {
    params: { suiteId },
  }: {
    params: {
      suiteId: string
    }
  },
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  if (!suiteId) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const storeyArgs = (await request.json()) || ''

  if (!storeyArgs.name) {
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

  if (!storeyArgs.description) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          description: 'description is required',
        },
      },
    })
  }

  if (!storeyArgs.content) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          content: 'Content is required',
        },
      },
    })
  }

  const newStorey = await storeStorey({
    userId: user.id,
    suiteId,
    name: storeyArgs.name,
    description: storeyArgs.description,
    content: storeyArgs.content,
  })

  if (!newStorey || !newStorey.storey || !newStorey.success) {
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
    redirect: `/suite/${suiteId}/storey/${newStorey.storey.id}`,
  })
}
