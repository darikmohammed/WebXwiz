import jwt from 'jsonwebtoken'

const getUserIdFromToken = (token: string) => {  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {userId: string, requireTwoFactor: boolean}
    if (decoded.requireTwoFactor) throw new Error('Two factor authentication required.')
    return decoded.userId
  } catch (error) {
    throw new Error('Not authenticated.')
  }
  
}

export {getUserIdFromToken}