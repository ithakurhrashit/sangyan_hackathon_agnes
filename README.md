# Aegis.AI - Decentralized Threat Intelligence Platform

> **Neutralizing counterfeit trading apps and deepfake syndicates through decentralized consensus and multimodal AI.**

Aegis.AI is a highly scalable, community-driven threat intelligence platform engineered to dismantle digital scam syndicates operating on encrypted channels (Telegram/WhatsApp). By combining advanced machine learning for malware classification, Siamese Neural Networks for UI cloning detection, and an Ethereum-based Token Curated Registry (TCR), Aegis.AI removes single points of failure in threat detection.

## 🚀 The Architecture

The platform operates across three isolated but deeply integrated layers:

### 1. Ingestion & Analysis Engine (FastAPI / Python)
- **Asynchronous Scraping**: Monitors public Telegram groups for illicit APKs and synthetic media.
- **Behavioral Analysis**: Performs static extraction of `AndroidManifest.xml` via `pyaxmlparser` without executing Dalvik bytecode. Scores extreme risks like `SYSTEM_ALERT_WINDOW` (overlay attacks) or `BIND_ACCESSIBILITY_SERVICE` (2FA theft).
- **UI Clone Detection (SNNs)**: Uses Siamese Neural Networks to compare visually identical cross-platform clones (Flutter/React Native) against native baseline applications.
- **Deepfake Detection**: Calculates dense optical flow fields (RAFT) and identifies blending boundaries (Face X-ray) to flag synthetically generated media.

### 2. Frontend Dashboard (React / Vite)
- **Glassmorphism Aesthetic**: A sleek, dynamic dark-mode interface built for real-time monitoring.
- **Live Event Stream**: Actively polls the ingestion queue and visualizes threat vectors instantly using `Recharts`.
- **Decentralized UI Integration**: Facilitates connection to Web3 wallets to interface with the registry.

### 3. Token Curated Registry (Solidity / EVM)
- **Cryptoeconomic Security**: Threat researchers submit Indicators of Compromise (IoCs) by locking a financial "Integrity Bond" using AEGIS tokens.
- **Community Slashing**: Fraudulent or false-positive submissions are challenged by the community. A decentralized vote determines the outcome, slashing the malicious actor's stake and rewarding the verifier.
- **Data Minimization (DPDP Compliance)**: Storing only cryptographic hashes (SHA-256) and IPFS CIDs on-chain ensures full compliance with modern data protection regulations (e.g., India's DPDP Act, 2023).

---

## 🛠️ Quick Start (Hackathon Prototype)

### 1. Start the React Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
# The dashboard runs on http://localhost:5173
```

### 2. Start the FastAPI ML Backend
```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\Activate.ps1
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# The API runs on http://localhost:8000
# Swagger UI at http://localhost:8000/docs
```

### 3. Smart Contracts
- Located in `/contracts/ThreatRegistry.sol`
- Deployable via Hardhat or Remix IDE to Sepolia Testnet.

---

## ⚖️ Regulatory Compliance & Privacy
Aegis.AI is built strictly within the legal bounds of the **India DPDP Act (2023)**:
- **Publicly Available Data Exemption**: We only ingest data actively published in public Telegram domains. 
- **Zero PII Storage**: All artifacts are immediately hashed. Phone numbers and usernames are stripped at the ingestion layer.
- **Transparent Redressal**: The blockchain TCR inherently provides the "Right to Correction" for any falsely flagged application developer.
