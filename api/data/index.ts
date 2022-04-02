import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  const uri: string = process.env.MONGO_URI || 'mongodb://localhost/test';

  await connect(uri, {
    bufferCommands: false,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

const stop = async () => {
  await disconnect();
};

export { start, stop };
