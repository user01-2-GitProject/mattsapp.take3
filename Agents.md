# AI Agent Operating Guidelines & Project Context

This file defines the operational standards, technology stack, and architectural patterns for repositories managed or assisted by AI agents. All AI agents, automated systems, and collaborative coding assistants must adhere to these guidelines to ensure consistency, code quality, and proper human oversight.

---

## 1. Core Operating Philosophy
- **Human-in-the-Loop:** The human operator maintains final authority over all architectural decisions, deployments, domain configurations, and destructive actions. 
- **Explicit Approval Checkpoints:** Never execute live database migrations, production deployments, or DNS modifications without explicit confirmation.
- **Incremental Progress:** Write modular, well-tested, and clean code. Avoid monolithic changes or breaking existing working states.

---

## 2. Technology Stack Standards

### Frontend & UI
- **Frameworks & Libraries:** React, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Design Aesthetic:** Clean, modern, responsive interfaces; mobile-first design patterns. Avoid unnecessary bloat.

### Backend, Database & Cloud
- **Hosting & Edge Routing:** Firebase, Google Cloud Console
- **Databases:** Google cloud, Firebase
- **Version Control:** Git & GitHub (maintain clean commit histories and descriptive messages)


---

## 3. Code Quality & Architecture Rules
1. **TypeScript First:** Ensure all new code utilizes strict TypeScript typing. Avoid `any` types unless absolutely necessary and documented.
2. **Modular Components:** Keep components small, reusable, and single-purpose. Separate business logic from UI presentation.
3. **Environment Security:** Never hardcode API keys, secrets, or database credentials. Always use `.env` files and environment variables managed via platform dashboards (Cloudflare/Vercel/Firebase).
4. **Error Handling:** Implement graceful error handling and user-friendly fallback states for all asynchronous operations and API calls.

---

## 4. Communication & Task Execution Style
- **Direct & Concise:** Provide clear, actionable answers without fluff or filler phrasing.
- **Step-by-Step Transparency:** When tackling complex multi-file features or debugging, outline the plan clearly before executing changes.
- **Context Preservation:** Respect established project naming conventions, directory structures, and file layouts across repositories.
