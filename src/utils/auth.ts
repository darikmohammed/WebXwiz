import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY as string

const getUserIdFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string }
    return decoded.userId
  } catch (error) {
    throw new Error('Invalid token')
  }
  
}

export {getUserIdFromToken}