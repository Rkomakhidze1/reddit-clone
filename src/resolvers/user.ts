import {
  Resolver,
  Ctx,
  Mutation,
  Arg,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { MyContext } from '../types/myContext';
import { User } from '../entities/User';
import argon2 from 'argon2';

@InputType()
class UserOptions {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class ErrorResponse {
  @Field()
  success: boolean;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  error?: ErrorResponse[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async createUser(
    @Arg('options') options: UserOptions,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.password.length < 4) {
      return {
        error: [
          {
            success: false,
            message: 'password must be greater than 3',
          },
        ],
      };
    }

    if (options.username.length < 4) {
      return {
        error: [
          {
            success: false,
            message: 'username must be greater than 3',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserOptions,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        error: [
          {
            success: false,
            message: "username does't exist",
          },
        ],
      };
    }
    const validPassword = await argon2.verify(user.password, options.password);
    if (!validPassword) {
      return {
        error: [
          {
            success: false,
            message: "username does't exist",
          },
        ],
      };
    }
    req.session.userId = user.id;
    console.log(req.session, req.session.userId);

    return { user };
  }
}
