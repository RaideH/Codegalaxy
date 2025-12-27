/**
 * Learn HTML Page - Interactive Learning Module
 * Senior Developer Refactored Version
 */

// Course topics data with metadata
const htmlTopics = [
    { id: 1, title: 'HTML Editors', difficulty: 'beginner', duration: '10 min' },
    { id: 2, title: 'HTML Basic', difficulty: 'beginner', duration: '15 min' },
    { id: 3, title: 'HTML Elements', difficulty: 'beginner', duration: '20 min' },
    { id: 4, title: 'HTML Attributes', difficulty: 'beginner', duration: '20 min' },
    { id: 5, title: 'HTML Headings', difficulty: 'beginner', duration: '10 min' },
    { id: 6, title: 'HTML Paragraphs', difficulty: 'beginner', duration: '15 min' },
    { id: 7, title: 'HTML Styles', difficulty: 'intermediate', duration: '25 min' },
    { id: 8, title: 'HTML Formatting', difficulty: 'beginner', duration: '15 min' },
    { id: 9, title: 'HTML Quotations', difficulty: 'beginner', duration: '10 min' },
    { id: 10, title: 'HTML Comments', difficulty: 'beginner', duration: '10 min' },
    { id: 11, title: 'HTML Colors', difficulty: 'beginner', duration: '15 min' },
    { id: 12, title: 'HTML CSS', difficulty: 'intermediate', duration: '30 min' },
    { id: 13, title: 'HTML Links', difficulty: 'beginner', duration: '20 min' },
    { id: 14, title: 'HTML Images', difficulty: 'beginner', duration: '20 min' },
    { id: 15, title: 'HTML Favicon', difficulty: 'beginner', duration: '10 min' },
    { id: 16, title: 'HTML Page Title', difficulty: 'beginner', duration: '5 min' },
    { id: 17, title: 'HTML Tables', difficulty: 'intermediate', duration: '30 min' },
    { id: 18, title: 'HTML Lists', difficulty: 'beginner', duration: '20 min' },
    { id: 19, title: 'HTML Block & Inline', difficulty: 'intermediate', duration: '25 min' },
    { id: 20, title: 'HTML Div', difficulty: 'intermediate', duration: '20 min' },
    { id: 21, title: 'HTML Classes', difficulty: 'intermediate', duration: '25 min' },
    { id: 22, title: 'HTML Id', difficulty: 'intermediate', duration: '20 min' },
    { id: 23, title: 'HTML Iframes', difficulty: 'intermediate', duration: '20 min' },
    { id: 24, title: 'HTML JavaScript', difficulty: 'advanced', duration: '30 min' },
    { id: 25, title: 'HTML File Paths', difficulty: 'beginner', duration: '15 min' },
    { id: 26, title: 'HTML Head', difficulty: 'intermediate', duration: '20 min' },
    { id: 27, title: 'HTML Layout', difficulty: 'intermediate', duration: '30 min' },
    { id: 28, title: 'HTML Responsive', difficulty: 'advanced', duration: '35 min' },
    { id: 29, title: 'HTML Computercode', difficulty: 'beginner', duration: '15 min' },
    { id: 30, title: 'HTML Semantics', difficulty: 'advanced', duration: '30 min' },
    { id: 31, title: 'HTML Style Guide', difficulty: 'intermediate', duration: '25 min' }
];

// Difficulty badge colors
const difficultyColors = {
    beginner: '#28a745',
    intermediate: '#ffc107',
    advanced: '#dc3545'
};

/**
 * Creates a topic list item element
 * @param {Object} topic - Topic object
 * @param {number} index - Topic index
 * @returns {HTMLLIElement}
 */
function createTopicItem(topic, index) {
    const li = document.createElement('li');
    li.className = 'topic-item';
    li.setAttribute('data-topic-id', topic.id);
    li.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        margin-bottom: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border-left: 4px solid ${difficultyColors[topic.difficulty]};
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;

    // Topic content
    const contentDiv = document.createElement('div');
    contentDiv.style.flex = '1';
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'topic-title';
    titleSpan.textContent = `${index + 1}. ${topic.title}`;
    titleSpan.style.cssText = 'font-weight: 600; display: block; margin-bottom: 0.5rem;';
    
    const metaDiv = document.createElement('div');
    metaDiv.style.cssText = 'display: flex; gap: 1rem; font-size: 0.9rem; opacity: 0.8;';
    
    const difficultyBadge = document.createElement('span');
    difficultyBadge.className = 'difficulty-badge';
    difficultyBadge.textContent = topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1);
    difficultyBadge.style.cssText = `
        background: ${difficultyColors[topic.difficulty]};
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    `;
    
    const durationSpan = document.createElement('span');
    durationSpan.className = 'topic-duration';
    durationSpan.textContent = `⏱️ ${topic.duration}`;
    
    metaDiv.appendChild(difficultyBadge);
    metaDiv.appendChild(durationSpan);
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(metaDiv);
    
    // Arrow icon
    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '→';
    arrowSpan.style.cssText = `
        font-size: 1.5rem;
        color: #FFD700;
        transition: transform 0.3s ease;
    `;
    
    li.appendChild(contentDiv);
    li.appendChild(arrowSpan);
    
    // Hover effects
    li.addEventListener('mouseenter', () => {
        li.style.transform = 'translateX(8px)';
        li.style.background = 'rgba(255, 215, 0, 0.1)';
        arrowSpan.style.transform = 'translateX(5px)';
    });
    
    li.addEventListener('mouseleave', () => {
        li.style.transform = 'translateX(0)';
        li.style.background = 'rgba(255, 255, 255, 0.05)';
        arrowSpan.style.transform = 'translateX(0)';
    });
    
    // Click handler
    li.addEventListener('click', () => {
        handleTopicClick(topic);
    });
    
    // Keyboard accessibility
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Learn ${topic.title}, ${topic.difficulty} level, ${topic.duration}`);
    
    li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTopicClick(topic);
        }
    });
    
    return li;
}

/**
 * Handles topic click event
 * @param {Object} topic - Topic object
 */
function handleTopicClick(topic) {
    console.log(`Opening topic: ${topic.title}`);
    
    // Show toast notification
    showToast(`Loading: ${topic.title}...`, 'info');
    
    // TODO: Navigate to topic page or open modal
    // For now, we'll just log it
    // window.location.href = `topic.html?id=${topic.id}`;
}

/**
 * Shows a toast notification
 * @param {string} message - Message text
 * @param {string} type - Toast type (success, error, info)
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0d6efd'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Renders the topics list
 */
function renderTopicsList() {
    const contentContainer = document.getElementById('content');
    
    if (!contentContainer) {
        console.error('Content container not found!');
        return;
    }
    
    // Clear existing content
    contentContainer.innerHTML = '';
    
    // Create list container
    const listContainer = document.createElement('ol');
    listContainer.className = 'topics-list';
    listContainer.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        max-width: 900px;
    `;
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Add each topic to the fragment
    htmlTopics.forEach((topic, index) => {
        const topicItem = createTopicItem(topic, index);
        fragment.appendChild(topicItem);
    });
    
    // Append all items at once
    listContainer.appendChild(fragment);
    contentContainer.appendChild(listContainer);
    
    // Add loading animation
    animateTopicsIn();
}

/**
 * Animates topics entrance
 */
function animateTopicsIn() {
    const topics = document.querySelectorAll('.topic-item');
    
    topics.forEach((topic, index) => {
        topic.style.opacity = '0';
        topic.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            topic.style.transition = 'all 0.5s ease';
            topic.style.opacity = '1';
            topic.style.transform = 'translateY(0)';
        }, index * 50); // Stagger animation
    });
}

/**
 * Adds search functionality
 */
function initializeSearch() {
    const contentContainer = document.getElementById('content');
    
    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        width: 100%;
        max-width: 900px;
        margin-bottom: 2rem;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search topics...';
    searchInput.id = 'topic-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        color: white;
        transition: all 0.3s ease;
    `;
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#FFD700';
        searchInput.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        searchInput.style.boxShadow = 'none';
    });
    
    searchInput.addEventListener('input', (e) => {
        filterTopics(e.target.value.toLowerCase());
    });
    
    searchContainer.appendChild(searchInput);
    contentContainer.insertBefore(searchContainer, contentContainer.firstChild);
}

/**
 * Filters topics based on search query
 * @param {string} query - Search query
 */
function filterTopics(query) {
    const topics = document.querySelectorAll('.topic-item');
    
    topics.forEach(topic => {
        const title = topic.querySelector('.topic-title').textContent.toLowerCase();
        const matches = title.includes(query);
        
        topic.style.display = matches ? 'flex' : 'none';
        
        if (matches && query.length > 0) {
            // Highlight matching text
            const titleElement = topic.querySelector('.topic-title');
            const originalText = titleElement.textContent;
            const highlightedText = originalText.replace(
                new RegExp(query, 'gi'),
                match => `<mark style="background: #FFD700; color: #000; padding: 2px 4px; border-radius: 3px;">${match}</mark>`
            );
            titleElement.innerHTML = highlightedText;
        }
    });
}

/**
 * Initialize page on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Learn HTML page initialized');
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Render topics list
    renderTopicsList();
    
    // Initialize search
    initializeSearch();
    
    // Log success
    console.log(`✅ Successfully loaded ${htmlTopics.length} HTML topics`);
});