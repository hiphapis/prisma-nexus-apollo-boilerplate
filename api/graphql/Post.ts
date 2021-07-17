import { AuthenticationError } from "apollo-server";
import { objectType, extendType, inputObjectType, mutationField } from 'nexus'
import bcrypt from 'bcrypt';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.body()
    t.model.username()
    t.model.passwordDigest()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.comments()
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.post()
    t.crud.posts({
      pagination: true,
      filtering: { title: true, body: true },
    })
  },
})

export const PostInputType = inputObjectType({
  name: 'PostInputType',
  definition(t) {
    t.int('id')
    t.nonNull.string('title')
    t.nonNull.string('body')
    t.nonNull.string('username')
    t.nonNull.string('password')
  }
})

export const CreatePost = mutationField('createPost', {
  type: 'Post',
  args: { data: PostInputType },
  resolve(root, args, ctx) {
    const { title, body, username, password } = args.data
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds);

    return ctx.prisma.post.create({
      data: { title, body, username, passwordDigest: hash }
    })
  }
})

export const UpdatePost = mutationField('updatePost', {
  type: 'Post',
  args: { data: PostInputType },
  async resolve(root, args, ctx) {
    const { id, title, body, username, password } = args.data
    const post = await ctx.prisma.post.findUnique({
      select: { passwordDigest: true },
      where: { id }
    })
    console.dir(post, { depth: null })
    console.log(password)
    if (!bcrypt.compareSync(password, post.passwordDigest)) {
      throw new AuthenticationError('Password does not matched')
    }

    return ctx.prisma.post.update({
      where: { id },
      data: { title, body, username }
    })
  }
})