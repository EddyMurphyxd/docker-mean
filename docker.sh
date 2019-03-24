#!/bin/bash

CLEAN="clean"
RUN="run"
STOP="stop"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./ [OPTIONS] COMMAND [arg...]"
    echo "       ./ [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $CLEAN      - Stop and Remove app containers."
    echo "  $RUN        - Build and Run app."
    echo "  $STOP       - Stop app."
    exit
fi

clean() {
  stop_existing
  remove_stopped_containers
  remove_unused_volumes
}

run() {
  echo "Cleaning..."
  clean
  
  echo "Running docker..."
  docker-compose up --build
}

stop_existing() {
  MYAPP_ANGULAR="$(docker ps --all --quiet --filter=name=myapp-angular)"
  MYAPP_EXPRESS="$(docker ps --all --quiet --filter=name=myapp-express)"
  CACHE="$(docker ps --all --quiet --filter=name=myapp-cache)"
  DB="$(docker ps --all --quiet --filter=name=myapp-database)"

  if [ -n "$MYAPP_ANGULAR" ]; then
    docker stop $MYAPP_ANGULAR
  fi

  if [ -n "$MYAPP_EXPRESS" ]; then
    docker stop $MYAPP_EXPRESS
  fi

  if [ -n "$CACHE" ]; then
    docker stop $CACHE
  fi

  if [ -n "$DB" ]; then
    docker stop $DB
  fi
}

remove_stopped_containers() {
  CONTAINERS="$(docker ps -a -f status=exited -q)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all stopped containers."
		docker rm $CONTAINERS
	else
		echo "There are no stopped containers to be removed."
	fi
}

remove_unused_volumes() {
  CONTAINERS="$(docker volume ls -qf dangling=true)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all unused volumes."
		docker volume rm $CONTAINERS
	else
		echo "There are no unused volumes to be removed."
	fi
}

if [ $1 = $CLEAN ]; then
  echo "Cleaning..."
	clean
	exit
fi

if [ $1 = $RUN ]; then
	run
	exit
fi

if [ $1 = $STOP ]; then
	stop_existing
	exit
fi