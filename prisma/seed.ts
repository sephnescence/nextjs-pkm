import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Make this script idempotent. schema.prisma is set up in such a way that deleting the user will delete their history and associated records
try {
  await prisma.user.delete({
    where: {
      clerkId: '00000000-0000-0000-0000-000000000000',
    },
  })
} catch {
  // Do nothing. User doesn't exist
}

const userId = '00000000-0000-0000-0000-000000000000'
await prisma.user.create({
  data: {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    username: 'test@example.com',
    clerkId: '00000000-0000-0000-0000-000000000000',
    suites: {
      create: {
        id: userId,
        name: 'Foyer',
        description: 'Enjoy your stay at Innsight',
      },
    },
    pkm_history: {
      create: [
        {
          is_current: true,
          model_type: 'PkmEpiphany',
          suite_id: userId,
          epiphany_item: {
            create: {
              content: 'Epiphany content',
              name: 'Epiphany name',
              summary: 'Epiphany summary',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmInbox',
          suite_id: userId,
          inbox_item: {
            create: {
              content: 'Inbox content',
              name: 'Inbox name',
              summary: 'Inbox summary',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmPassingThought',
          suite_id: userId,
          passing_thought_item: {
            create: {
              content: 'Passing thought content',
              name: 'Passing thought name',
              summary: 'Passing thought summary',
              void_at: new Date('9000-01-01 00:00:00'),
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmTodo',
          suite_id: userId,
          todo_item: {
            create: {
              content: 'Todo content',
              name: 'Todo name',
              summary: 'Todo summary',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmVoid',
          suite_id: userId,
          void_item: {
            create: {
              content: 'Void content',
              name: 'Void name',
              summary: 'Void summary',
              user_id: userId,
            },
          },
        },
        {
          model_type: 'PkmTrash',
          suite_id: userId,
          trash_item: {
            create: {
              content:
                'Trash content, but the content should have come from the item that was trashed',
              name: 'Trash name, but the content should have come from the item that was trashed',
              summary:
                'Trash summary, but the content should have come from the item that was trashed',
              user_id: userId,
            },
          },
        },
      ],
    },
  },
})
