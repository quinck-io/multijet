/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */



import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteHandlerMethod,
} from "fastify"

import * as openapi from './index'


export interface Handlers {

  /**
   * Complete force change password challenge
   */
	completeForceChangePasswordChallenge?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.completeForceChangePasswordChallengePathParams
			Querystring: openapi.completeForceChangePasswordChallengeQueryParams
			Body: openapi.completeForceChangePasswordChallengeRequestBody
			Reply: openapi.completeForceChangePasswordChallengeReplyBody
			Headers: openapi.completeForceChangePasswordChallengeHeaders
    }
  >

  /**
   * Resend Signup Confirmation
   */
	resendSignupConfirmation?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.resendSignupConfirmationPathParams
			Querystring: openapi.resendSignupConfirmationQueryParams
			Body: openapi.resendSignupConfirmationRequestBody
			Reply: openapi.resendSignupConfirmationReplyBody
			Headers: openapi.resendSignupConfirmationHeaders
    }
  >

  /**
   * Log a specific user into the system
   */
	login?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.loginPathParams
			Querystring: openapi.loginQueryParams
			Body: openapi.loginRequestBody
			Reply: openapi.loginReplyBody
			Headers: openapi.loginHeaders
    }
  >

  /**
   * Reset password operation
   */
	resetPassword?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.resetPasswordPathParams
			Querystring: openapi.resetPasswordQueryParams
			Body: openapi.resetPasswordRequestBody
			Reply: openapi.resetPasswordReplyBody
			Headers: openapi.resetPasswordHeaders
    }
  >

  /**
   * Get user's profile
   */
	getUserProfile?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.getUserProfilePathParams
			Querystring: openapi.getUserProfileQueryParams
			Body: openapi.getUserProfileRequestBody
			Reply: openapi.getUserProfileReplyBody
			Headers: openapi.getUserProfileHeaders
    }
  >

  /**
   * Update user profile
   */
	updateUserProfile?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.updateUserProfilePathParams
			Querystring: openapi.updateUserProfileQueryParams
			Body: openapi.updateUserProfileRequestBody
			Reply: openapi.updateUserProfileReplyBody
			Headers: openapi.updateUserProfileHeaders
    }
  >

  /**
   * Update user credentials
   */
	updateUserCredentials?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.updateUserCredentialsPathParams
			Querystring: openapi.updateUserCredentialsQueryParams
			Body: openapi.updateUserCredentialsRequestBody
			Reply: openapi.updateUserCredentialsReplyBody
			Headers: openapi.updateUserCredentialsHeaders
    }
  >

  /**
   * Search Users
   */
	getUsers?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.getUsersPathParams
			Querystring: openapi.getUsersQueryParams
			Body: openapi.getUsersRequestBody
			Reply: openapi.getUsersReplyBody
			Headers: openapi.getUsersHeaders
    }
  >

  /**
   * Create a new user
   */
	createUser?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.createUserPathParams
			Querystring: openapi.createUserQueryParams
			Body: openapi.createUserRequestBody
			Reply: openapi.createUserReplyBody
			Headers: openapi.createUserHeaders
    }
  >

  /**
   * Get hello world message
   */
	getHelloWorld?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.getHelloWorldPathParams
			Querystring: openapi.getHelloWorldQueryParams
			Body: openapi.getHelloWorldRequestBody
			Reply: openapi.getHelloWorldReplyBody
			Headers: openapi.getHelloWorldHeaders
    }
  >

  /**
   * Multipart file upload
   */
	uploadFile?: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
			Params: openapi.uploadFilePathParams
			Querystring: openapi.uploadFileQueryParams
			Body: openapi.uploadFileRequestBody
			Reply: openapi.uploadFileReplyBody
			Headers: openapi.uploadFileHeaders
    }
  >
}
