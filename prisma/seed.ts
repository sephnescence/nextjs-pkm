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
    pkm_history: {
      create: [
        {
          is_current: true,
          model_type: 'PkmEpiphany',
          epiphany_item: {
            create: {
              content: 'Epiphany!',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmInbox',
          inbox_item: {
            create: {
              content: 'Inbox!',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmPassingThought',
          passing_thought_item: {
            create: {
              content: 'Passing Thought!',
              void_at: new Date('9000-01-01 00:00:00'),
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmTodo',
          todo_item: {
            create: {
              content: 'Todo!',
              user_id: userId,
            },
          },
        },
        {
          is_current: true,
          model_type: 'PkmVoid',
          void_item: {
            create: {
              content: 'Void!',
              user_id: userId,
            },
          },
        },
        {
          model_type: 'PkmTrash',
          trash_item: {
            create: {
              content: 'Trash!',
              user_id: userId,
            },
          },
        },
      ],
    },
  },
})
