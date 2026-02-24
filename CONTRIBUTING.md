# Contributing to ScamWatch GH

Thank you for your interest in making the digital space in Ghana safer! ScamWatch GH is a community-driven open-source project.

## How Submissions Work

To maintain the integrity and legality of this directory, we require **peer review** and **evidence** for every single phone number added to the database. We cannot accept numbers based purely on hearsay.

### Step 1: Gather Evidence
Before you submit a PR, make sure you have verifiable evidence. This could include:
*   **Screenshots**: Unaltered screenshots of SMS messages, WhatsApp chats, or call logs.
*   **SMS Text**: The exact text of the phishing or malicious link you received.
*   **Audio/Context**: A detailed explanation of the call and the specific social engineering tactics the scammer used.

### Step 2: Fork and Modify
1. Fork this repository to your own GitHub account.
2. Open the `script.js` file in your editor.
3. Scroll to the `SCAM_DATA` array at the top of the file.
4. Add a new JavaScript object to the array with the new scam number details.

**Example Entry:**
```javascript
{
    id: 's-005', // Make sure this indicates the next logical ID
    number: '024 123 4567',
    category: 'phishing', // Options: 'momo', 'phishing', 'impersonation', 'other'
    categoryLabel: 'Fake Bank Alert',
    modusOperandi: 'They sent an SMS claiming my bank account had been locked and provided a fake link to unlock it.',
    evidence: [
        'Dear Customer, your GCB account has been restricted. Click here to verify your identity: https://fake-bank-gh.com/login'
    ],
    tags: ['Bank', 'SMS', 'Phishing URL'],
    dateReported: '2024-02-24',
    riskLevel: 'high'
}
```

### Step 3: Create a Pull Request (PR)
1. Commit your changes in your forked repository.
2. Create a Pull Request against the main branch of `ghana-scam-numbers`.
3. **CRITICAL:** In the description of your Pull Request, you MUST include your evidence.
    *   Paste the screenshots into the PR description.
    *   Explain exactly what occurred.

### Step 4: Peer Review
The maintainers and the community will review your PR. They will examine the evidence provided. If the evidence is substantial and verifiable, your PR will be approved and merged into the main codebase, making the number publicly visible on the ScamWatch GH directory.

## UI/Code Contributions
If you are a developer looking to improve the UI, add new features, or optimize the code, you are highly encouraged to submit PRs! 

Please ensure your changes:
*   Maintain the premium, dark-mode, glassmorphism aesthetic.
*   Are fully responsive and tested on mobile devices.
*   Do not introduce heavy third-party libraries unless absolutely necessary.
