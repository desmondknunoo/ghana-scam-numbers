/**
 * ScamWatch GH - Frontend Logic and Data
 */

const SCAM_DATA = [
    {
        id: 's-001',
        number: '053 489 2836',
        category: 'momo',
        categoryLabel: 'MTN Impersonation',
        modusOperandi: 'They call and impersonate MTN Ghana offices to perform social engineering. The goal is to trick you into revealing personal info and your Mobile Money PIN.',
        evidence: [],
        tags: ['MTN', 'MoMo Fraud', 'Voice Call'],
        dateReported: '2024-02-24', // using today's simulated date for recency
        riskLevel: 'high'
    },
    {
        id: 's-002',
        number: '+233 50 409 7485',
        category: 'phishing',
        categoryLabel: 'DVLA Impersonation',
        modusOperandi: 'They impersonate DVLA Ghana and send malicious SMS links containing fake warning messages about traffic tickets to steal credentials or install malware.',
        evidence: [
            'Warning: Your vehicle has multiple unpaid traffic violations. Immediate action required or legal action and late fees will apply. https://lihi.cc/ uRnou'
        ],
        tags: ['DVLA', 'SMS', 'Phishing URL', 'Malware'],
        dateReported: '2024-02-23',
        riskLevel: 'high'
    },
    {
        id: 's-003',
        number: '+233 50 411 3419',
        category: 'phishing',
        categoryLabel: 'DVLA Impersonation',
        modusOperandi: 'They impersonate DVLA Ghana and send malicious SMS links containing fake warning messages about traffic tickets to steal credentials or install malware.',
        evidence: [
            'Traffic: You have an outstanding traffic ticket. This is your last reminder before the fine increases. https://lihi.cc/ WCKXM'
        ],
        tags: ['DVLA', 'SMS', 'Phishing URL', 'Malware'],
        dateReported: '2024-02-23',
        riskLevel: 'high'
    },
    {
        id: 's-004',
        number: '+233 20 811 4940',
        category: 'phishing',
        categoryLabel: 'DVLA Impersonation',
        modusOperandi: 'They impersonate DVLA Ghana and send malicious SMS links containing fake warning messages about traffic tickets to steal credentials or install malware.',
        evidence: [
            'Traffic: You have an outstanding traffic ticket. This is your last reminder before the fine increases. https://lihi.cc/OOcFS'
        ],
        tags: ['DVLA', 'SMS', 'Phishing URL', 'Malware'],
        dateReported: '2024-02-23',
        riskLevel: 'high'
    }
];

// DOM Elements
const gridContainer = document.getElementById('scamGrid');
const cardTemplate = document.getElementById('scamCardTemplate');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-pill');
const noResultsDiv = document.getElementById('noResults');
const totalNumbersSpan = document.getElementById('totalNumbers');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Initial Render
    renderCards(SCAM_DATA);
    updateStats(SCAM_DATA);

    // Event Listeners
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            handleSearch();
        });
    });
});

// Render logic
function renderCards(data) {
    gridContainer.innerHTML = '';

    if (data.length === 0) {
        noResultsDiv.classList.remove('hidden');
        return;
    }

    noResultsDiv.classList.add('hidden');

    data.forEach(item => {
        const clone = cardTemplate.content.cloneNode(true);
        const cardNode = clone.querySelector('.scam-card');

        cardNode.dataset.category = item.category;

        clone.querySelector('.category-badge').textContent = item.categoryLabel;
        clone.querySelector('.phone-number').textContent = item.number;
        clone.querySelector('.mo-text').textContent = item.modusOperandi;
        clone.querySelector('.date-text').textContent = formatDate(item.dateReported);

        // Handle Evidence
        if (item.evidence && item.evidence.length > 0) {
            const evidenceSection = clone.querySelector('.evidence-section');
            const evidenceList = clone.querySelector('.evidence-list');
            evidenceSection.classList.remove('hidden');

            item.evidence.forEach(ev => {
                const li = document.createElement('li');
                li.className = 'evidence-item';
                li.textContent = ev;
                evidenceList.appendChild(li);
            });
        }

        // Handle Tags
        const tagsContainer = clone.querySelector('.target-tags');
        item.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        // Setup Copy Button
        const copyBtn = clone.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(item.number).then(() => {
                const icon = copyBtn.querySelector('i');
                icon.className = 'ph ph-check text-accent';
                setTimeout(() => {
                    icon.className = 'ph ph-copy';
                }, 2000);
            });
        });

        gridContainer.appendChild(clone);
    });
}

// Search and Filter Logic
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilterBtn = document.querySelector('.filter-pill.active');
    const filterCategory = activeFilterBtn.dataset.filter;

    const filteredData = SCAM_DATA.filter(item => {
        // Match Search
        const searchString = `${item.number} ${item.categoryLabel} ${item.modusOperandi} ${item.tags.join(' ')}`.toLowerCase();
        const matchesSearch = searchString.includes(searchTerm);

        // Match Category
        const matchesCategory = filterCategory === 'all' ||
            (filterCategory === 'impersonation' && (item.category === 'momo' || item.category === 'phishing')) ||
            item.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    renderCards(filteredData);
}

// Utils
function updateStats(data) {
    // Animate counter
    let count = 0;
    const target = data.length;
    const interval = setInterval(() => {
        if (count >= target) {
            clearInterval(interval);
            totalNumbersSpan.textContent = target;
        } else {
            count++;
            totalNumbersSpan.textContent = count;
        }
    }, 100);
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
