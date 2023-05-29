/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


export const loginRoute: any =
{
  "method": "POST",
  "url": "/auth/login",
  "schema": {
    "tags": [
      "Authentication"
    ],
    "summary": "Log a specific user into the system",
    "operationId": "login",
    "body": {
      "type": "object",
      "required": [
        "email",
        "password"
      ],
      "properties": {
        "email": {
          "type": "string",
          "format": "email"
        },
        "password": {
          "type": "string"
        }
      }
    },
    "response": {
      "200": {
        "type": "object",
        "required": [
          "userId",
          "authorization",
          "refresh"
        ],
        "properties": {
          "userId": {
            "type": "string"
          },
          "authorization": {
            "type": "string"
          },
          "refresh": {
            "type": "string"
          }
        }
      },
      "400": {
        "type": "object",
        "description": "Informations regarding a backend error",
        "required": [
          "description",
          "errorCode"
        ],
        "properties": {
          "description": {
            "type": "string"
          },
          "errorCode": {
            "type": "string",
            "description": "4xx:\n  - client-side errors;\n\n5xx:\n  - server-side errors;\n",
            "enum": [
              "400_BAD-REQUEST",
              "401_UNAUTHORIZED-NOT-AUTHENTICATED",
              "401_USER_NOT_CONFIRMED",
              "401_UPDATE_CREDENTIALS_OLD_PASSWORD_WRONG",
              "403_FORBIDDEN-NOT-AUTHORIZED",
              "404_NOT-FOUND",
              "404_USER_NOT_FOUND",
              "409_CONFLICT",
              "409_USER_ALREADY_EXISTS",
              "413_PAYLOAD_TOO_LARGE",
              "429_TOO-MANY-REQUESTS",
              "500_INTERNAL-SERVER-ERROR",
              "500_NOT-CREATED",
              "500_NOT-UPDATED",
              "500_NOT-DELETED",
              "500_NOT-RETRIEVED",
              "500_SEARCH-ERROR",
              "500_USER_DATA_NOT_FOUND",
              "501_NOT-IMPLEMENTED-ERROR"
            ]
          },
          "inputId": {
            "type": "string"
          }
        }
      },
      "401": {
        "type": "object",
        "description": "Informations regarding a backend error",
        "required": [
          "description",
          "errorCode"
        ],
        "properties": {
          "description": {
            "type": "string"
          },
          "errorCode": {
            "type": "string",
            "description": "4xx:\n  - client-side errors;\n\n5xx:\n  - server-side errors;\n",
            "enum": [
              "400_BAD-REQUEST",
              "401_UNAUTHORIZED-NOT-AUTHENTICATED",
              "401_USER_NOT_CONFIRMED",
              "401_UPDATE_CREDENTIALS_OLD_PASSWORD_WRONG",
              "403_FORBIDDEN-NOT-AUTHORIZED",
              "404_NOT-FOUND",
              "404_USER_NOT_FOUND",
              "409_CONFLICT",
              "409_USER_ALREADY_EXISTS",
              "413_PAYLOAD_TOO_LARGE",
              "429_TOO-MANY-REQUESTS",
              "500_INTERNAL-SERVER-ERROR",
              "500_NOT-CREATED",
              "500_NOT-UPDATED",
              "500_NOT-DELETED",
              "500_NOT-RETRIEVED",
              "500_SEARCH-ERROR",
              "500_USER_DATA_NOT_FOUND",
              "501_NOT-IMPLEMENTED-ERROR"
            ]
          },
          "inputId": {
            "type": "string"
          }
        }
      },
      "409": {
        "type": "object",
        "description": "Informations regarding a backend error",
        "required": [
          "description",
          "errorCode"
        ],
        "properties": {
          "description": {
            "type": "string"
          },
          "errorCode": {
            "type": "string",
            "description": "4xx:\n  - client-side errors;\n\n5xx:\n  - server-side errors;\n",
            "enum": [
              "400_BAD-REQUEST",
              "401_UNAUTHORIZED-NOT-AUTHENTICATED",
              "401_USER_NOT_CONFIRMED",
              "401_UPDATE_CREDENTIALS_OLD_PASSWORD_WRONG",
              "403_FORBIDDEN-NOT-AUTHORIZED",
              "404_NOT-FOUND",
              "404_USER_NOT_FOUND",
              "409_CONFLICT",
              "409_USER_ALREADY_EXISTS",
              "413_PAYLOAD_TOO_LARGE",
              "429_TOO-MANY-REQUESTS",
              "500_INTERNAL-SERVER-ERROR",
              "500_NOT-CREATED",
              "500_NOT-UPDATED",
              "500_NOT-DELETED",
              "500_NOT-RETRIEVED",
              "500_SEARCH-ERROR",
              "500_USER_DATA_NOT_FOUND",
              "501_NOT-IMPLEMENTED-ERROR"
            ]
          },
          "inputId": {
            "type": "string"
          }
        }
      },
      "500": {
        "type": "object",
        "description": "Informations regarding a backend error",
        "required": [
          "description",
          "errorCode"
        ],
        "properties": {
          "description": {
            "type": "string"
          },
          "errorCode": {
            "type": "string",
            "description": "4xx:\n  - client-side errors;\n\n5xx:\n  - server-side errors;\n",
            "enum": [
              "400_BAD-REQUEST",
              "401_UNAUTHORIZED-NOT-AUTHENTICATED",
              "401_USER_NOT_CONFIRMED",
              "401_UPDATE_CREDENTIALS_OLD_PASSWORD_WRONG",
              "403_FORBIDDEN-NOT-AUTHORIZED",
              "404_NOT-FOUND",
              "404_USER_NOT_FOUND",
              "409_CONFLICT",
              "409_USER_ALREADY_EXISTS",
              "413_PAYLOAD_TOO_LARGE",
              "429_TOO-MANY-REQUESTS",
              "500_INTERNAL-SERVER-ERROR",
              "500_NOT-CREATED",
              "500_NOT-UPDATED",
              "500_NOT-DELETED",
              "500_NOT-RETRIEVED",
              "500_SEARCH-ERROR",
              "500_USER_DATA_NOT_FOUND",
              "501_NOT-IMPLEMENTED-ERROR"
            ]
          },
          "inputId": {
            "type": "string"
          }
        }
      }
    }
  }
}
