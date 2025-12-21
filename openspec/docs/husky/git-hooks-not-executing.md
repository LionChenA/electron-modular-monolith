---
title: "Husky Git Hooks not executing due to missing shebang"
tags: [troubleshooting, husky]
# List of official Context7 documentation IDs used as primary sources.
sources:
  - id: "/typicode/husky"
# List of NPM packages from this ecosystem that are USED in our project.
packages:
  - id: "husky"
    description: "Git hooks management tool"
---

# Problem: Husky Git Hooks not executing due to missing shebang

## Problem Description
Git hooks configured with Husky are not executing, commonly manifested as:
- Pre-commit hook not running lint checks
- No scripts triggered during commit

## Incorrect Example

**Missing shebang:**
```bash
# .husky/pre-commit file content
pnpm biome check --cached
```

## Correct Example

**Add shebang to hook file:**
```bash
# .husky/pre-commit
#!/usr/bin/env sh

pnpm biome check --cached
```

## Explanation
- **Shebang requirement**: In some versions of Husky, hooks require a shebang line (`#!/usr/bin/env sh`) to execute properly
- **Post-Husky v9 change**: In later versions of Husky, the environment loading code (`. "$(dirname -- "$0")/_/husky.sh"`) is no longer necessary
- **Minimal format**: Modern Husky hooks only need the shebang and the command to execute
- **Cross-platform compatibility**: Using `#!/usr/bin/env sh` ensures the script works across different Unix-like systems

## Related Resources
- [Husky GitHub](https://github.com/typicode/husky)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Husky Usage Guide](https://typicode.github.io/husky/#/?id=usage)
