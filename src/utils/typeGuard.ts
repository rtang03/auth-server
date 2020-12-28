import { ApiKey } from '../entity/ApiKey';
import {
  AllowAccessResponse,
  AuthenticateResponse,
  CreateClientRequest,
  CreateClientResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateClientRequest,
  UpdateUserRequest,
} from '../types';

export const isCreateClientRequest = (input: {
  application_name: string;
  client_secret: string;
}): input is CreateClientRequest =>
  input?.application_name !== undefined && input?.client_secret !== undefined;

export const isRegisterRequest = (input: {
  username: string;
  password: string;
  email: string;
}): input is RegisterRequest => !!input?.username && !!input?.password && !!input?.email;

export const isAllowAccessResponse = (input: {
  allow: boolean;
  client_id: string;
  scope: string[];
}): input is AllowAccessResponse =>
  input?.allow !== undefined && input?.client_id !== undefined && input?.scope !== undefined;

export const isAuthenticateResponse = (input: {
  ok: boolean;
  authenticated: boolean;
  user_id: string;
  username: string;
  is_admin: boolean;
}): input is AuthenticateResponse =>
  input?.ok !== undefined &&
  input?.authenticated !== undefined &&
  input?.user_id !== undefined &&
  input?.username !== undefined &&
  input?.is_admin !== undefined;

export const isLoginResponse = (input: {
  username: string;
  id: string;
  access_token: string;
  token_type: string;
}): input is LoginResponse =>
  input?.username !== undefined &&
  input?.id !== undefined &&
  input?.access_token !== undefined &&
  input?.token_type !== undefined;

export const isRegisterResponse = (input: {
  id: string;
  username: string;
}): input is RegisterResponse => input?.id !== undefined && input?.username !== undefined;

export const isCreateClientResponse = (input: {
  id: string;
  application_name: string;
  ok: boolean;
}): input is CreateClientResponse =>
  input?.id !== undefined && input?.application_name !== undefined && input?.ok !== undefined;

export const isApikey = (input: {
  id: string;
  api_key: string;
  client_id: string;
}): input is ApiKey =>
  input?.id !== undefined && input?.api_key !== undefined && input?.client_id !== undefined;

// note: || is used, instead of &&
export const isUpdateUserRequest = (input: {
  username: string;
  email: string;
}): input is UpdateUserRequest => input?.username !== undefined || input?.email !== undefined;

export const isUpdateClientRequest = (input: {
  application_name: string;
  client_secret;
}): input is UpdateClientRequest =>
  input?.application_name !== undefined || input?.client_secret !== undefined;

export const isRefreshTokenResponse = (input: {
  access_token: string;
  refresh_token: string;
  token_type: string;
}): input is RefreshTokenResponse =>
  input?.access_token !== undefined &&
  input?.refresh_token !== undefined &&
  input?.token_type !== undefined;
