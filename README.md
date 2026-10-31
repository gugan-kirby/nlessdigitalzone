# N'LESS Digital Zone — one-page site

Static site: `index.html`, `css/style.css`, `js/main.js`. No build step — open
`index.html` in a browser or upload the folder to any static host.

Content comes from the main N'LESS site in the parent folder (home, about and
contact pages), laid out in the dark-purple agency design.

## Before going live — fill in the placeholders

Same placeholders as the main site; search for `[[`:

| Placeholder | Replace with | Example |
|---|---|---|
| `[[PHONE]]` | Phone number, display format | `+91 98765 43210` |
| `[[WHATSAPP]]` | WhatsApp number, **digits only**, with country code | `919876543210` |
| `[[EMAIL]]` | Email address | `hello@nlessdigital.in` |
| `[[INSTAGRAM]]` | Full Instagram URL | `https://instagram.com/nlessdigitalzone` |
| `[[FACEBOOK]]` | Full Facebook URL | `https://facebook.com/nlessdigitalzone` |
| `[[CITY]]` | City / area | `Coimbatore, Tamil Nadu` |
| `[[DOMAIN]]` | Live domain, no trailing slash (used for the OG image) | `https://nlessdigital.in` |

```bash
cd digital-agency
replace () { grep -rl "\[\[$1\]\]" . --include='*.html' | xargs sed -i '' "s|\[\[$1\]\]|$2|g"; }
replace PHONE "+91 98765 43210"   # …and so on for each placeholder
grep -c "\[\[" index.html          # should print 0
```

## Left empty on purpose

**Results** ("Real doctors. Real numbers.") shows an "Awaiting your content"
box. Replace the `.awaiting` block in `index.html` with 2–3 real client
outcomes. Never fabricate testimonials — NMC penalises exactly that.

## Contact form

No backend. The audit form validates, then opens WhatsApp with the enquiry
pre-filled, so nothing is stored on the website. "Start with <plan>" buttons
pre-fill the plan name in the message box.

## Look & feel

Brand colours are CSS custom properties at the top of `css/style.css`
(`--brand`, `--brand-lift`, `--accent`). Font: Poppins (Google Fonts).
