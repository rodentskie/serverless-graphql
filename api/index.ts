import exitHook from "async-exit-hook";
import * as server from "./service";

const delay = async (sec: number) => {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

const apolloServer = server.start();

const handler = apolloServer.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});

export { handler };

exitHook(async (callback: () => void) => {
  await server.stop();
  await delay(10);
  callback();
});

exitHook.uncaughtExceptionHandler(async () => {
  await delay(10);
  process.exit(-1);
});
