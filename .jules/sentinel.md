## 2026-09-10 - Secure Gemini API Key Transmission & Input Constraints
**Vulnerability:** Gemini API keys were appended to the request endpoint URL (`?key=${activeKey}`) in the client gateway adapter, and search queries lacked input length bounds.
**Learning:** Passing credentials in URL query parameters exposes API keys in proxy/server logs, browser history, and HTTP Referer headers.
**Prevention:** Always pass API keys via request headers (`x-goog-api-key`) and validate/limit input lengths on search/recon endpoints before processing.
