# AetherAI: AI-Powered DeFi Infrastructure on Aptos

A secure DeFi infrastructure built on the Aptos blockchain that combines behavioral biometrics, Move AI Agents, and smart contract automation for enhanced security and liquidity optimization.

## Core Features

- Behavioral Biometrics Authentication
  - Keystroke pattern analysis
  - Mouse movement tracking
  - Transaction timing verification
- Move AI Agents for Risk Assessment
- Smart Contract Automation
- AI-Driven Liquidity Optimization

## Project Structure

```
├── sources/
│   └── defi_biometrics.move    # Move smart contracts
├── src/
│   ├── biometrics.ts          # Behavioral biometrics system
│   └── blockchain.ts          # Blockchain integration
├── Move.toml                  # Move package manifest
└── package.json              # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Aptos CLI
- TypeScript
- A code editor (VS Code recommended)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd aether-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment:
   - Copy `.env.example` to `.env`
   - Update environment variables with your credentials

### Configuration

1. Configure Aptos Network:
```bash
aptos init --network devnet
```

2. Set up Firebase:
   - Create a Firebase project
   - Add configuration in `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-domain",
    projectId: "your-project-id"
};
```

### Build and Deploy

1. Compile TypeScript:
```bash
npm run build
```

2. Deploy Move contracts:
```bash
aptos move publish
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
