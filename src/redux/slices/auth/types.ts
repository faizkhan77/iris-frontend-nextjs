

export type LoginRequest = {
  email : string
  password : string
}
export type LoginResponse = {
  success: boolean,
  access_token : string,
  refresh_token : string,
  token_type : string
  user : {
    id : string,
    email : string
  }
}
