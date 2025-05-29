# 🧠 Problems-svc
![Status](https://img.shields.io/badge/status-development%20complete-brightgreen)
![Node.js](https://img.shields.io/badge/node.js-18.x-blue)

## 🧩 Introduction
**Problems-svc** is a scalable backend microservice built to manage a comprehensive set of coding problems. These problems span traditional Data Structures & Algorithms (DSA) challenges and real-world API simulation exercises. The service serves as the backbone of a broader platform aimed at assessing and improving users' programming skills through structured exercises.

This microservice provides RESTful APIs that allow platform administrators and editors to create, organize, and curate problems. Each problem can include metadata like time/memory constraints, version history, difficulty level, topic tags, and supported languages. Problems are grouped into sheets (like playlists), and can be served dynamically to users in practice modules or assessments.

Whether it's a binary search challenge or building a REST API for a bookstore, **Problems-svc** enables consistent problem definition and retrieval, acting as a single source of truth for the problem-solving engine of the platform.

## 📌 Project Status

> **🚧 Development Status: Complete**
The Problems-svc is feature-complete and actively maintained. It's now integrated into the broader ecosystem of services that deliver practice environments and problem-solving challenges. Future updates may include:
- Enhanced analytics and problem usage tracking.
- Multi-language translation support for problem statements.
### ✅ Completed Milestones
- Core API design and implementation.
- Full CRUD support for problem sheets, types, languages, and playlists.
- Judge0 integration for language execution.
- Role-based access controls and token validation.
- Deployment-ready configuration for production environments.

## 🚀 Features
### 🔍 Problem Authoring and Management

- **DSA Problem Definitions**  
  Support for typical algorithm problems (e.g., sorting, graph traversal) with input/output examples, constraints, and test cases.

- **API-based Problem Authoring**  
  Define REST API challenges, including request/response contracts and validation logic. Perfect for simulating real-world backend tasks.

- **Flexible Metadata Support**  
  Attach metadata such as:
  - Time limits
  - Memory usage
  - Visibility flags (public, private, draft)

### 🗂️ Organization & Discovery

- **Sheet Type System**  
  Organize problems into logical groups such as “Beginner DSA,” “System Design APIs,” or “SQL Challenges.”

- **Tagging and Categorization**  
  Use tags to denote topics (e.g., "binary tree", "authentication"), difficulty (easy, medium, hard) and company (amazon, google, meta). Tags enhance filtering and discovery on the platform.

- **Language Compatibility Mapping**  
  Specify which languages (e.g., Python, Java, JavaScript) a problem supports. Essential for test case validation and code execution.

- **Playlists (Collections)**  
  Curate problems into thematic collections or learning tracks. A single problem can belong to multiple playlists.

### 🔐 Secure API

- **Token-Based Auth (JWT)**  
  Every endpoint is protected via bearer tokens. Access scopes can be restricted based on user roles (admin, editor, reader).

- **Input Validation via OpenAPI**  
  OpenAPI specs are used to validate request data, ensuring strict schema compliance and minimizing the risk of malformed or malicious inputs.

### 🔄 Integration with Execution Engine

- **Judge0 Integration**  
  Problems-svc integrates seamlessly with the Judge0 execution engine to compile and run submitted code, supporting multiple programming languages via Dockerized runners.

- **Code Snippets and Solutions**  
  Retrieve pre-filled code templates or reference solutions specific to a problem and language.

## Usage
This service acts as a backend repository of problems, feeding the UI and execution engines with structured problem data. Users interact with it indirectly while solving challenges through the platform.

## 🔐 Security
- All APIs are secured with Bearer Tokens using JWT-based Auth.
- Role-based access control enforces permissions.
- OpenAPI specs are used for input validation to ensure request safety and data integrity.

## 📡 API Endpoints
### 🔧 Health & Utility APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| GET    | `/api-docs/`                                           | API Documentation (OpenAPI)              |
| GET    | `/problems-svc/api/v1.0/health`                        | Service Health Check                     |

### 🗂️ Sheet Types APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| POST   | `/problems-svc/api/v1.0/sheet/type`                    | Create a sheet type                      |
| GET    | `/problems-svc/api/v1.0/sheet/type`                    | Get all sheet types                      |
| GET    | `/problems-svc/api/v1.0/sheet/type/:typeId`            | Get sheet type by ID                     |
| PUT    | `/problems-svc/api/v1.0/sheet/type/:typeId`            | Update sheet type                        |
| DELETE | `/problems-svc/api/v1.0/sheet/type/:typeId`            | Delete sheet type                        |

### 🏷️ Tags APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| POST   | `/problems-svc/api/v1.0/tag`                           | Create a new tag                         |
| GET    | `/problems-svc/api/v1.0/tag`                           | Get all tags                             |
| GET    | `/problems-svc/api/v1.0/tag/:tagId`                    | Get tag by ID                            |
| PUT    | `/problems-svc/api/v1.0/tag/:tagId`                    | Update tag                               |
| DELETE | `/problems-svc/api/v1.0/tag/:tagId`                    | Delete tag                               |

### 💬 Support Language APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| POST   | `/problems-svc/api/v1.0/language`                      | Register a programming language          |
| GET    | `/problems-svc/api/v1.0/language`                      | List all supported languages             |
| GET    | `/problems-svc/api/v1.0/language/:langId`              | Get language by ID                       |
| GET    | `/problems-svc/api/v1.0/language/type/:typeId`         | Get language by sheet type               |
| PUT    | `/problems-svc/api/v1.0/language/:langId`              | Update language                          |
| DELETE | `/problems-svc/api/v1.0/language/:langId`              | Delete language                          |

### 📄 Sheet APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| POST   | `/problems-svc/api/v1.0/sheet`                         | Create a new problem sheet               |
| GET    | `/problems-svc/api/v1.0/sheet`                         | Get all problem sheets                   |
| GET    | `/problems-svc/api/v1.0/sheet/:sheetId`                | Get problem sheet by ID                  |
| GET    | `/problems-svc/api/v1.0/sheet/:sheetId/snippet/:langId`| Get code snippets for language           |
| GET    | `/problems-svc/api/v1.0/sheet/:sheetId/solution`       | Get reference solutions                  |
| GET    | `/problems-svc/api/v1.0/sheet/:sheetId/detail`         | Get full problem details                 |
| PUT    | `/problems-svc/api/v1.0/sheet/:sheetId`                | Update a problem sheet                   |
| DELETE | `/problems-svc/api/v1.0/sheet/:sheetId`                | Delete a problem sheet                   |

### Playlist APIs
| Method | Endpoint                                               | Description                              |
| :----- | :----------------------------------------------------- | :--------------------------------------- |
| POST   | `/problems-svc/api/v1.0/playlist`                      | Create a new problem collection          |
| GET    | `/problems-svc/api/v1.0/playlist`                      | Get playlist for user                    |
| GET    | `/problems-svc/api/v1.0/playlist/:playlistId`          | Get a playlist by ID                     |
| PUT    | `/problems-svc/api/v1.0/playlist/:playlistId`          | Update playlist                          |
| DELETE | `/problems-svc/api/v1.0/playlist/:playlistId`          | Delete playlist                          |
| PUT    | `/problems-svc/api/v1.0/playlist/assign/:playlistId`   | Assign problem to the playlist           |
| DELETE | `/problems-svc/api/v1.0/playlist/assign/:playlistId`   | Unassign problem from playlist           |
| GET    | `/problems-svc/api/v1.0/playlist/assign/:playlistId`   | List problems in playlist                |

## 🛠️ Setup Instructions

### 🚀 Local Setup

```bash
# Clone the repository
git clone https://github.com/Ayushya100/problems-svc.git
cd problems-svc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then configure your .env file

# Run the server
npm run start
```

## Judge0 Installation (Windows + WSL)

```bash
# Open powershell
# Install and Setup WSL for hosting Judge0 infrastructure
wsl --install

# Enter in linux environment
wsl

# Update and Install docker.io and docker-compose
sudo apt update
sudo apt install -y docker.io
sudo apt install -y docker-compose

# Download and extract Judge0
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip

# Enter into Judge0
ls
cd judge0-v1.13.1

# There will be two files available inside the unzipped Judge0 - docker-compose.yml and judge0.conf
# Visit to the website provided by the Judge0 to generate random passwrd (https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new)
# Run below command to make changes in Judge0 configuration
nano judge0.conf

# Add passwords for REDIS_PASSWORD and POSTGRES_PASSWORD
# To write out the changes: ctrl + O
# Exit: ctrl + x

# Command to run the redis image
docker-compose up -d db redis

# Command to run the workers and servers
docker-compose up -d
# If command fails try adding sudo as suffix to the above command and try.

# Test if Judge0 installed and running successfully by visiting
http://localhost:2358
http://localhost:2358/docs
```

## Judge0 Initiation Failure

```bash
# Open powershell
# Enter in linux environment
wsl

# Enter into Judge0
ls
cd judge0-v1.13.1

# Restart Judge0 with the below commands
docker-compose up -d db redis
docker-compose up -d

# Test if Judge0 installed and running successfully by visiting
http://localhost:2358/docs

# Check via curl command
curl -v http://localhost:2358/workers
```

## 📦 Tech Stack
- **Language:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Auth:** JWT
- **Validation:** OpenAPI Spec
- **Query Builder:** Knex.js
- **Environment Management:** dotenv
---
**Problems-svc** - Powering Code and API Challenges for Developers!