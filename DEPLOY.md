# Deploy — followers-web

Tag-based deploy to a VPS. GitHub Actions builds the image and pushes to
GHCR; the VPS pulls and rolls the container.

## How it deploys

| Tag pattern | Target | Workflow | Image |
|---|---|---|---|
| `v*` | Production | `deploy-prod.yml` | `ghcr.io/rizjamiputera/followers-web:v1.8.5` + `:latest` |
| `stg-*` | Staging | `deploy-stg.yml` | `ghcr.io/rizjamiputera/followers-web:stg-0.1.0` + `:stg-latest` |

Flow per deploy: build verification → build+push image → SSH to VPS →
pre-flight env check → `docker compose pull && up -d`.

## Release commands

```bash
# Production
git checkout main && git pull
git tag v1.8.6 && git push origin v1.8.6

# Staging
git checkout stg && git pull
git tag stg-0.1.0 && git push origin stg-0.1.0
```

## VPS bootstrap (one-time per environment)

```bash
sudo mkdir -p /opt/followers/followers-web
sudo chown $USER:$USER /opt/followers/followers-web
cd /opt/followers/followers-web
git clone git@github.com:rizjamiputera/followers-web.git .

cp .env.production.example .env.production
# edit if URIs differ from defaults
```

For staging, repeat with `.env.staging`.

GHCR access (if private): `docker login ghcr.io -u rizjamiputera`.

## Required GitHub secrets

| Secret | Value |
|---|---|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | private SSH key |
| `VPS_PORT` | `22` |
| `PROJECT_DIR` | optional; defaults to `/opt/followers/followers-web` |

## Rollback

```bash
# On VPS
cd /opt/followers/followers-web

PREV=v1.8.4
git fetch --tags
git checkout "$PREV"

set -a; . ./.env.production; set +a
export WEB_IMAGE_TAG="$PREV"

docker compose -f docker-compose-production.yml pull web-followers
docker compose -f docker-compose-production.yml up -d
```

Staging is the same with `docker-compose-staging.yml`, `.env.staging`,
and `STG_WEB_IMAGE_TAG`.

## Monitoring (Uptime Kuma)

Reuse the existing `quran-uptime-kuma` container on the VPS at
`127.0.0.1:3030`. SSH-tunnel to the UI:

```bash
ssh -L 3030:127.0.0.1:3030 deploy@VPS_HOST
# open http://localhost:3030
```

Add HTTP monitors:

| Name | URL | Interval |
|---|---|---|
| followers-web prod | `https://followersbicara.com` | 60s |
| followers-web stg  | `https://stg.followersbicara.com` | 300s |

## Debugging

```bash
docker compose -f docker-compose-production.yml logs --tail=200 web-followers
curl -sI http://localhost:3333
```

The web tier is stateless — rollback never touches data. If the image
rolls cleanly but the page is broken, the API is the most likely cause.
