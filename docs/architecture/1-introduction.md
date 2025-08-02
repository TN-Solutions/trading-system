# 1. Introduction

This document outlines the complete fullstack architecture for the **AI-Powered Trading Support System**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

## 1.1. Starter Template or Existing Project

This project adopts a **hybrid-brownfield** approach:

*   **Frontend (Brownfield):** The user interface is built upon an **existing** foundation using Next.js, Shadcn-ui, and Tailwind CSS. This provides an established design system and UI development patterns.
*   **Backend (Greenfield Hybrid):** The backend is being built **from scratch** following a hybrid model:
    *   **BaaS (Backend-as-a-Service):** For core CRUD (Create, Read, Update, Delete) operations and authentication, the system will leverage **Supabase** to accelerate development and time-to-market.
    *   **Microservices:** For complex processing tasks or specialized business requirements in the future, separate APIs will be developed using **FastAPI (Python)**.

This approach allows for rapid launch by using managed services (Supabase) for common needs while retaining the flexibility to build custom, high-performance services as required.

---
