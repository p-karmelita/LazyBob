// ===== AI Chat Assistant =====

class ChatAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadKnowledgeBase();
    }

    initializeElements() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatMinimize = document.getElementById('chatMinimize');
        this.chatBody = document.getElementById('chatBody');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatSuggestions = document.getElementById('chatSuggestions');
    }

    attachEventListeners() {
        // Toggle chat
        this.chatToggle?.addEventListener('click', () => this.toggleChat());
        this.chatMinimize?.addEventListener('click', () => this.toggleChat());
        
        // Send message
        this.chatSend?.addEventListener('click', () => this.sendMessage());
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Suggestion chips
        const chips = document.querySelectorAll('.suggestion-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.dataset.question;
                this.chatInput.value = question;
                this.sendMessage();
            });
        });
    }

    loadKnowledgeBase() {
        this.knowledgeBase = {
            'analyze': {
                keywords: ['analyze', 'analysis', 'code', 'scan', 'check'],
                response: `To analyze your code:
                
1. Click the "Run Analysis" button in the Code Analysis section
2. Enter the path you want to analyze (e.g., ./src)
3. Wait for the analysis to complete
4. Review the results, including:
   - Code quality metrics
   - Issues and recommendations
   - Complexity analysis
   - Dependencies

Would you like me to navigate you to the Code Analysis section?`,
                action: () => {
                    document.querySelector('[data-section="code-analysis"]')?.click();
                }
            },
            'workflow': {
                keywords: ['workflow', 'automation', 'create workflow', 'automate'],
                response: `To create a workflow:

1. Go to the Workflows section
2. Click "Create Workflow" button
3. Enter workflow details:
   - Name: Give it a descriptive name
   - Description: What it does
   - Steps: Comma-separated list (e.g., analyze,review,report)
4. Click OK to save

You can also run existing workflows by clicking the "Run" button next to them.

Would you like me to take you to the Workflows section?`,
                action: () => {
                    document.querySelector('[data-section="workflows"]')?.click();
                }
            },
            'report': {
                keywords: ['report', 'generate', 'download', 'export'],
                response: `To generate a report:

1. Navigate to the Reports section
2. Click "Generate Report" button
3. Select report type:
   - 1: Performance Report
   - 2: Security Audit
   - 3: Code Quality Report
   - 4: Full Report (recommended)
4. The report will download automatically as a JSON file

The report includes all your project statistics, Bobcoin usage, and workflow history.

Shall I navigate you to the Reports section?`,
                action: () => {
                    document.querySelector('[data-section="reports"]')?.click();
                }
            },
            'bobcoin': {
                keywords: ['bobcoin', 'usage', 'coins', 'balance', 'credit'],
                response: `To monitor your Bobcoin usage:

1. Go to the Bob Usage section
2. View your current balance and usage statistics
3. Check the usage history table for detailed transactions
4. Analyze usage trends with the charts

You have a total of 40 Bobcoins per team member. The dashboard shows real-time usage tracking.

Would you like to see your Bob Usage now?`,
                action: () => {
                    document.querySelector('[data-section="bob-usage"]')?.click();
                }
            },
            'help': {
                keywords: ['help', 'how', 'what', 'guide', 'tutorial', 'start'],
                response: `I can help you with:

📊 **Dashboard Features:**
- Overview: View project statistics
- Code Analysis: Analyze your codebase
- Bob Usage: Monitor Bobcoin usage
- Workflows: Create and run automations
- Reports: Generate and download reports

🤖 **Common Tasks:**
- "How do I analyze my code?"
- "How do I create a workflow?"
- "How do I generate a report?"
- "Show me my Bobcoin usage"

💡 **Tips:**
- Use the navigation menu on the left
- Click refresh to update data
- All features work in real-time

What would you like to do?`
            },
            'features': {
                keywords: ['features', 'capabilities', 'what can', 'functions'],
                response: `LazyBob Dashboard Features:

🔍 **Code Analysis**
- Analyze codebase structure
- Detect issues and vulnerabilities
- Get quality metrics
- View complexity analysis

⚙️ **Workflow Automation**
- Create custom workflows
- Run pre-configured automations
- Track execution history
- Monitor performance

📊 **Analytics & Reports**
- Real-time statistics
- Bobcoin usage tracking
- Activity monitoring
- Downloadable reports

🤖 **AI Integration**
- watsonx AI support
- Code suggestions
- Automated reviews
- Smart insights

Which feature would you like to explore?`
            }
        };
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWidget.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            this.chatInput?.focus();
            // Hide welcome message after first open
            const welcome = this.chatBody.querySelector('.chat-welcome');
            if (this.messages.length > 0 && welcome) {
                welcome.style.display = 'none';
            }
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Hide welcome and suggestions
        const welcome = this.chatBody.querySelector('.chat-welcome');
        if (welcome) welcome.style.display = 'none';
        this.chatSuggestions.style.display = 'none';
        
        // Show typing indicator
        this.showTyping();
        
        // Get response
        try {
            const response = await this.getResponse(message);
            this.hideTyping();
            this.addMessage(response.text, 'assistant');
            
            // Execute action if available
            if (response.action) {
                setTimeout(() => {
                    this.addActionButton(response.actionText, response.action);
                }, 500);
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' 
            ? '<i class="fas fa-user"></i>' 
            : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.messages.push({ text, sender, timestamp: new Date() });
    }

    addActionButton(text, action) {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'chat-message assistant';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const button = document.createElement('button');
        button.className = 'chat-action-btn';
        button.innerHTML = `<i class="fas fa-arrow-right"></i> ${text}`;
        button.onclick = () => {
            action();
            this.toggleChat();
        };
        
        content.appendChild(button);
        buttonDiv.appendChild(avatar);
        buttonDiv.appendChild(content);
        
        this.chatMessages.appendChild(buttonDiv);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    async getResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const lowerMessage = message.toLowerCase();
        
        // Check knowledge base
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return {
                    text: data.response,
                    action: data.action,
                    actionText: `Go to ${key.charAt(0).toUpperCase() + key.slice(1)}`
                };
            }
        }
        
        // Default response
        return {
            text: `I understand you're asking about "${message}". 

Here are some things I can help with:
- Code analysis and quality checks
- Creating and running workflows
- Generating reports
- Monitoring Bobcoin usage
- Understanding dashboard features

Could you rephrase your question or ask about one of these topics?`
        };
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatAssistant = new ChatAssistant();
});

// Made with Bob