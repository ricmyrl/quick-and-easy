# Project Guidance

- This is a React 19 and Vite application written in JavaScript.
- Use `npm run dev` to start the app, `npm run build` to build it, and `npm run lint` to run Oxlint.
- Keep UI components in `src/components`, shared task logic in `src/utils/tasks.js`, and task state in `src/stores/taskStore.js` (Zustand).
- Follow the existing component and CSS patterns. Keep changes focused and avoid adding dependencies unless the task requires them.
- Do not commit generated `dist` or `node_modules` files.
