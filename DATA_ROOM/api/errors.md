# API Error Schema

Standard HTTP status codes and JSON error structure used across TraderCopilot API.

## Error Format

```json
{
  "detail": "Detailed error message describing the cause."
}
```

## Common Error Codes

| Status Code | Code Name | Description | Example Cause |
|---|---|---|---|
| **400** | Bad Request | Invalid input parameters or schema validation failure. | Missing `token` field, invalid `timeframe`. |
| **401** | Unauthorized | Missing or invalid Bearer token. | Accessing protected routes without login. |
| **403** | Forbidden | Insufficient permissions (RBAC). | User trying to access Admin endpoints. |
| **404** | Not Found | Resource does not exist. | Requesting analysis for unknown strategy ID. |
| **429** | Too Many Requests | Rate limit exceeded. | Free plan user exceeding daily quota. |
| **500** | Internal Server Error | Unhandled backend exception. | Database connection failure, AI provider outage. |
| **503** | Service Unavailable | External service down. | News provider or Exchange API timeout. |

## Specific Error Messages

- **"Inactive Strategy"**: Trying to fetch signals from a disabled strategy.
- **"Feature Quota Exceeded"**: User has hit their daily limit for Lite/Pro analysis.
- **"Coherence Guard Active"**: Signal rejected due to conflicting direction in short timeframe.
