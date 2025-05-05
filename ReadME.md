# 🧠 Problems-svc

## 🧩 Introduction
Welcome to the GitHub repository for **Problems SVC** – This service is responsible for managing DSA and real-world API problems. It provides functionality to create, retrieve, and manage coding challenges and API-based problem definitions, which are later solved by users via dedicated execution engines.

## 📌 Project Status: Under Development
### What's Happening Now:
- The service is currently being developed to support the creation, management, and serving of coding challenges for users across different domains.

## 🚀 Features
### Overview
This service plays a critical role in powering the problem-solving engine of our platform. It handles the creation of both DSA-style and API-based problems and stores detailed metadata and configurations for each challenge.
### Key Features
- **DSA Problem Management:** Create and manage traditional data structures and algorithms problems with test cases and constraints.
- **API Problem Management:** Create API challenges with input/output contracts, expected implementations, and evaluation criteria.
- **Category and Difficulty Tagging:** Classify problems based on difficulty levels, types, and categories for better discoverability.
- **Versioned Problem Definitions:** Maintain version history and updates for each problem as it evolves.
- **Rich Metadata Support:** Attach time limits, memory constraints, and custom scoring rules.
- **Search & Filter:** Easily retrieve problems based on filters like type, difficulty, topic, or tags.

## Usage
This service acts as a backend repository of problems, feeding the UI and execution engines with structured problem data. Users interact with it indirectly while solving challenges through the platform.

## Security
API routes are secured using bearer tokens and role-based access control. Input validations are enforced using OpenAPI specs to ensure data consistency and protection against injection or malformed requests.

## API Endpoints
### Health & Utility APIs
| Method | Endpoint                                               | Description                             |
| :----- | :----------------------------------------------------- | :-------------------------------------- |
| GET    | `/problems-svc/api/v1.0/health`                        | Health Check Service                    |

## 🛠️ Setup Instructions

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

## Judge0 Windows Installation

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