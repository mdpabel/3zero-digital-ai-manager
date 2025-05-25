# 3Zero Digital AI Manager 🤖

**AI-powered work log evaluator for all 3Zero Digital team members**  
Built by [3Zero Digital](https://3zerodigital.com) — committed to **0 Vulnerability, 0 Downtime, 0 Error**.

---

## 🧠 What is this?

The **3Zero Digital AI Manager** is an internal tool designed to evaluate daily work logs submitted by employees across all departments.  
Whether you're in development, marketing, support, or management — this AI manager helps track and assess daily productivity in a structured, unbiased way.

It gives:

- 🧾 Clear summaries of daily work
- 📈 Strict evaluations based on impact, urgency, and alignment with company goals
- 🎯 A numeric score (1–10) to reflect daily performance

Powered by GPT-4o with deep context awareness of company performance, timelines, and goals.

---

## 🛠️ Features

- ✅ Smart AI-based feedback on daily submissions
- 📊 Context-aware evaluation (timeline + company status)
- 📅 Tracks progress since join date
- 🔒 Secure access via Clerk
- 🗄️ Stores and visualizes work log history (coming soon)

---

## ⚙️ Tech Stack

- Next.js (App Router, Server Actions)
- TypeScript
- Prisma + PostgreSQL
- Clerk Authentication
- OpenAI GPT-4o
- Tailwind CSS UI

---

# Clone the repo

git clone https://github.com/your-username/3zero-ai-manager.git

# Go into the project directory

cd 3zero-ai-manager

# Install dependencies

pnpm install

# Set environment variables

cp .env.example .env

# Then edit the .env file with OpenAI key, Clerk credentials, DB, etc.

# Start the dev server

pnpm dev
