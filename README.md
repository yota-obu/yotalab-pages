# yotalab-pages

Public pages for yotalab apps, served via GitHub Pages at **https://yotalab.tech/**.

## Structure

```
yotalab-pages/
├── index.html                                # Landing (https://yotalab.tech/)
├── CNAME                                     # Custom domain config
├── assets/
│   └── english-karuta-icon.png               # App icon
├── apps/
│   ├── index.html                            # App gallery
│   └── english-karuta/
│       ├── index.html                        # App detail page
│       └── privacy.html                      # Privacy policy
└── english-karuta/
    └── privacy.html                          # Redirect (old URL → new)
```

## Pages

- **Home**: https://yotalab.tech/
- **Apps**: https://yotalab.tech/apps/
- **英単語かるた**: https://yotalab.tech/apps/english-karuta/
- **英単語かるた Privacy Policy**: https://yotalab.tech/apps/english-karuta/privacy.html

## Setup

1. GitHub Pages is enabled on `main` branch, root folder.
2. Custom domain `yotalab.tech` is configured via CNAME file and DNS A records.
3. HTTPS is enforced.
