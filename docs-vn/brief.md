# Project Brief: AI-Powered Trading Support System

## Executive Summary

This project aims to build the "AI-Powered Trading Support System," a platform designed to revolutionize how retail traders analyze and improve their performance.

*   **Core Problem:** Traders, especially those in the learning and optimization phases, lack an effective tool to systematize their decision-making process, learn from past trades, and receive deeply personalized insights.
*   **Solution:** We will build an AI assistant that learns from the user's unique trading style. The MVP will be an "Interactive Analysis Report" platform, allowing users to easily log their analyses in a structured, visual way, creating the foundational dataset for AI training.
*   **Target Market:** "Serious Learners" and "Part-time Pros" among retail traders.
*   **Unique Selling Proposition (USP):** Instead of generic analysis, we provide 1-on-1 personalized insights and recommendations based on the user's own trading DNA.

---

## Problem Statement

Today's retail traders face a paradox: they have access to infinite data and tools but lack an effective process to consistently turn that information into performance improvement.

*   **Current State & Pain Points:**
    1.  **Manual, Disjointed Journaling:** Most traders either don't journal or use manual methods like notebooks or Excel. This is time-consuming, discouraging, and difficult to analyze systematically.
    2.  **Lack of Connection Between Analysis and Outcome:** It's hard for a trader to objectively answer, "Why did this trade win or lose?" They lack a tool to link their initial analysis (the "why") to the actual result.
    3.  **Information Overload, Lack of Personal Insight:** Existing tools provide generic indicators. They don't answer the most critical question: "Is this signal right for **my** specific trading style, risk tolerance, and psychological biases?"
*   **Impact:** This leads to a prolonged and costly cycle of trial and error, where traders repeat mistakes and fail to achieve sustainable progress.
*   **Why Existing Solutions Fall Short:** Current tools are often strong in one area (deep stats or good UI) but fail to combine easy, visual journaling with a deeply personalized AI feedback loop.

---

## Proposed Solution

We propose building an **AI-Personalized Trading Assistant**. This is a smart web platform that acts as a "second brain" for the trader, helping them systematize their process, learn from experience, and make better decisions.

*   **Core Concept:** The platform will begin by helping users build a proprietary dataset of their own trading decisions through an **"Interactive Analysis Report"**. This report is built from dynamic blocks, allowing for multi-timeframe analysis in a single, cohesive view. Each block has a chart for visual analysis and a dedicated notes section. A "main" block is used for the final trade decision and details. This data will then be used to train AI (LLM) models, creating a smart, personalized feedback loop.
*   **Key Differentiators:**
    1.  **Learns From You:** Our AI learns from *your* analyses, decisions, wins, and losses to find opportunities that fit *your* unique trading DNA.
    2.  **User Experience First:** We prioritize a seamless, visual, and even enjoyable journaling process. The block-based, chart-centric report is key to this experience.
    3.  **Clear Evolutionary Path:** The product evolves from a smart journal (MVP) to a proactive analyst, and eventually to a trusted automation system.
*   **Long-term Vision:** To become an indispensable platform for every serious retail trader, helping them shift from emotional, gut-feel trading to data-driven decision-making.

---

## Target Users

**Primary Segment: "The Serious Learner"**
*   **Profile:** Traders with <2 years of experience, actively seeking a consistent methodology.
*   **Needs:** A structured framework for analysis and logging; a way to control emotion and build confidence.

**Secondary Segment: "The Part-time Pro"**
*   **Profile:** Profitable but inconsistent traders who trade alongside a primary job.
*   **Needs:** Time-saving automation and tools to find and fix small, performance-impacting leaks in their strategy.

---

## Goals & Success Metrics

*   **Business Objectives:**
    -   Acquire **500 weekly active users** within 3 months of MVP launch.
    -   Achieve a **5%** user-to-paid-subscriber conversion rate within 6 months.
    -   Collect **2,000+** high-quality Analysis Reports within 6 months for AI training.
*   **User Success Metrics:**
    -   **Habit Formation:** Top 25% of active users create 3+ reports per week.
*   **KPIs:**
    -   **Retention:** Achieve a **20% Week 4 retention rate**.
    -   **Feature Adoption:** The average report contains at least 2 different timeframe blocks.

---

## MVP Scope

**Core Features (Must Have):**
*   User Authentication.
*   A dashboard to manage (CRUD) Analysis Reports.
*   The **Interactive Analysis Report** feature, including the dynamic block system, integrated charting with **Trendline** and **Rectangle** tools, and dedicated note-taking areas.
*   Reliable data persistence for all user-generated content.

**Out of Scope for MVP:**
*   All AI/LLM features.
*   Advanced statistical dashboards.
*   Social/community features.
*   Broker integrations.
*   Native mobile apps.
*   Advanced drawing tools.
*   Notifications and alerts.

---

## Post-MVP Vision

*   **Phase 2 (The AI Analyst Assistant):** Use the collected data to provide personalized insights, automated analysis drafts, and performance coaching.
*   **Long-term Vision (1-2 Years):** Evolve into an AI-first platform where users manage their AI assistant. Introduce optional trade automation and deep broker integrations.
*   **Expansion Opportunities:** A marketplace for sharing AI models/templates; an institutional offering for prop firms.

---

## Technical Considerations

*   **Platform:** Web-app, desktop-first, built on the existing **Next.js** project.
*   **Backend:** A hybrid architecture. **Supabase** will be used for core CRUD operations (user auth, report storage) to accelerate MVP development. **Python (FastAPI)** will be reserved for future complex tasks like AI model integration.
*   **Database:** Supabase's **PostgreSQL**.
*   **Architecture:** BaaS (Supabase) combined with FaaS/Microservices (FastAPI) for future needs.
*   **Security:** Leverage Supabase's built-in security, including Row Level Security, to ensure data isolation and privacy from day one.

---

## Constraints & Assumptions

*   **Constraints:** A tight MVP timeline of **3-4 months** and a small initial team. Must build upon the existing Next.js codebase.
*   **Key Assumptions:**
    -   Users perceive current journaling methods as a significant pain point.
    -   A visual, chart-centric interface is a compelling differentiator.
    -   Users are willing to provide detailed data in exchange for future value.
    -   A percentage of free users will convert to paid plans for AI features.

---

## Risks & Open Questions

*   **Key Risks:**
    -   **User Adoption Risk:** Users may not find the process easy or valuable enough to switch habits.
    -   **Data Quality Risk:** Users may submit incomplete or "lazy" data, harming future AI training.
    -   **Technical Risk:** Building the interactive report interface may be more complex than anticipated.
*   **Open Questions:**
    -   What is the optimal pricing model and price point for Phase 2?
    -   What are the most effective, low-budget marketing channels to reach our target users?
    -   What gamification or engagement loops are needed to ensure the product is "sticky"?
    -   What are the specific legal requirements for handling sensitive user financial data?
