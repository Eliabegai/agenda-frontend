import jwt from "jsonwebtoken";

export interface IToken {
  username: string
  email: string
  id: string
  role: string
  iat: number
}

const decodeToken = (token:string):IToken | null => {
  try {
    return jwt.decode(token) as IToken
  } catch(error) {
    console.error('Token Inválido', error)
    return null
  }
}

export default decodeToken