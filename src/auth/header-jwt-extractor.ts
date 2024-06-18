export const extractJwt = (token: string): string => {
  if (token.startsWith('Bearer ')) {
    // console.log(token.substring(7, token.length))
    return token.substring(7, token.length);
  }
};
