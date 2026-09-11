## 2025-05-18 - API Key Exposure in URL Query Strings & Unbounded Input Length

**Vulnerability:** API key was being passed directly as a URL query parameter (`?key=${activeKey}`) in external API fetch calls to Gemini, and user search queries lacked input length bounds.
**Learning:** Passing credentials in URL query strings exposes sensitive secrets in HTTP request logs, browser histories, and proxy server logs (CWE-598). Additionally, unbounded input fragments allow excessively large payloads to be processed by LLM adapters and regular expressions, posing DoS risks.
**Prevention:** Always transmit secrets via secure HTTP request headers (e.g., `x-goog-api-key`) rather than URL query parameters, and enforce strict input validation bounds on user query strings before passing them downstream.
