import { Response } from 'express';

export const setCookie = (res: Response, token: string, end?: boolean, name? : string, path? : string, maxAge? : number) => {
  res.cookie(name || "token", token,{
    httpOnly : true,
    maxAge : maxAge || 1000 * 60 * 60,
    path : path || "/"
  });
  if (end) {
    res.end();
  }
  return;
};
