#!/bin/bash
# docker-net-check.sh - Docker Network Isolation Diagnostic
# Usage: bash ~/.hermes/scripts/docker-net-check.sh

NETWORKS=$(docker ps --format '{{.Names}}' 2>/dev/null | head -20)

if [ -z "$NETWORKS" ]; then
  echo "ERROR: No running Docker containers found."
  echo "Start containers with: docker compose up -d"
  exit 1
fi

echo "=== Container Network Membership ==="
for c in $NETWORKS; do
  docker inspect "$c" --format '{{.Name}}: net={{range $n,$c := .NetworkSettings.Networks}}{{$n}} ip={{$c.IPAddress}}{{end}}' 2>/dev/null
done

echo ""
echo "=== DNS Alias Check ==="
for c in $NETWORKS; do
  ALIAS=$(docker inspect "$c" --format '{{range $n,$c := .NetworkSettings.Networks}}{{$c.Aliases}}{{end}}' 2>/dev/null)
  echo "$c: aliases=$ALIAS"
done

echo ""
echo "=== Subnet Analysis ==="
FIRST_CONTAINER=$(echo "$NETWORKS" | head -1)
docker inspect "$FIRST_CONTAINER" --format '{{range $n,$c := .NetworkSettings.Networks}}Network: {{$n}}, Gateway: {{$c.Gateway}}, IP: {{$c.IPAddress}}{{end}}' 2>/dev/null

echo ""
echo "=== Quick DNS Test (first 3 containers) ==="
COUNT=0
for c in $NETWORKS; do
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -gt "3" ]; then break; fi
  NET=$(docker inspect "$c" --format '{{range $n,$c := .NetworkSettings.Networks}}{{$n}}{{end}}' 2>/dev/null | head -1)
  if [ -n "$NET" ]; then
    echo "[$c] DNS via $NET:"
    docker run --rm --network "$NET" nicolaka/netshoot:latest nslookup "$c" 2>/dev/null | grep "Address" | head -3
  fi
done
