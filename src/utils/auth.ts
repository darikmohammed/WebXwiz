import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

const getUserIdFromToken = (token: string) => {  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {userId: string, requireTwoFactor: boolean}    
    return {userId: decoded.userId, requireTwoFactor: decoded.requireTwoFactor}
  } catch (error) {
    throw new GraphQLError('You are not authorized to perform this action.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  
}

export {getUserIdFromToken}