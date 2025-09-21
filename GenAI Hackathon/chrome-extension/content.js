// Content script for TruthGuard Chrome Extension
class TruthGuardContent {
    constructor() {
        this.isActive = false;
        this.overlay = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getSelectedText') {
                const selectedText = window.getSelection().toString().trim();
                sendResponse({ text: selectedText });
            } else if (request.action === 'highlightText') {
                this.highlightText(request.text, request.score);
            }
        });

        // Add context menu functionality
        document.addEventListener('contextmenu', (e) => {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 5) {
                this.showContextMenu(e, selectedText);
            }
        });

        // Hide context menu on click
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(event, selectedText) {
        // Remove existing context menu
        this.hideContextMenu();

        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'truthguard-context-menu';
        contextMenu.innerHTML = `
            <div class="truthguard-menu-item" data-action="check">
                <i class="fas fa-shield-alt"></i>
                Check with TruthGuard
            </div>
        `;

        // Position the menu
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';
        contextMenu.style.zIndex = '10000';

        // Add click handler
        contextMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('[data-action="check"]')) {
                this.checkSelectedText(selectedText);
            }
            this.hideContextMenu();
        });

        document.body.appendChild(contextMenu);
    }

    hideContextMenu() {
        const existingMenu = document.getElementById('truthguard-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    async checkSelectedText(text) {
        try {
            // Show loading indicator
            this.showLoadingIndicator();

            const response = await fetch('http://localhost:5001/api/fact-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const result = await response.json();

            if (response.ok && !result.error) {
                this.showResultOverlay(text, result);
            } else {
                this.showError('Failed to check credibility');
            }
        } catch (error) {
            console.error('Error checking text:', error);
            this.showError('Failed to connect to TruthGuard service');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'truthguard-loading';
        indicator.innerHTML = `
            <div class="truthguard-loading-content">
                <div class="truthguard-spinner"></div>
                <span>Checking credibility...</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('truthguard-loading');
        if (indicator) {
            indicator.remove();
        }
    }

    showResultOverlay(originalText, result) {
        // Remove existing overlay
        this.hideResultOverlay();

        const overlay = document.createElement('div');
        overlay.id = 'truthguard-overlay';
        
        const riskLevel = this.getRiskLevel(result.score);
        const riskColor = this.getRiskColor(result.score);
        
        overlay.innerHTML = `
            <div class="truthguard-overlay-content">
                <div class="truthguard-header">
                    <div class="truthguard-logo">
                        <i class="fas fa-shield-alt"></i>
                        <span>TruthGuard</span>
                    </div>
                    <button class="truthguard-close" onclick="this.closest('#truthguard-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="truthguard-result">
                    <div class="truthguard-score">
                        <div class="truthguard-score-circle ${riskLevel}" style="background: ${riskColor}">
                            <span>${result.score}</span>
                        </div>
                        <div class="truthguard-score-info">
                            <h3>${this.getRiskText(result.score)}</h3>
                            <p>Credibility Score: ${result.score}/100</p>
                        </div>
                    </div>
                    
                    <div class="truthguard-details">
                        <div class="truthguard-detail-item">
                            <strong>Category:</strong>
                            <span class="truthguard-category">${result.category.replace(/_/g, ' ')}</span>
                        </div>
                        
                        <div class="truthguard-detail-item">
                            <strong>Analysis:</strong>
                            <p>${result.explanation}</p>
                        </div>
                        
                        <div class="truthguard-detail-item">
                            <strong>Verification Tip:</strong>
                            <p>${result.tip}</p>
                        </div>
                        
                        ${result.flags && result.flags.length > 0 ? `
                        <div class="truthguard-detail-item">
                            <strong>Red Flags:</strong>
                            <div class="truthguard-flags">
                                ${result.flags.map(flag => `<span class="truthguard-flag">${flag}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="truthguard-actions">
                    <button class="truthguard-action-btn" onclick="window.open('http://localhost:5001', '_blank')">
                        <i class="fas fa-globe"></i>
                        Open Full Website
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;

        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideResultOverlay();
        }, 10000);
    }

    hideResultOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    showError(message) {
        const errorOverlay = document.createElement('div');
        errorOverlay.id = 'truthguard-error';
        errorOverlay.innerHTML = `
            <div class="truthguard-error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="this.closest('#truthguard-error').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(errorOverlay);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorOverlay.parentNode) {
                errorOverlay.remove();
            }
        }, 5000);
    }

    getRiskLevel(score) {
        if (score <= 30) return 'low-risk';
        if (score <= 70) return 'medium-risk';
        return 'high-risk';
    }

    getRiskColor(score) {
        if (score <= 30) return 'linear-gradient(135deg, #48bb78, #38a169)';
        if (score <= 70) return 'linear-gradient(135deg, #ed8936, #dd6b20)';
        return 'linear-gradient(135deg, #f56565, #e53e3e)';
    }

    getRiskText(score) {
        if (score <= 30) return 'Low Risk';
        if (score <= 70) return 'Medium Risk';
        return 'High Risk';
    }
}

// Initialize the content script
if (typeof window.truthGuardContent === 'undefined') {
    window.truthGuardContent = new TruthGuardContent();
}
