# Pokédex

The existing React Pokédex, migrated from Create React App to Vite for supported
Node 24 builds. Pokemon data still comes from the public PokeAPI. Fonts are
bundled locally. Search, filters, pagination and direct `/pokemon/:id` routes
are preserved. Use `npm ci --ignore-scripts`, `npm audit --audit-level=moderate`
and `npm run build`. `npm start` serves local development.

The stateless non-root Docker image listens on 8080. Production CI builds and
exercises the read-only image before issuing an immutable exact-commit receipt.
Coolify uses the guarded homelab release controller; native unchecked push
promotion stays off. Validate staging and a direct Pokemon route before changing
Cloudflare. Retain Netlify for reversible rollback until public checks pass.

Source provenance was checked against the live Netlify source map: all nine
application source modules exactly match repository revision 901fd6a9. SVG map
entries are generated webpack modules, rather than original SVG source text.
The old yarn/CRA toolchain is retired with its scripts; Git history retains it.


Production now runs on the verified Coolify app at https://pokedex.alexcretu.com. Netlify automatic builds are skipped; a hook-triggered build also stops before publishing. The old static deployment is retained temporarily for rollback. To roll back hosting, first review the saved DNS export and explicitly revert the build shutdown; Coolify and Cloudflare are the deployment targets.
