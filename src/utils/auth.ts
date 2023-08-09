import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY as string

const getUserIdFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string, requireTwoFactor: boolean }
    if (decoded.requireTwoFactor) throw new Error('Two factor authentication required.')
    return decoded.userId
  } catch (error) {
    throw new Error('Not authenticated.')
  }
  
}

export {getUserIdFromToken}