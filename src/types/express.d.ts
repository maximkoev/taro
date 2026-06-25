declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string | null;
      isTemporaryEmail: boolean;
    }
  }
}

export {};
