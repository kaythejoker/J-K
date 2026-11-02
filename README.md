# J&K Solutions

Site institucional e de captação de contactos. HTML, CSS e JavaScript puros, sem instalação nem build.

## Ver no computador

```bash
npx serve . -l 4173
```

Depois abra http://localhost:4173.

## Publicar

Basta enviar a pasta para qualquer alojamento estático (Vercel, Netlify, Cloudflare Pages).

## Onde alterar

| O quê | Ficheiro |
| --- | --- |
| Telefone, WhatsApp, e-mail e cidade | `js/config.js` |
| Textos das secções | `index.html` |
| Guião da demonstração | `js/main.js` |
| Cores, tipos de letra e layout | `css/style.css` |

O formulário não guarda dados: prepara uma mensagem e abre o WhatsApp.
