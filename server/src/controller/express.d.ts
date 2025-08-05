// src/types/express.d.ts

import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: File | undefined;
      files?: File[] | undefined;
    }
  }
}
