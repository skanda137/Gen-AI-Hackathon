// Background script for TruthGuard Chrome Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('TruthGuard extension installed');
        
        // Set default settings
        chrome.storage.sync.set({
            apiUrl: 'http://localhost:5000/api',
            autoCheck: false,
            showNotifications: true
        });
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkCredibility') {
        handleCredibilityCheck(request.text, sendResponse);
        return true; // Keep message channel open for async response
    } else if (request.action === 'getSettings') {
        chrome.storage.sync.get(['apiUrl', 'autoCheck', 'showNotifications'], (result) => {
            sendResponse(result);
        });
        return true;
    } else if (request.action === 'saveSettings') {
        chrome.storage.sync.set(request.settings, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// Handle credibility check
async function handleCredibilityCheck(text, sendResponse) {
    try {
        const settings = await chrome.storage.sync.get(['apiUrl']);
        const apiUrl = settings.apiUrl || 'http://localhost:5000/api';
        
        const response = await fetch(`${apiUrl}/fact-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        const result = await response.json();
        
        if (response.ok) {
            sendResponse({ success: true, result: result });
            
            // Show notification if enabled and high risk
            if (result.score > 70) {
                const notificationSettings = await chrome.storage.sync.get(['showNotifications']);
                if (notificationSettings.showNotifications !== false) {
                    showNotification(result);
                }
            }
        } else {
            sendResponse({ success: false, error: result.error || 'Failed to check credibility' });
        }
    } catch (error) {
        console.error('Error in background script:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Show notification for high-risk content
function showNotification(result) {
    const riskLevel = result.score > 80 ? 'High' : 'Medium';
    const message = `TruthGuard detected ${riskLevel.toLowerCase()}-risk content: ${result.category}`;
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'TruthGuard Alert',
        message: message,
        priority: 1
    });
}

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Only inject on http/https pages
        if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }).catch(() => {
                // Ignore errors (e.g., chrome:// pages)
            });
        }
    }
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'truthguard-check',
        title: 'Check with TruthGuard',
        contexts: ['selection']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'truthguard-check' && info.selectionText) {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
            action: 'checkSelectedText',
            text: info.selectionText
        });
    }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === 'check-selected') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'checkSelectedText'
            });
        });
    }
});
