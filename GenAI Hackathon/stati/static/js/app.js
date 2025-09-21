class TruthGuard {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const textInput = document.getElementById('textInput');
        const checkButton = document.getElementById('checkButton');
        const charCount = document.getElementById('charCount');

        // Character count update
        textInput.addEventListener('input', () => {
            const count = textInput.value.length;
            charCount.textContent = `${count}/250`;
            
            // Update button state
            checkButton.disabled = count < 5 || count > 250;
        });

        // Check button click
        checkButton.addEventListener('click', () => {
            this.checkCredibility();
        });

        // Enter key to submit (Ctrl+Enter)
        textInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.checkCredibility();
            }
        });
    }

    async checkCredibility() {
        const textInput = document.getElementById('textInput');
        const text = textInput.value.trim();

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

        // Display results with animation
        this.updateScore(result.score);
        this.updateCategory(result.category);
        this.updateExplanation(result.explanation);
        this.updateTip(result.tip);
        this.updateFlags(result.flags);
        
        this.showResults();
        
        // Add success animation
        const resultCard = document.querySelector('.result-card');
        if (resultCard) {
            resultCard.classList.add('success');
            setTimeout(() => resultCard.classList.remove('success'), 600);
        }
        
        // Add confetti effect for low risk scores
        if (result.score <= 30) {
            this.createConfetti();
        }
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
            scoreDescription.textContent = 'Content appears to be credible';
        } else if (score <= 70) {
            scoreCircle.classList.add('medium-risk');
            scoreText.textContent = 'Medium Risk';
            scoreDescription.textContent = 'Content may contain misleading information';
        } else {
            scoreCircle.classList.add('high-risk');
            scoreText.textContent = 'High Risk';
            scoreDescription.textContent = 'Content likely contains misinformation';
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
            noFlagsElement.textContent = 'No specific flags detected';
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
    
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f093fb', '#ffd700'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TruthGuard();
});

// Add some example text functionality
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    
    // Add example text on focus if empty
    textInput.addEventListener('focus', () => {
        if (!textInput.value.trim()) {
            textInput.placeholder = 'Example: "The Earth is flat and NASA is lying about space travel"';
        }
    });
    
    textInput.addEventListener('blur', () => {
        if (!textInput.value.trim()) {
            textInput.placeholder = 'Enter the text you want to fact-check... (5-250 characters)';
        }
    });
});
