import jwt from 'jsonwebtoken';

const RESET_EXPIRES = process.env.JWT_RESET_EXPIRES || '5m';

export function signResetToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: RESET_EXPIRES,
  });
}

export function verifyResetToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
