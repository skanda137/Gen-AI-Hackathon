class TruthGuardPopup {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.initializeEventListeners();
        this.loadSelectedText();
    }

    initializeEventListeners() {
        const quickInput = document.getElementById('quickInput');
        const quickCheckBtn = document.getElementById('quickCheckBtn');
        const checkSelectedBtn = document.getElementById('checkSelectedBtn');
        const openWebsiteBtn = document.getElementById('openWebsiteBtn');
        const clearBtn = document.getElementById('clearBtn');
        const charCount = document.getElementById('charCount');

        // Character count update
        quickInput.addEventListener('input', () => {
            const count = quickInput.value.length;
            charCount.textContent = `${count}/250`;
            quickCheckBtn.disabled = count < 5 || count > 250;
        });

        // Quick check button
        quickCheckBtn.addEventListener('click', () => {
            this.checkCredibility(quickInput.value.trim());
        });

        // Check selected text button
        checkSelectedBtn.addEventListener('click', () => {
            const selectedText = document.getElementById('selectedText').textContent;
            this.checkCredibility(selectedText);
        });

        // Open website button
        openWebsiteBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:5001' });
        });

        // Clear button
        clearBtn.addEventListener('click', () => {
            this.clearAll();
        });

        // Enter key to submit (Ctrl+Enter)
        quickInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.checkCredibility(quickInput.value.trim());
            }
        });
    }

    async loadSelectedText() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Inject content script to get selected text
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    return window.getSelection().toString().trim();
                }
            });

            const selectedText = results[0].result;
            
            if (selectedText && selectedText.length > 0) {
                this.showSelectedText(selectedText);
            }
        } catch (error) {
            console.log('Could not get selected text:', error);
        }
    }

    showSelectedText(text) {
        const selectedTextSection = document.getElementById('selectedTextSection');
        const selectedTextElement = document.getElementById('selectedText');
        
        // Truncate text if too long
        const displayText = text.length > 200 ? text.substring(0, 200) + '...' : text;
        selectedTextElement.textContent = displayText;
        
        selectedTextSection.classList.remove('hidden');
    }

    async checkCredibility(text) {
        if (!text) {
            this.showError('Please enter some text to check.');
            return;
        }

        this.showLoading();
        this.hideResults();
        this.hideError();

        try {
            const response = await fetch(`${this.apiBaseUrl}/fact-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to check credibility');
            }

            this.displayResults(result);

        } catch (error) {
            console.error('Error:', error);
            this.showError(`Failed to check credibility: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    displayResults(result) {
        // Handle validation errors
        if (result.category === 'invalid_input' || 
            result.category === 'short_input' || 
            result.category === 'long_input') {
            this.showError(result.explanation);
            return;
        }

        // Handle API errors
        if (result.error) {
            this.showError(result.error);
            return;
        }

        // Display results
        this.updateScore(result.score);
        this.updateCategory(result.category);
        this.updateExplanation(result.explanation);
        this.updateTip(result.tip);
        this.updateFlags(result.flags);
        
        this.showResults();
    }

    updateScore(score) {
        const scoreValue = document.getElementById('scoreValue');
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreText = document.getElementById('scoreText');
        const scoreDescription = document.getElementById('scoreDescription');

        scoreValue.textContent = score;
        
        // Update score circle color based on risk level
        scoreCircle.className = 'score-circle';
        if (score <= 30) {
            scoreCircle.classList.add('low-risk');
            scoreText.textContent = 'Low Risk';
            scoreDescription.textContent = 'Content appears credible';
        } else if (score <= 70) {
            scoreCircle.classList.add('medium-risk');
            scoreText.textContent = 'Medium Risk';
            scoreDescription.textContent = 'May contain misleading info';
        } else {
            scoreCircle.classList.add('high-risk');
            scoreText.textContent = 'High Risk';
            scoreDescription.textContent = 'Likely contains misinformation';
        }
    }

    updateCategory(category) {
        const categoryElement = document.getElementById('category');
        categoryElement.textContent = category.replace(/_/g, ' ');
    }

    updateExplanation(explanation) {
        const explanationElement = document.getElementById('explanation');
        explanationElement.textContent = explanation;
    }

    updateTip(tip) {
        const tipElement = document.getElementById('tip');
        tipElement.textContent = tip;
    }

    updateFlags(flags) {
        const flagsContainer = document.getElementById('flags');
        flagsContainer.innerHTML = '';

        if (flags && flags.length > 0) {
            flags.forEach(flag => {
                const flagElement = document.createElement('span');
                flagElement.className = 'flag-item';
                flagElement.textContent = flag;
                flagsContainer.appendChild(flagElement);
            });
        } else {
            const noFlagsElement = document.createElement('span');
            noFlagsElement.textContent = 'No flags detected';
            noFlagsElement.style.color = '#718096';
            noFlagsElement.style.fontStyle = 'italic';
            flagsContainer.appendChild(noFlagsElement);
        }
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingState').classList.add('hidden');
    }

    showResults() {
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    hideResults() {
        document.getElementById('resultsSection').classList.add('hidden');
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        document.getElementById('errorState').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('errorState').classList.add('hidden');
    }

    clearAll() {
        // Clear input
        document.getElementById('quickInput').value = '';
        document.getElementById('charCount').textContent = '0/250';
        document.getElementById('quickCheckBtn').disabled = true;
        
        // Hide sections
        document.getElementById('selectedTextSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('loadingState').classList.add('hidden');
    }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TruthGuardPopup();
});
