build:
	docker build -t make-migrations -f Dockerfile-mm .
	docker build -t migrations -f Dockerfile-migrations .

CMD = makemigration

makemigration:
	docker run --rm  -v $(shell pwd)/internal/db/migrations:/migrations migrations migrate create -ext sql -dir . --seq $CMD

STEPS ?= 1

migrateup:
	docker run --rm  -v $(shell pwd)/internal/db/migrations:/migrations -v $(shell pwd)/internal/db/sqlite:/database migrations migrate -path=/migrations -database sqlite3:///database/database.db -verbose up $(STEPS)
migratedown:
	docker run --rm -v $(shell pwd)/internal/db/migrations:/migrations -v $(shell pwd)/internal/db/sqlite:/database migrations migrate -path=/migrations -database sqlite3:///database/database.db -verbose down $(STEPS)

docker:
	docker-compose down
	docker-compose build
	docker-compose up