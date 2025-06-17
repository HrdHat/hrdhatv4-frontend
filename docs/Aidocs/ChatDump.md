1. Components layer is “globalised”
   src/styles/components/index.css imports every component stylesheet globally.
   That breaks the pluggable-component rule (CSS survives even if the component is unused).
   Legacy monoliths live in the components layer
   form-editor.css, photo-module.css, signature-module.css are huge, multi-concern files.
   They mix layout, colour, and old hex codes.
   Example “bad” files sit inside styles/examples/
   Fine for learning, but they ship with production bundles unless excluded.
   They also import layers in the wrong order on purpose.
   Empty or thin layers
   tools/, utilities/ have placeholder files only.
   generic/index.css is just a body margin reset.
   Missing settings files for radius, shadows, breakpoints, motion, z-index, etc.
   Token gaps / duplicates
   Spacing scale stops at --space-6.
   No border-radius or shadow tokens.
   Typography tokens split between \_colors.css and \_typography.css.
   Import order vs. pluggability
   src/styles/index.css still pulls in components/index.css, re-introducing global styles.
   CLEAN-UP PLAN
   PHASE A — Token foundation
   Create new settings files: \_radii.css, \_shadows.css, \_breakpoints.css, \_motion.css, \_zindex.css.
   Extend \_spacing.css to --space-8 (4 → 64 px).
   Move font tokens out of \_colors.css into \_typography.css.
   PHASE B — Layer scaffolding
   Populate tools/ with mixins (clearfix, screen-reader-only, media helpers).
   Add real reset / normalize rules to generic/.
   Flesh out utilities/ (e.g., .text-center, .m-1, .sr-only).
   PHASE C — Component isolation
   Delete src/styles/components/index.css; stop importing it in styles/index.css.
   For each component:
   Move its CSS into the component folder (if not already).
   Import locally (import './button.css';).
   Remove its @import from the old components index.
   Split form-editor.css into:
   FieldContainer/field-container.css
   TaskHazardControl/task-hazard-control.css
   etc.
   Then delete the monolith.
   PHASE D — Purge & polish
   Remove styles/examples/ from the build (or relocate to docs).
   Search for raw hex codes outside settings/; convert to tokens.
   Run Stylelint with ITCSS rules to catch stray selectors.
   PHASE E — Documentation & CI guard
   Update components-and-styling.md with the new token files.
   Add a lint script to CI that fails on global component imports or hex codes.
   NEXT ACTION IF YOU AGREE
   • I can start with PHASE A: scaffold the missing settings files and extend spacing.
   (That’s purely additive—no risk of breaking visuals.)
   After that, we move to PHASE C and migrate one component at a time.
   Let me know if that approach works or if you’d like changes to priority or token values.
