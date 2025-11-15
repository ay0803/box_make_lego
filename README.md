# box_make_lego

Simple Three.js playground to place multiple rectangular blocks by JSON.

**What’s Inside**
- Minimal Three.js scene (CDN) with lights and grid
- JSON-driven block layout (sizes/positions)
- In‑page editor (textarea + SEND) to live‑update layout
- Stable color palette (LEGO‑inspired) with deterministic pick

**Run Locally**
- Open `index.html` in your browser, or serve statically:
  - `python3 -m http.server` and open the shown URL

**Edit Blocks (UI)**
- Top‑left panel shows the current JSON. Edit and click `SEND`.
- On success, scene clears and re‑renders from the JSON.
- Parse errors show in red next to the button.

**JSON Schema**
- Recommended (paired arrays):
```
{
  "sizes": [[10,10,20], [20,5,10], [10,10,20], [10,5,50]],
  "positions": [[-22,0,0], [0,0,0], [22,0,0], [0,15,22]]
}
```
- Also supported (explicit list):
```
{
  "blocks": [
    { "size": [10,10,20], "position": [-22,0,0] },
    { "size": [20, 5,10], "position": [  0,0,0] },
    { "size": [10,10,20], "position": [ 22,0,0] },
    { "size": [10, 5,50], "position": [  0,15,22] }
  ]
}
```
- Optional: each block can include `"color": 0xC91A09`. If omitted, a palette color is picked deterministically.

**Repo Setup (Git/GitHub)**
- Initialize and push (SSH):
```
git init
git add .
git commit -m "three.js blocks + JSON editor"
git branch -M main
git remote add origin git@github.com:ay0803/box_make_lego.git
git push -u origin main
```
- Or HTTPS (use a Personal Access Token for the password prompt):
```
git remote add origin https://github.com/ay0803/box_make_lego.git
git push -u origin main
```

**GitHub Pages**
- In the repo: Settings → Pages → Branch: `main`, Folder: `/root` → Save
- After a few minutes, it should be live at:
  - https://ay0803.github.io/box_make_lego/

**Notes**
- Colors come from a LEGO‑inspired palette and remain stable for the same size/position set.
- To hard‑lock colors, include `"color"` per block in the JSON.
