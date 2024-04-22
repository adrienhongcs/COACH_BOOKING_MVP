from graphene import Schema
import user.schema
import scheduling.schema


class Query(user.schema.Query, scheduling.schema.Query):
    pass


class Mutation(scheduling.schema.Mutation):
    pass


schema = Schema(query=Query, mutation=Mutation)
