

export type LoginRequest = {
  email : string
  password : string
}
export type NuqiLoginRequest = {
  token : string
}
export type LoginResponse = {
  success: boolean,
  access_token : string,
  token_type : string
  user : {
    id : string,
    email : string
  }
}
export type NuqiLoginResponse = {
  success: boolean,
  access_token : string,
  token_type : string
  user : {
    id : string,
    email : string,
    name : string
  }
}
export type RefreshTokenResponse = {
  access_token : string,
  token_type : string
}
