# 📝 Reactive Notes

A full-stack notes web application built with **React** and **Express**, featuring rich text editing, secure authentication, and folder organization.


## 🚀 Project Vision & Purpose

`reactive-notes` was created to learn React , React-Router and  modern full-stack web development. By building a feature-rich note-taking platform from scratch, this project focuses on:

- Managing complex user states and persistent client-server syncing.
- Securing application endpoints and view states via robust routing.
- Implementing an extensible, block-based rich text editor.


## 🏁 Getting Started

This project uses **Bun** for fast package management and execution. Follow the instructions below to set up your local development environment.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine. If not, you can install it using:

```bash
  curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash

  # Clone the Repo

  # Setup Postgresql, create psql user and database. See Postgresql
  # documentation for this.
  # create .env file and Insert the required variables

  cd reactive-notes/server
  bunx --bun prisma migrate dev & bunx --bun pirsma generate
  bun install && bun run dev

  # open new terminal tab
  cd reactive-notes/client
  bun install && bun run dev
```


## 🛠️ Tech Stack & Architecture

### **Monorepo Structure**

The project uses a clean, two-folder monorepo architecture with independent environments for the frontend and backend:

```text
reactive-notes/
├── client/          # Frontend  Application (React, React-router Vite, Tailwind)
│   ├── package.json
│   └── src/
└── server/          # Backend REST API (Node.js, Express, Passport.js)
    ├── package.json
    └── src/

```

## ✨ Core Features ( In progress)

- ✅ TipTap Rich Text Editor
- [ ] Folder Organization (Planned)
- [ ] User Accounts & Passport.js Auth (Planned)
- [ ] Note Encryption (Planned)

### 📁 Folder Organization

- **Hierarchical Structures:** Keep your workspace tidy by organizing notes into structured folders.
- **Dynamic Navigation:** A responsive sidebar built with `shadcn/ui` primitives to seamlessly jump between directories and specific notes.

### 👤 Secure User Accounts

- **Robust Authentication:** Powered by Express and Passport.js to ensure secure user registration, login, and session persistence.
- **Protected Routing:** Frontend views are guarded using React Router to guarantee that private notes are only accessible to verified accounts.

### 🔐 Note Encryption

- **Privacy First:** Secure sensitive notes using a cryptographic layer so your data remains private and protected.

### ✍️ Advanced Rich Text Workspace

- **TipTap Editor Integration:** A beautiful, highly customizable rich text editor experience.
- **Formatting Support:** Includes real-time headings, lists, code blocks, bold/italic text, and modern typographic features.

