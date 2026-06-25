# Supermotors Shop Website

Modern responsive one-page website for **Supermotors Shop**, an auto service and auto parts company.

The site is built with plain HTML, CSS, and JavaScript. It includes English and Georgian language support, service cards, contact links, Facebook link, and an embedded Google Map.

## Files

- `index.html` - page markup and content
- `style.css` - responsive layout and visual styling
- `script.js` - language switcher translations
- `mnt/data/shop.png` - logo image
- `mnt/data/cover shop.png` - cover/hero image

## Run Locally

From the project folder, run:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8080/
```

To stop the local server:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080 -State Listen).OwningProcess
```

## Update Content

Replace these values in `index.html` when the final business details are ready:

- Phone number in `tel:` links and visible contact text
- Facebook URL
- Google Maps iframe URL
- Address text

Update translations in `script.js` if service names or text change.

## Media Note

The local video file `mnt/data/sm mj final.mp4` is intentionally ignored by Git because it is too large for GitHub. The website still works without it because the cover image is used as a fallback visual.
