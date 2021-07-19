import { objectType, extendType, inputObjectType } from 'nexus'

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.body()
    t.model.createdAt()
    t.model.post()
    t.model.parent()
    t.model.comments({
      pagination: false,
      ordering: { id: true }
    })
  },
})

export const CommentQueries = extendType({
  type: 'Query',
  definition(t) {
    t.crud.comments({
      filtering: { parentId: true },
      ordering: { id: true }
    })
  },
})

export const CommentMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneComment({
      alias: 'createComment'
    })
  },
})
