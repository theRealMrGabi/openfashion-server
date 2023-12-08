import crypto from 'crypto'

export const generateSecureKey = () => crypto.randomBytes(32).toString('hex')
