/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import AccountModel from './models/accounts';
import * as db from './data';
import { UserInputError } from 'apollo-server-errors';
import { hash, genSalt } from 'bcrypt';
import { generateId, EntityType } from './functions/generate-binary-id';

dotenv.config();
const PW: string = process.env.TOKEN_PW || 'mfmsosjwpxwszyzknnktjdvwqjspsqpw';

const generateToken = (data: any) => {
  const token: string = sign({ data }, PW);
  return token;
};

const encrypt = async (str: string) => {
  const salt = await genSalt(12);
  return hash(str, salt);
};

type SignUpInput = {
  input: {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

const start = () => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
    type Mutation {
      signUp(input: SignUpInput!): Authentication!
    }

    input SignUpInput {
      emailAddress: String!
      firstName: String!
      lastName: String!
      password: String!
    }

    type Authentication {
      token: String!
    }
  `;

  const resolvers = {
    Query: {
      hello: () => 'Hello One world!',
    },
    Mutation: {
      signUp: async (_: never, data: SignUpInput) => {
        const { input } = data;
        const {
          emailAddress, firstName, lastName, password,
        } = input;
        const id = generateId(EntityType.Account);

        const emailExists = await AccountModel.exists({
          emailAddress,
        });

        if (emailExists) throw new UserInputError('Email address already used.');

        const user = await AccountModel.create({
          id,
          firstName,
          lastName,
          emailAddress,
          password: await encrypt(password),
        });

        const token = generateToken(user);

        return { token };
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: async () => {
      await db.start();
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  return apolloServer;
};

const stop = async () => {
  await db.stop();
};

export { start, stop };
