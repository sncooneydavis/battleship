# Notes

## Log

## First pass generation of code

- 16 total hours
- Architected with Claude Opus
- Tests and code generated with OAI Codex

### Issues

- Event bus vs. Node Event Emitter use inconsistent (Codex did not integrate information from Integration_Protocol for the first 5 modules)
- No HTML generated; user-initialized DOM events not taken into account
- Some overlapping functionality (to be expected)
- Some functionality and variables unused -- artifact of over-engineered arch procedure

#### GameController

- initializeGame() missing random ship placement
- Board never set up for user dragging and dropping
- set up process unclear: was never specified if there was images that must be dropped into place, if coordinates were generated randomly, etc.

## For Future

### Architecture

- Should be file organization, modules, MVP, functionality/rules per file.
- May define what data is stored where.
- NOT API contracts, specific data structures etc.
