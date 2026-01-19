# 🚀 TaskFlow - Agile Project Management

> Plateforme web de gestion agile pour petites équipes, construite avec Next.js 15 et ZenStack v3

[![CI/CD](https://github.com/VOTRE_USERNAME/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/VOTRE_USERNAME/taskflow/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Vision du Projet

**Pour** les étudiants et petites équipes techniques  
**Qui souhaitent** appliquer Scrum sans la complexité des outils enterprise  
**Notre produit est** une plateforme web de gestion agile  
**Qui** offre backlog structuré, sprints timeboxés et métriques en temps réel  
**À la différence de** Trello/Notion qui sont généralistes  
**Permet de** respecter la méthodologie Scrum avec user stories INVEST, vélocité mesurée et burndown automatique

## ✨ Features

### Sprint 1 (Complété)
- ✅ Authentification (register/login)
- ✅ Gestion de projets

### Sprint 2 (Complété)
- ✅ User Stories au format agile
- ✅ Estimation en story points

### Sprint 3 (En cours)
- 🔄 Priorisation drag & drop
- 🔄 Création de sprints

### Roadmap
- [ ] Board Kanban
- [ ] Burndown charts
- [ ] Calcul de vélocité

## 🛠️ Stack Technique

- **Framework:** Next.js 15 (App Router)
- **Auth:** Better-Auth
- **Database:** PostgreSQL
- **ORM:** ZenStack v3 (Prisma)
- **UI:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions

## 📦 Installation

### Prérequis
- Node.js 20+
- PostgreSQL 15+
- npm ou pnpm

### Setup

```bash
# Clone
git clone https://github.com/VOTRE_USERNAME/taskflow.git
cd taskflow

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Editer .env.local avec vos credentials

# Start PostgreSQL (Docker)
docker run --name taskflow-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskflow_dev \
  -p 5432:5432 \
  -d postgres:15

# Generate Prisma Client & Migrate
npx zenstack generate
npx prisma migrate dev

# Start dev server
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🧪 Tests

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm test

# Coverage
npm run test:unit -- --coverage
```

## 🔀 Git Flow

Ce projet utilise Git Flow avec la méthodologie Agile :

```
main (production)
  ↑
develop (intégration)
  ↑
feature/US-XX-description  → User Stories
  ↑
fix/bug-description        → Hotfixes
  ↑
release/sprint-X           → Releases
```

### Convention de commits

```
feat(sprint1): add user authentication (US-01)
fix(backlog): drag & drop priority update (#42)
test(auth): add login E2E tests
docs(readme): update setup instructions
chore(deps): upgrade next to 15.1
```

## 📊 Métriques du Projet

- **Vélocité moyenne:** 12 story points/sprint
- **Sprints complétés:** 2/5
- **Coverage:** 85%
- **Build time:** ~45s

## 🎯 Méthodologie Agile Appliquée

### Product Backlog
- 13 User Stories estimées
- Priorisation MoSCoW
- Format INVEST respecté

### Sprints
- Durée: 7 jours
- Daily Scrum: 9h30
- Sprint Review: Dimanche 14h
- Retrospective: Dimanche 16h

### Definition of Done
- ✅ Code review approuvé
- ✅ Tests unitaires > 80% coverage
- ✅ Tests E2E passent
- ✅ CI/CD pipeline verte
- ✅ Déployé sur staging
- ✅ PO a validé

## 👥 Équipe

- **Product Owner:** [Votre Nom]
- **Scrum Master:** [Votre Nom]
- **Developers:** [Votre Nom], Brice

## 📄 License

MIT © 2025 TaskFlow Team

---

**Construit avec ❤️ en appliquant Scrum pour créer un outil Scrum**