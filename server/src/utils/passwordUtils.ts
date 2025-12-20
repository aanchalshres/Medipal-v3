import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const passwordHash = {
  hash: async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },
  compare: async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },
};