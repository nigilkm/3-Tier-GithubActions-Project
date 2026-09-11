# Three-Tier Node.js App — GitHub Actions + Kubernetes Learning Project

## Architecture
- **Presentation tier**: `frontend/` — static HTML/JS served by nginx
- **Application tier**: `backend/` — Express REST API (`/api/items`, `/health`)
- **Data tier**: MongoDB (via `mongodb-memory-server` in tests, a real `mongo` container in k8s)

## Run locally
```bash
cd backend && npm install && npm run dev     # needs MONGO_URI or local mongo
cd frontend && npm install                   # then open public/index.html via any static server
```

## Run tests
```bash
cd backend
npm run lint
npm run test:unit          # model validation, no DB
npm run test:integration   # full HTTP + in-memory Mongo
npm test                   # everything + coverage
```

## Docker
```bash
docker build -t three-tier-backend ./backend
docker build -t three-tier-frontend ./frontend
```

## Kubernetes
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```
Update the `image:` fields in `k8s/backend-deployment.yaml` and
`k8s/frontend-deployment.yaml` to point at your registry (`OWNER` placeholder),
or let the CI/CD pipeline do it automatically via `kubectl set image`.

## CI/CD pipeline (`.github/workflows/ci-cd.yaml`)
1. **lint** — ESLint on both tiers
2. **unit-tests** — Jest model/unit tests, no DB
3. **integration-tests** — Jest + Supertest against a real Mongo service container, with coverage upload
4. **dependency-audit** — `npm audit`
5. **codeql** — GitHub CodeQL static analysis (SAST)
6. **build-and-push** — Docker Buildx, pushes to GHCR, tagged by commit SHA
7. **image-scan** — Trivy vulnerability scan of built images, results in the Security tab
8. **k8s-manifest-lint** — `kubeconform` validates all manifests against the k8s schema
9. **deploy** — applies manifests and does a rolling image update on `main`, gated behind a `production` environment (add required reviewers there for a manual approval gate)

## Required repo secrets
- `KUBE_CONFIG` — base64-encoded kubeconfig for your cluster (`cat kubeconfig | base64 -w0`)
- `GITHUB_TOKEN` is provided automatically for GHCR push

## Notes for learners
- `k8s/secrets.yaml` uses plaintext `stringData` for simplicity — in real projects use `kubectl create secret` or a secret manager instead of committing credentials.
- Swap the Ingress `host` in `k8s/ingress.yaml` for your real domain, and add TLS via cert-manager if needed.
