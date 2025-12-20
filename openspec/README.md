# The OpenSpec Governance Framework

Welcome to OpenSpec, our framework for spec-driven development in this project.

## Core Philosophy

Our framework operates by partitioning documents by their **time dimension**, creating a clear separation between the **Future Vision** and the **Current Reality**.

---

### **Future Vision (What We Want to Be)**

*   `./vision.md`: **Product Vision**.
    *   From a **user's perspective**, this defines the high-level vision for the product, focusing on its core purpose and experience.
*   `./architecture.md`: **Architecture Blueprint**.
    *   From a **technical perspective**, this defines the ideal technical architecture and principles required to support the product vision.

### **Current Reality (What We Are Now)**

*   `./project.md`: **Project Snapshot**.
    *   An honest record of the project's **current** tech stack, implemented architecture, and development conventions.
*   `./specs/`: **Capability Specs Library**.
    *   The precise, single source of truth for the requirements of each **implemented** feature. `project.md` serves as a high-level summary of this.
*   `./docs/`: **Knowledge Artifacts Library**.
    *   A curated collection of technology-specific knowledge gained through research, implementation, and real-world problem-solving. Each artifact follows a standardized 6-part structure (Overview → API → Features → Application → Common Issues) and includes project-specific insights not available in generic documentation.

### **Bridging the Gap (How We Get There)**

*   `./roadmap.md`: **Feature Roadmap**.
    *   **Core Role**: To track and manage the core features planned to realize the `architecture.md` blueprint. It is the bridge between the Future and the Present.
*   `./changes/`: **Change Proposals**.
    *   The starting point for all concrete development work. Each proposal aims to implement a feature from the `roadmap`, thus moving the `project.md` one step closer to the `architecture.md`.
