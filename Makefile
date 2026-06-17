.PHONY: dev stop build build-dev logs shell test

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

stop:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

build:
	docker compose -f docker-compose.yml build

build-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f qultre

shell:
	docker compose exec qultre sh

test:
	docker compose exec qultre pnpm run test
