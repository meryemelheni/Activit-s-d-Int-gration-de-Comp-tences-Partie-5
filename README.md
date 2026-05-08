# Projet Gestion des Étudiants — Partie 5

## Objectif Général
Introduire deux piliers fondamentaux des architectures micro-services modernes : la communication asynchrone via **Apache Kafka**, et l'observabilité de la plateforme via la **stack ELK** (Elasticsearch, Logstash, Kibana), le monitoring (**Prometheus & Grafana**) et les **health checks**.

## Architecture Microservices (Mis à jour Partie 5)
- **auth-service** : Micro-service Node.js pour l'authentification (port 3001)
- **api-spring-boot** : Service de gestion des étudiants (port 8081)
- **grading-service** : Service de gestion des notes (port 8082)
- **notification-service** : Consommateur Kafka pour les notifications (port 8083)
- **frontend** : Interface Next.js (port 3000)
- **eureka-server** : Annuaire des services (port 8761)
- **api-gateway** : Point d'entrée unique (port 8090)
- **Bases de données** : PostgreSQL (étudiants), MongoDB (auth), Redis (cache)
- **Broker** : Apache Kafka + Zookeeper

## Observabilité & Monitoring
- **Logs centralisés (ELK)** : Les logs sont envoyés à Logstash, indexés dans Elasticsearch et visualisables dans Kibana (port 5601).
- **Métriques (Prometheus)** : Collecte les données de performance via Spring Actuator (port 9090).
- **Dashboards (Grafana)** : Visualisation interactive des métriques (port 3002).
- **Health Checks** : Monitoring de l'état de santé des services via Docker Compose.

## Lancer le projet
```bash
docker compose up --build
```

## URLs importantes
| Service | URL |
|---------|-----|
| Frontend Web | http://localhost:3000 |
| Eureka Dashboard | http://localhost:8761 |
| API Gateway | http://localhost:8090 |
| Kibana (Logs) | http://localhost:5601 |
| Grafana (Metrics) | http://localhost:3002 |
| Prometheus | http://localhost:9090 |
| Etudiant Swagger | http://localhost:8081/swagger-ui/index.html |

## Structure du dépôt (Partie 5)
```text
/etudiantsapi/
├── api-spring-boot/      # Producteur Kafka (étudiants)
├── grading-service/      # Producteur Kafka (notes)
├── notification-service/ # Consommateur Kafka
├── auth-service/         # Authentification Node.js
├── frontend/             # Next.js
├── observability/        # Config Logstash & Prometheus
└── docker-compose.yml    # Orchestration complète
```
