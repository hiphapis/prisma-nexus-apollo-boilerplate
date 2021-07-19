import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

const saltRounds = 10
async function main() {
  console.log(`Start seeding ...`)
  for (let i = 0; i < 50; i++) {
    const passwordDigest = bcrypt.hashSync(`password ${i}`, saltRounds);
    const postData: Prisma.PostCreateInput = {
      title: `Title ${i}`,
      body: `Body ${i}`,
      username: `Username ${i}`,
      passwordDigest
    }
    const post = await prisma.post.create({ data: postData })
    console.log(`Created user with id: ${post.id}`)

    const commentsData: Prisma.CommentCreateInput[] = [{
      post: { connect: { id: post.id }},
      username: `Commentor 1`,
      body: `Parent Comment of Post ${i}`
    }, {
      post: { connect: { id: post.id }},
      username: `Commentor 2`,
      body: `Parent Comment of Post ${i}`,
      comments: {
        create: [{
          post: { connect: { id: post.id }},
          username: `Commentor 4`,
          body: `Child Comment of Commentor 2 on Post ${i}`
        }, {
          post: { connect: { id: post.id }},
          username: `Commentor 3`,
          body: `Child Comment of Commentor 2 on Post ${i}`
        }, {
          post: { connect: { id: post.id }},
          username: `Commentor 2`,
          body: `Child Comment of Commentor 2 on Post ${i}`
        }, {
          post: { connect: { id: post.id }},
          username: `Commentor 1`,
          body: `Child Comment of Commentor 2 on Post ${i}`
        }]
      }
    }, {
      post: { connect: { id: post.id }},
      username: `Commentor 3`,
      body: `Parent Comment of Post ${i}`
    }]

    for (const commentData of commentsData) {
      const comment = await prisma.comment.create({ data: commentData })
      console.log(`Created ${comment.id} comment for post id: ${post.id}`)
    }
  }

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
