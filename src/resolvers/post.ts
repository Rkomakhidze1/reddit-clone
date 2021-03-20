import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types/myContext";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  getPosts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }
}
