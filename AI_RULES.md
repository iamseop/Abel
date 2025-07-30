# AI Development Rules for Abel Co. App

This document outlines the core technologies and coding practices to be followed when developing the Abel Co. investment fintech application.

## Tech Stack Overview

*   **Frontend Framework:** React.js for building dynamic and interactive user interfaces.
*   **Language:** TypeScript for enhanced code quality, type safety, and better developer experience.
*   **Build Tool:** Vite for a fast and efficient development environment and optimized builds.
*   **Styling:** Tailwind CSS for utility-first, responsive, and highly customizable styling.
*   **UI Components:** shadcn/ui (built on Radix UI) for accessible and customizable pre-built UI components.
*   **Icons:** Lucide React for a consistent and extensive set of SVG icons.
*   **Routing:** React Router for declarative client-side routing.
*   **Backend/Database/Analytics:** Firebase for backend services, including Firestore for database and Analytics for tracking.

## Library Usage Guidelines

*   **React:** All UI logic and components should be built using React functional components and hooks.
*   **TypeScript:** All new files must be `.tsx` or `.ts`. Existing JavaScript files should be migrated to TypeScript when modified significantly.
*   **Tailwind CSS:** Prioritize Tailwind utility classes for all styling. Custom CSS should be minimal and only used for highly specific, complex styles not achievable with Tailwind.
*   **shadcn/ui & Radix UI:** Utilize shadcn/ui components for common UI patterns (buttons, forms, modals, etc.). Do not modify the source files of shadcn/ui components directly; if customization is needed beyond props, create a new component that wraps or extends the shadcn/ui component.
*   **Lucide React:** Use Lucide React for all icons throughout the application.
*   **React Router:** Manage all application routes within `src/App.tsx` using React Router. Avoid custom state-based routing for page navigation.
*   **Firebase:** Interact with Firebase services (Firestore, Analytics) through the initialized `db` and `analytics` instances from `src/firebase.js`. Ensure API keys and sensitive information are handled securely (e.g., via environment variables).

## General Coding Practices

*   **File Structure:**
    *   `src/pages/`: For top-level views/pages.
    *   `src/components/`: For reusable UI components.
    *   `src/hooks/`: For custom React hooks.
    *   `src/types/`: For TypeScript type definitions.
*   **Component Granularity:** Create small, focused components (ideally under 100 lines of code). Refactor large components into smaller, more manageable pieces.
*   **Responsiveness:** All designs must be responsive and work well across various screen sizes (mobile, tablet, desktop) using Tailwind's responsive utilities.
*   **Error Handling:** Allow errors to bubble up naturally unless specific user-facing error messages or recovery mechanisms are explicitly required.
*   **Simplicity & Elegance:** Strive for the simplest and most elegant solution. Avoid over-engineering.
*   **No Partial Changes:** All code changes should be complete and fully functional.