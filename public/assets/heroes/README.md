# Hero assets

Place Marvel Rivals hero icons here as PNG files. The current Season 10-ready roster expects filenames with the `lord-` prefix, generated from each hero name. Examples:

`lord-luna-snow.png`, `lord-magneto.png`, `lord-gorr-the-god-butcher.png`, `lord-the-punisher.png`, and `lord-jeff-the-land-shark.png`.

The roster is configured in `src/main.jsx` so tournament-specific additions can be made without changing the planner UI. Missing files automatically fall back to the colored initials already visible in the app.