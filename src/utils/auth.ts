import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

const getUserIdFromToken = (totalToken: string) => {

  if(totalToken.split(' ')[0] !== 'Bearer') throw new GraphQLError('You are not authorized to perform this action.', {
    extensions: {
      code: 'FORBIDDEN',
    },
  });
  const token =  totalToken.split(' ')[1]
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