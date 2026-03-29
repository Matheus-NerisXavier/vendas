# Guia de Sitemap: Busca Finder

Para que o Google encontre todas as suas páginas e produtos rapidamente, você precisa de um arquivo `sitemap.xml`.

## Como Gerar o Sitemap

Como este projeto é um MVP manual, você pode usar uma destas abordagens:

### 1. Sitemap Estático (Simples)
Crie um arquivo `public/sitemap.xml` com o seguinte conteúdo base:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seu-dominio.com/</loc>
    <lastmod>2026-03-29</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seu-dominio.com/catalog</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2. Sitemap Dinâmico (Recomendado para Escala)
Se o site crescer muito, recomendo usar um script que rode no build (ex: `vite-plugin-sitemap`) ou uma função que busque os IDs dos produtos no Supabase e gere o XML.

## Como Enviar para o Google
1.  Acesse o [Google Search Console](https://search.google.com/search-console).
2.  Verifique a propriedade do seu site.
3.  Vá em **Sitemaps** no menu lateral.
4.  Cole a URL do seu sitemap: `https://seu-dominio.com/sitemap.xml`.
5.  Clique em **Enviar**.

---
> [!TIP]
> O arquivo `robots.txt` que eu criei já aponta para este sitemap, ajudando o Google a encontrá-lo automaticamente!
