all:
	docker compose  up --build

down:
	docker compose down

clean:
	docker compose down --volumes --remove-orphans --rmi all

fclean:
	-docker stop $$(docker ps -a -q)
	-docker rm $$(docker ps -a -q)
	-docker rmi $$(docker images -a -q)
	-docker network rm $$(docker network ls -q) 2> /dev/null
	-docker volume rm $$(docker volume ls -q)

prune:
	docker system prune -a -f --volumes

re: fclean all