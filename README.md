Example insert select to generate missing storeys or spaces

```sql
insert into "Suite" (id, user_id, "name", description, "updatedAt")
select id, user_id, 'Welcome center' as "name", 'Enjoy your stay at Innsight' as description, current_timestamp as "updatedAt" from "Suite"
on conflict do nothing;

update "Suite" set "name" = 'Welcome center', description = 'Enjoy your stay at Innsight' where id in (select id from "User");

insert into "Storey" (id, user_id, suite_id, "name", description, "updatedAt")
select id, user_id, user_id as suite_id, 'Foyer' as "name", 'Please head to reception' as description, current_timestamp as "updatedAt" from "Suite"
on conflict do nothing;

update "Storey" set "name" = 'Foyer', description = 'Please head to reception' where id in (select id from "User");

insert into "Space" (id, user_id, storey_id, "name", description, "updatedAt")
select id, user_id, user_id as storey_id, 'Reception' as "name", 'Check in' as description, current_timestamp as "updatedAt" from "Suite"
on conflict do nothing;

update "Space" set "name" = 'Reception', description = 'Check in' where id in (select id from "User");

update "PkmHistory" set suite_id = null, storey_id = user_id, space_id = user_id;
```

---

[![GitHub Actions Demo](https://github.com/sephnescence/nextjs-pkm/actions/workflows/github-actions-demo.yml/badge.svg)](https://github.com/sephnescence/nextjs-pkm/actions/workflows/github-actions-demo.yml)

# nextjs-pkm

A project to explore personal knowledge management in an all in one

Scott Moss on Frontend Masters showed me a bit about NextJS and integrating with OpenAI, and I am hooked! Scott's already taught me how to make my own agents to save the subscription for ChatGPT, but there are other tools I want to try and consolidate as well. Currently my personal knowledge management tools include my own Slack Workspace and Obsidian (with Sync)

I've had many requests to share what's inside my Personal Knowledge Management solution, but it's not really available in a shareable format. I can only give people access to the files I explicitly include in a folder dump of my Obsidian Vault. What if, I was able to share my PKM with ease? While also retaining what I love about Slack - Reminders, Threads, Channels, and combine them with Obsidian style files that are readily shareable

Initially I was worried that I'd have to come up with my own editor and lose the image functionality that I've come to enjoy from Obsidian, but I've learned about a project called Novel, which relies on a blob store key from Vercel, but I don't mind using Vercel, so long as collectively it can provide more value to me than Slack and Obsidian can

# create-next-app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
