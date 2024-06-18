export const AuthHeader = (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

export const getToken = (authHeader) => {
  const tokenType = authHeader.substring(0, 6);
  if (tokenType !== 'Basic ') {
    return null;
  }
  return authHeader.substring(6);
};

export const decodeToken = (token) => {
  const decodedTok = Buffer.from(token, 'base64').toString('utf-8');
  if (!decodedTok.includes(':')) {
    return null;
  }
  return decodedTok;
};

export const getUserCredentials = (decodedTok) => {
  const [email, password] = decodedTok.split(':');
  if (!email || !password) {
    return null;
  }
  return { email, password };
};
