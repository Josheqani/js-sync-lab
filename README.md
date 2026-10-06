# JS Sync vs Async Lab ⚡

An interactive educational visualizer demonstrating the fundamental difference between **Synchronous** and **Asynchronous** execution in JavaScript.

Built with **Bun**, **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Features

- **Read-Only Live Code Panel:**
  - Syntax highlighted code viewer.
  - Active line highlighter that dynamically moves/swaps to demonstrate JavaScript execution flow.
  - Quick toggle button to place the code on the **Left** or **Right** side.
- **Side-by-Side Comparison Mode:**
  - View Synchronous execution and Asynchronous execution side-by-side in parallel.
  - Watch Synchronous move sequentially (1 → 2 → 3 → 4 → 5) while Asynchronous skips ahead (1 → 2 → 5) and returns to the callback (→ 3)!
- **JavaScript Engine Architecture Visualizer:**
  - **Call Stack:** Single-thread LIFO execution frame tracker.
  - **Browser Web APIs:** Background timers and background pool with live countdown progress.
  - **Microtask Queue:** High-priority Promise / queueMicrotask queue.
  - **Task (Macrotask) Queue:** Standard timer / callback queue.
  - **Event Loop Monitor:** Visual indicator tracking thread readiness and task dispatch.
- **Interactive Console / Stdout:**
  - Chronological output logging with `[SYNC]`, `[ASYNC]`, and `[MICROTASK]` origin badges.
- **Educational Scenarios Included:**
  1. **Asynchronous: setTimeout() Delay:** Demonstrates non-blocking registration, jumping ahead, and queue callback execution.
  2. **Synchronous: Step-by-Step:** Shows sequential blocking line-by-line execution.
  3. **The 0ms Myth (setTimeout 0ms):** Visual proof of why 0ms delay still executes after synchronous code.
  4. **Microtasks vs Macrotasks:** Deep dive into Promise priority vs setTimeout.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js (v18+)

### Installation & Run

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Auto Play / Pause |
| `→` (Right Arrow) | Step forward |
| `←` (Left Arrow) | Step backward |
| `R` | Reset to beginning |

---

## 🛠️ Tech Stack

- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Build Tool:** [Vite](https://vite.dev/)
- **UI Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
