# ScamWatch GH 🛡️

A community-driven, open-source directory of phone numbers actively used by scammers in Ghana for Mobile Money (MoMo) fraud, phishing attacks (like fake DVLA links), and impersonation.

The goal is to serve as a reliable, public database where citizens, MTN Ghana, Telecel, and the Ghana Police can identify and track malicious numbers and their modus operandi.

## 🚀 The Project

This directory is an entirely static, lightweight, and blazing fast frontend built with semantic HTML5, Vanilla CSS with premium glassmorphism/dark mode aesthetics, and Vanilla JavaScript. 

It does not rely on a backend. Instead, the "database" is the codebase itself, and additions are managed entirely through **Open Source Pull Requests**.

## 🤝 How to Contribute (Add a Number)

We rely on the community to keep this directory updated and accurate. If you have encountered a scam number, you can submit it to the directory.

Because this is a public directory that impacts the reputation of phone numbers, **all submissions are highly vetted based on evidence**.

Please read out complete [Contribution Guidelines](CONTRIBUTING.md) before submitting a Pull Request.

### Quick Start for Contributors:
1. Fork this repository.
2. Edit `script.js`.
3. Locate the `SCAM_DATA` array.
4. Add a new object to the array following the data schema.
5. Submit a Pull Request with your evidence attached in the PR description (Screenshots, SMS texts, Audio recordings, etc.).

### Data Schema
```javascript
{
    id: 's-005', // Increment ID
    number: '+233 55 000 0000', // Format nicely
    category: 'momo', // 'momo', 'phishing', 'impersonation', etc.
    categoryLabel: 'MTN Impersonation',
    modusOperandi: 'Brief description of how they operate.',
    evidence: [
        'Text of SMS message received from number'
    ], // Array of strings if applicable
    tags: ['MTN', 'SMS', 'MoMo'], // Relevant tags
    dateReported: '2024-02-24', // YYYY-MM-DD
    riskLevel: 'high'
}
```

## 🛠️ Local Development

If you want to run the project locally to test your UI changes:
1. Clone the repository.
2. Open the directory in your terminal.
3. Serve it using a simple HTTP server, e.g., `npx http-server . -p 8080`.
4. Open your browser to `http://localhost:8080`.

## 📄 License

This project is open-source and available under the MIT License.
