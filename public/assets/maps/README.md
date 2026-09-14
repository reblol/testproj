# Map assets

Place competitive top-down map backgrounds here as optimized WebP files. The planner now groups the complete competitive catalog by mode:

- Domination: Hellfire Gala: Krakoa, Hydra Charteris Base: Hell's Heaven, Birnin T'Challa, Klyntar: Celestial Husk, Yggsgard: Royal Palace
- Convoy: Empire of Eternal Night: Midtown, Hellfire Gala: Arakko, Museum of Contemplation, Thebes, Tokyo 2099: Spider-Islands, Yggsgard: Yggdrasill Path
- Convergence: Empire of Eternal Night: Central Park, Hall of Djalia, K'un-Lun: Heart of Heaven, Klyntar: Symbiotic Surface, Lower Manhattan, Tokyo 2099: Shin-Shibuya

Use the lowercase `.webp` ids defined in `src/main.jsx` for filenames. Missing images fall back to the tactical surface.

Domination entries also expose three planner stages each. Stage labels are data-only until stage-specific images are provided; the parent map image remains the fallback board background.

Missing files automatically fall back to the tactical terrain placeholders already visible in the app.