# L00213552-Task-3 Assignment 

# L00213552 – DevOps in Action: Creating a Mini-Pipeline

## 1. Project Overview

![Express application running](documentation/screenshots/03-express-application-running.png)

This project develops and deploys a Task Manager web application using Node.js and Express.js. It was completed as part of the L00213552 Task 3 assignment, which focuses on applying DevOps practices throughout the software development lifecycle.

The project demonstrates source code management, automated testing, static code analysis, dependency security scanning, Docker containerisation, Kubernetes deployment, and infrastructure monitoring using Prometheus and Grafana.

GitHub is used to manage the source code and development branches, while GitHub Actions automates the continuous integration (CI) workflow.

## 2. Application Functionality

![Task Manager CRUD functionality](documentation/screenshots/crud_functionality%20.png)

The application provides a simple interface for managing tasks. Its backend is implemented using Express.js, with task operations handled by a separate service module.

The main features are:

- Display existing tasks.
- Create new tasks.
- Mark tasks as completed or incomplete.
- Delete tasks.
- Check application health through a health endpoint.

### API endpoints

| HTTP method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Returns the application health status |
| GET | `/api/tasks` | Retrieves all tasks |
| POST | `/api/tasks` | Creates a task |
| PATCH | `/api/tasks/:id` | Changes a task's completion status |
| DELETE | `/api/tasks/:id` | Deletes a task |

Task data is stored in application memory. The current implementation does not use a database or persistent storage. Consequently, task data is lost when the application restarts. The two Kubernetes replicas also maintain separate in-memory task lists.

## 3. Technologies and Tools

![GitHub Actions CI passed](documentation/screenshots/12-github-actions-ci-passed.png)

| Technology | Purpose in this project |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend application framework |
| Jest | Unit and integration testing |
| Supertest | Testing HTTP endpoints |
| ESLint | Static code analysis |
| npm audit | Dependency vulnerability scanning |
| Git | Version control |
| GitHub | Repository hosting and Pull Requests |
| GitHub Actions | Automated CI workflow |
| Docker | Application containerisation |
| Docker Compose | Local container management |
| Kubernetes | Container orchestration |
| Helm | Installation and configuration of the monitoring stack |
| Prometheus | Collection and querying of monitoring metrics |
| Grafana | Monitoring dashboards and visualisation |

## 4. Repository Structure

![Project folder structure](documentation/screenshots/01-project-folder-structure.png)

The repository is organised into application source code, tests, deployment configuration, monitoring configuration and supporting evidence.

```text
L00213552-Task-3/
├── .github/
│   └── workflows/
│       └── ci.yml
├── documentation/
│   └── screenshots/
├── kubernetes/
│   ├── deployment.yaml
│   └── service.yaml
├── monitoring/
│   └── values.yaml
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── taskService.js
├── tests/
│   ├── app.integration.test.js
│   └── taskService.test.js
├── .dockerignore
├── .gitignore
├── compose.yaml
├── Dockerfile
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

## 5. Source Control Management

![Initial GitHub repository](documentation/screenshots/02-initial-github-repository.png)

Git and GitHub are used to manage the project's development history.

Development changes are organised through feature branches. Changes are committed separately and submitted through GitHub Pull Requests before being merged into the `main` branch.

This approach provides a record of development work and allows changes to be reviewed before they become part of the main codebase.

The repository contains Pull Requests and merge evidence for the application, automated testing, static analysis, security scanning, Docker, Kubernetes and monitoring stages.

## 6. Automated Testing and Continuous Integration

![Automated tests passed](documentation/screenshots/09-automated-tests-passed.png)

The CI workflow is defined in:

`.github/workflows/ci.yml`

The workflow is named **Node.js CI** and runs when:

- Code is pushed to `main`.
- Code is pushed to a branch matching `feature/**`.
- A Pull Request targets `main`.

The workflow runs on `ubuntu-latest` and uses Node.js 20.

### CI workflow stages

The workflow performs the following operations:

1. Checks out the repository.
2. Sets up Node.js and npm dependency caching.
3. Installs dependencies using `npm ci`.
4. Scans production dependencies using `npm audit --omit=dev --audit-level=high`.
5. Applies a high-severity vulnerability gate using `npm audit --audit-level=high`.
6. Runs ESLint static analysis.
7. Executes unit and integration tests.
8. Generates test coverage.
9. Validates the Docker Compose configuration.
10. Builds the production Docker image.
11. Checks that the resulting image is configured to run as the non-root `node` user.

The workflow provides automated feedback when code is pushed or submitted for review. It builds and validates the Docker image, but does not automatically deploy the application to Kubernetes.

### Running checks locally

Install the project dependencies:

```bash
npm ci
```

Run the automated tests:

```bash
npm test
```

Generate test coverage:

```bash
npm run test:coverage
```

Run ESLint:

```bash
npm run lint
```

Start the application:

```bash
npm start
```

## 7. Static Analysis and Dependency Security

![Security scanning passed](documentation/screenshots/19-security-scanning-ci-passed.png)

ESLint is used to examine the JavaScript source code for coding problems and consistency issues.

Dependency security checks are performed through `npm audit`. The CI workflow checks production dependencies separately and also applies a high-severity vulnerability threshold to the full dependency tree.

These checks are intended to identify known dependency vulnerabilities and code-quality issues during the development process.

## 8. Docker Containerisation

![Docker container running](documentation/screenshots/22-docker-container-running.png)

The application is packaged using Docker. The `Dockerfile` uses a multi-stage build based on `node:24-alpine`.

The first stage, named `test`, installs the project dependencies and runs:

- ESLint.
- Jest tests.
- Test coverage generation.

The second stage, named `production`, installs production dependencies only and copies the application source code from the test stage.

This separates the test environment from the final production image, avoiding the inclusion of development dependencies in the runtime image. Docker describes this approach as a way to separate build requirements from the final image (Docker, n.d.-a).

### Container security

The production image includes the following configuration:

- Uses Node.js 24 Alpine.
- Sets `NODE_ENV=production`.
- Installs production dependencies only.
- Runs under the non-root `node` user.
- Exposes port 3000.

The Docker Compose configuration also uses `no-new-privileges:true` to restrict privilege escalation.

### Running with Docker Compose

Build and start the application:

```bash
docker compose up --build -d
```

Check the running container:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f task-manager
```

Open the application:

`http://localhost:3000`

Check the health endpoint:

`http://localhost:3000/health`

Stop the container:

```bash
docker compose down
```

## 9. Kubernetes Deployment

![Kubernetes deployment status](documentation/screenshots/28-kubernetes-deployment-status.png)

The application is deployed to a local Kubernetes cluster using Docker Desktop Kubernetes.

The deployment configuration is stored in the `kubernetes/` directory.

### Deployment configuration

The `deployment.yaml` manifest defines:

- Two replicas of the Task Manager application.
- The image `maxamed4real/l00213552-task-3:1.0`.
- Container port 3000.
- CPU and memory requests and limits.
- Readiness and liveness HTTP probes.
- Non-root container execution.

Kubernetes Deployments maintain the desired number of application replicas and manage changes to the Pods (Kubernetes, n.d.-a).

### Container security controls

The deployment applies several security settings:

- `runAsNonRoot: true`
- User ID 1000 and group ID 1000.
- `seccompProfile: RuntimeDefault`.
- `allowPrivilegeEscalation: false`.
- Drops all Linux capabilities.
- `readOnlyRootFilesystem: true`.

These settings restrict the privileges available to the application container. Kubernetes provides security context settings to control aspects of container and Pod execution (Kubernetes, n.d.-b).

### Health checks

The deployment defines:

- A readiness probe to check whether the container is ready to receive traffic.
- A liveness probe to check whether the container is responding.

Both probes currently use the `/api/tasks` endpoint. Kubernetes uses readiness and liveness probes for different purposes: readiness controls whether a Pod receives Service traffic, while liveness can trigger a container restart when repeated checks fail (Kubernetes, n.d.-c).

### Deploying the application

Apply the Deployment manifest:

```bash
kubectl apply -f kubernetes/deployment.yaml
```

Apply the Service manifest:

```bash
kubectl apply -f kubernetes/service.yaml
```

Check the Deployment:

```bash
kubectl get deployments
```

Check the Pods:

```bash
kubectl get pods
```

Check the Service:

```bash
kubectl get services
```

View application logs:

```bash
kubectl logs -l app=task-manager
```

Access the application using port forwarding:

```bash
kubectl port-forward service/task-manager 3000:3000
```

Then open:

`http://localhost:3000`

The Kubernetes Service uses the `ClusterIP` type, making the application accessible within the cluster. Port forwarding is used for local access during testing.

## 10. Monitoring with Prometheus and Grafana

![Grafana monitoring dashboard](documentation/screenshots/39-grafana-monitoring-dashboard.png)

Prometheus and Grafana are installed in the Kubernetes cluster using the Prometheus Community `kube-prometheus-stack` Helm chart.

The project-specific monitoring configuration is stored in:

`monitoring/values.yaml`

The configuration enables Grafana's default dashboards, uses a Kubernetes Secret named `grafana-admin` for administrator credentials, and defines CPU and memory requests and limits. A startup probe checks Grafana's `/api/health` endpoint.

### Prometheus

Prometheus collects and stores monitoring measurements as time-series data. These measurements can be queried to examine changes in the monitored environment (Prometheus, n.d.).

In this project, Prometheus is used to inspect Kubernetes and container metrics, including the Task Manager Pods.

### Grafana

![Grafana monitoring dashboard](documentation/screenshots/39-grafana-monitoring-dashboard.png)

Grafana is used to display monitoring information through dashboards and queries. It uses Prometheus as its metrics data source (Grafana Labs, n.d.).

The monitoring evidence includes:

- Kubernetes monitoring dashboards.
- Prometheus target status.
- Prometheus queries.
- Task Manager Pod information.
- CPU and memory measurements for the Task Manager Pods.

The metrics demonstrate how the application containers and Kubernetes environment can be observed while the application is running.

### Accessing Grafana

Run:

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3001:80
```

Open:

`http://localhost:3001`

The administrator credentials are stored in the Kubernetes Secret named `grafana-admin`. The password is not stored in this repository.

### Accessing Prometheus

Run:

```bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

Open:

`http://localhost:9090`

### Application logs

Application logs can be inspected through Kubernetes:

```bash
kubectl logs -l app=task-manager
```

The project uses Kubernetes for application log inspection and Prometheus with Grafana for metrics monitoring. Centralised log aggregation has not been implemented.

## 11. Screenshots and Implementation Evidence

![Kubernetes cluster dashboard](documentation/screenshots/46-kubernetes-cluster-dashboard.png)

Screenshots are stored in:

`documentation/screenshots/`

They provide evidence of the implementation and testing stages.

### Application and source control

![Project folder structure](documentation/screenshots/01-project-folder-structure.png)

![Initial GitHub repository](documentation/screenshots/02-initial-github-repository.png)

![Express application running](documentation/screenshots/03-express-application-running.png)

![Express pull request](documentation/screenshots/04-express-pull-request.png)

![Merged Express pull request](documentation/screenshots/05-express-pull-request-merged.png.png)

![Task Manager functionality](documentation/screenshots/06-task-manager-functionality.png)

![Task Manager pull request](documentation/screenshots/07-task-manager-pull-request.png)

![Merged Task Manager pull request](documentation/screenshots/08-task-manager-pull-request-merged.png.png)

![CRUD functionality](documentation/screenshots/crud_functionality%20.png)

### Automated testing and CI

![Automated tests passed](documentation/screenshots/09-automated-tests-passed.png)

![Automated tests coverage passed](documentation/screenshots/09.1-automated-tests-passed.png)

![Automated tests pull request](documentation/screenshots/10-automated-tests-pull-request.png)

![Merged automated tests pull request](documentation/screenshots/11-automated-tests-merged.png)

![GitHub Actions CI passed](documentation/screenshots/12-github-actions-ci-passed.png)

![GitHub Actions pull request](documentation/screenshots/13-github-actions-ci-pull-request.png)

![Merged GitHub Actions pull request](documentation/screenshots/14-github-actions-ci-merged.png)

![ESLint static analysis passed](documentation/screenshots/15-eslint-static-analysis-passed.png)

![ESLint GitHub Actions passed](documentation/screenshots/16-eslint-github-actions-passed.png)

![ESLint pull request](documentation/screenshots/17-eslint-pull-request.png)

![Merged ESLint pull request](documentation/screenshots/18-eslint-merged.png)

![Security scanning passed](documentation/screenshots/19-security-scanning-ci-passed.png)

![Security scanning pull request](documentation/screenshots/20-security-scanning-pull-request.png)

![Merged security scanning pull request](documentation/screenshots/21-security-scanning-merged.png)

### Docker

![Docker container running](documentation/screenshots/22-docker-container-running.png)

![Docker Compose running](documentation/screenshots/23-docker-compose-running.png)

![Docker GitHub Actions passed](documentation/screenshots/24-docker-github-actions-passed.png)

![Docker pull request](documentation/screenshots/25-docker-pull-request.png)

![Merged Docker pull request](documentation/screenshots/26-docker-merged.png)

### Kubernetes

![Kubernetes security](documentation/screenshots/27-kubernetes-security.png)

![Kubernetes deployment status](documentation/screenshots/28-kubernetes-deployment-status.png)

![Kubernetes service endpoints](documentation/screenshots/29-kubernetes-service-endpoints.png)

![Kubernetes application logs](documentation/screenshots/30-kubernetes-application-logs.png)

![Kubernetes pull request](documentation/screenshots/31-kubernetes-pull-request.png)

![Merged Kubernetes pull request](documentation/screenshots/32-kubernetes-merge.png)

### Monitoring setup

![Monitoring prerequisites](documentation/screenshots/33-monitoring-prerequisites.png)

![Helm chart validation](documentation/screenshots/34-helm-chart-validation.png)

![Monitoring installation dry run](documentation/screenshots/35-monitoring-install-dry-run.png)

### Prometheus and Grafana

![Prometheus and Grafana running](documentation/screenshots/37-prometheus-grafana-running.png)

![Prometheus and Grafana login](documentation/screenshots/38-prometheus-grafana-running.png)

![Grafana monitoring dashboard](documentation/screenshots/39-grafana-monitoring-dashboard.png)

![Prometheus metrics targets](documentation/screenshots/40-prometheus-metrics-targets.png)

![Grafana Prometheus query](documentation/screenshots/41-grafana-prometheus-query.png)

![Task Manager pods](documentation/screenshots/42.Check%20two%20task-manager%20pods.png)

![Task Manager CPU usage](documentation/screenshots/43.This%20measures%20CPU%20usage%20for%20each%20task-manager%20pod,%20in%20CPU%20cores..png)

![Task Manager CPU and memory metrics](documentation/screenshots/44-task-manager-cpu-memory-metrics.png)

![Prometheus targets](documentation/screenshots/45-prometheus-targets.png)

![Kubernetes cluster dashboard](documentation/screenshots/46-kubernetes-cluster-dashboard.png)

## 12. Project Limitations and Future Improvements

![Task Manager CPU and memory metrics](documentation/screenshots/44-task-manager-cpu-memory-metrics.png)

The current implementation meets the practical objectives of the project, but some areas could be developed further.

- **Persistent storage:** Task data is held in memory. A database could be introduced to retain tasks when the application restarts.
- **Shared application state:** The two Kubernetes replicas currently maintain separate in-memory task lists. A shared database would allow both replicas to use the same task data.
- **Centralised logging:** Application logs are inspected through Kubernetes. A centralised logging solution could be added to collect and search logs from the application and cluster.
- **Automated deployment:** The GitHub Actions workflow currently performs testing, security checks and Docker image validation. A further pipeline stage could automate deployment to Kubernetes.

These improvements would extend the project beyond its current implementation.

## 13. Conclusion

![Prometheus and Grafana running](documentation/screenshots/37-prometheus-grafana-running.png)

This project applies a practical DevOps workflow to the development and deployment of a Node.js Task Manager application.

Git and GitHub provide source control and Pull Request management. GitHub Actions automates testing, static analysis, dependency security checks and Docker image validation. Docker provides a production container image, while Kubernetes manages two application replicas with resource limits, health probes and security controls.

Prometheus and Grafana provide visibility into Kubernetes and container metrics, while Kubernetes commands are used to inspect application logs.

The completed implementation demonstrates how source control, automation, containerisation, orchestration and monitoring can be combined within a small software project.

## References

Docker (n.d.-a) *Multi-stage builds*. Docker Documentation. Available at: https://docs.docker.com/build/building/multi-stage/ (Accessed: 22 November 2026).

Grafana Labs (n.d.) *Prometheus data source*. Grafana Documentation. Available at: https://grafana.com/docs/grafana/latest/datasources/prometheus/ (Accessed: 22 November 2026).

GitHub (n.d.) *Workflow syntax for GitHub Actions*. GitHub Docs. Available at: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax (Accessed: 22 November 2026).

Kubernetes (n.d.-a) *Deployments*. Kubernetes Documentation. Available at: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/ (Accessed: 22 November 2026).

Kubernetes (n.d.-b) *Configure a security context for a Pod or Container*. Kubernetes Documentation. Available at: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/ (Accessed: 22 November 2026).

Kubernetes (n.d.-c) *Liveness, Readiness, and Startup Probes*. Kubernetes Documentation. Available at: https://kubernetes.io/docs/concepts/workloads/pods/probes/ (Accessed: 22 November 2026).

Prometheus (n.d.) *Overview*. Prometheus Documentation. Available at: https://prometheus.io/docs/introduction/overview/ (Accessed: 22 November 2026).