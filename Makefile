cmd = makemigration

steps ?= 1

build:
	docker build -t migrations -f Dockerfile-migrations .

makemigration:
	docker run --rm -v $(shell pwd)/internal/db/migrations:/migrations migrations migrate create -ext sql -dir /migrations --seq $(cmd)

migrateup:
	docker run --rm -v $(shell pwd)/internal/db:/db migrations migrate -path=/db/migrations -database sqlite3:///db/database.db -verbose up

migratedown:
	docker run --rm -v $(shell pwd)/internal/db:/db migrations migrate -path=/db/migrations -database sqlite3:///db/database.db -verbose down $(steps)

docker:
	docker-compose down
	docker-compose build
	docker-compose up