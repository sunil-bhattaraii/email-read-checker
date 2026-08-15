export type SessionUser = {
  id: string;
  username: string;
};

export type Pixel = {
  pixelId: string;
  purpose: string;
  opens: number;
  lastOpenedAt: string | null;
  createdAt: string;
};
