import { createHash, randomBytes } from 'crypto';
import moment from 'moment';
import { Session } from '../common/types';

const createSession = (): Session => ({
  sessionToken: generateToken(),
  sessionExpiration: moment().add(1, 'd').toDate(),
  refreshToken: generateToken(),
});

const extractAuthToken = (header: string): string => {
  const token = header.replace('Bearer', '').trim();
  if (!token) {
    throw new Error('Could not extract authentication token');
  }
  return token;
};

const generateHash = (input: string) =>
  createHash('sha256').update(input).digest('hex');

const generateToken = () => randomBytes(24).toString('hex');

export default {
  createSession,
  extractAuthToken,
  generateHash,
  generateToken,
};
