# Kubernetes (local — Minikube / Docker Desktop)

These manifests target a **local** cluster. No cloud provider, registry, or DNS is assumed — images are built locally and loaded directly into the cluster's container runtime.

## 1. Build the images into the cluster

**Minikube:**
```bash
eval $(minikube docker-env)          # point your shell's docker CLI at minikube's daemon
docker build -t taki-backend:local ./backend
docker build -t taki-frontend:local ./frontend
```

**Docker Desktop Kubernetes:** images built with your normal local `docker build` are already visible to the cluster — just run:
```bash
docker build -t taki-backend:local ./backend
docker build -t taki-frontend:local ./frontend
```

## 2. Apply the manifests

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/ -n taki-demo
```
(the numeric filename prefixes keep `kubectl apply -f k8s/` roughly ordered, but Kubernetes will converge regardless of apply order)

## 3. Check rollout

```bash
kubectl -n taki-demo get pods -w
kubectl -n taki-demo get svc
```

## 4. Access the app

**Option A — port-forward (fastest, no addons needed):**
```bash
kubectl -n taki-demo port-forward svc/frontend 8081:80
# open http://localhost:8081
```

**Option B — Ingress:**
```bash
minikube addons enable ingress
echo "$(minikube ip) taki-demo.local" | sudo tee -a /etc/hosts   # or edit hosts file manually on Windows
# open http://taki-demo.local
```

## Notes
- `10-postgres-secret.yaml` / `21-backend-secret.yaml` contain **demo-only** plaintext credentials for a throwaway local cluster. Never reuse these values, and never commit real secrets this way — for anything beyond a local demo use Sealed Secrets, External Secrets Operator, or your cloud provider's secret manager.
- `postgres` uses a single-replica `Deployment` + `PersistentVolumeClaim` (not a `StatefulSet`) for simplicity — appropriate for a demo, not for production HA.
- Backend/frontend `Deployment`s run 2 replicas behind their `Service` to demonstrate basic load-balancing; scale with `kubectl -n taki-demo scale deployment/backend --replicas=N`.
- To point manifests at a real cloud cluster later: push images to a registry (GHCR/ECR/GCR/ACR), change `image:` fields to the registry path + tag, switch `imagePullPolicy` to `Always`, and swap the Ingress class/annotations for your provider's controller.
