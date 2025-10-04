import { marked } from 'marked';
import DOMPurify from 'dompurify';

class MarkdownBlog {
    constructor() {
        this.posts = this.loadPosts();
        this.currentPost = null;
        this.selectedTag = null;
        this.searchQuery = '';

        this.initializeElements();
        this.setupEventListeners();
        this.loadTheme();
        this.render();
    }

    initializeElements() {
        this.elements = {
            newPostBtn: document.getElementById('newPost'),
            toggleThemeBtn: document.getElementById('toggleTheme'),
            searchInput: document.getElementById('searchInput'),
            tagList: document.getElementById('tagList'),
            postList: document.getElementById('postList'),
            viewMode: document.getElementById('viewMode'),
            editMode: document.getElementById('editMode'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            postView: document.getElementById('postView'),
            postTitle: document.getElementById('postTitle'),
            postTags: document.getElementById('postTags'),
            markdownEditor: document.getElementById('markdownEditor'),
            markdownPreview: document.getElementById('markdownPreview'),
            savePostBtn: document.getElementById('savePost'),
            cancelEditBtn: document.getElementById('cancelEdit'),
            deletePostBtn: document.getElementById('deletePost')
        };
    }

    setupEventListeners() {
        this.elements.newPostBtn.addEventListener('click', () => this.createNewPost());
        this.elements.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.markdownEditor.addEventListener('input', (e) => this.updatePreview(e.target.value));
        this.elements.savePostBtn.addEventListener('click', () => this.savePost());
        this.elements.cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        this.elements.deletePostBtn.addEventListener('click', () => this.deletePost());
    }

    loadPosts() {
        const stored = localStorage.getItem('markdownPosts');
        return stored ? JSON.parse(stored) : [];
    }

    savePosts() {
        localStorage.setItem('markdownPosts', JSON.stringify(this.posts));
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.elements.toggleThemeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.elements.toggleThemeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    createNewPost() {
        this.currentPost = null;
        this.elements.postTitle.value = '';
        this.elements.postTags.value = '';
        this.elements.markdownEditor.value = '';
        this.elements.markdownPreview.innerHTML = '';
        this.elements.deletePostBtn.classList.add('hidden');
        this.showEditMode();
    }

    editPost(post) {
        this.currentPost = post;
        this.elements.postTitle.value = post.title;
        this.elements.postTags.value = post.tags.join(', ');
        this.elements.markdownEditor.value = post.content;
        this.updatePreview(post.content);
        this.elements.deletePostBtn.classList.remove('hidden');
        this.showEditMode();
    }

    savePost() {
        const title = this.elements.postTitle.value.trim();
        const content = this.elements.markdownEditor.value.trim();
        const tags = this.elements.postTags.value.split(',').map(t => t.trim()).filter(t => t);

        if (!title || !content) {
            alert('Please provide both title and content');
            return;
        }

        const post = {
            id: this.currentPost?.id || Date.now(),
            title,
            content,
            tags,
            createdAt: this.currentPost?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentPost) {
            const index = this.posts.findIndex(p => p.id === this.currentPost.id);
            this.posts[index] = post;
        } else {
            this.posts.unshift(post);
        }

        this.savePosts();
        this.viewPost(post);
        this.render();
    }

    deletePost() {
        if (!this.currentPost) return;

        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(p => p.id !== this.currentPost.id);
            this.savePosts();
            this.currentPost = null;
            this.showWelcomeScreen();
            this.render();
        }
    }

    cancelEdit() {
        if (this.currentPost) {
            this.viewPost(this.currentPost);
        } else {
            this.showWelcomeScreen();
        }
    }

    viewPost(post) {
        this.currentPost = post;
        const html = DOMPurify.sanitize(marked.parse(post.content));

        this.elements.postView.innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span>📅 ${new Date(post.createdAt).toLocaleDateString()}</span>
                ${post.tags.length > 0 ? `<span>🏷️ ${post.tags.join(', ')}</span>` : ''}
                <button id="editCurrentPost" class="btn btn-secondary" style="margin-left: auto;">Edit</button>
            </div>
            <div class="post-content">${html}</div>
        `;

        document.getElementById('editCurrentPost').addEventListener('click', () => this.editPost(post));
        this.showViewMode();
    }

    updatePreview(markdown) {
        const html = DOMPurify.sanitize(marked.parse(markdown));
        this.elements.markdownPreview.innerHTML = html;
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.renderPostList();
    }

    filterByTag(tag) {
        this.selectedTag = this.selectedTag === tag ? null : tag;
        this.renderTags();
        this.renderPostList();
    }

    getFilteredPosts() {
        return this.posts.filter(post => {
            const matchesSearch = !this.searchQuery ||
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.content.toLowerCase().includes(this.searchQuery);

            const matchesTag = !this.selectedTag || post.tags.includes(this.selectedTag);

            return matchesSearch && matchesTag;
        });
    }

    getAllTags() {
        const tagSet = new Set();
        this.posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }

    renderTags() {
        const tags = this.getAllTags();
        this.elements.tagList.innerHTML = tags.map(tag => `
            <span class="tag ${this.selectedTag === tag ? 'active' : ''}" data-tag="${tag}">
                ${tag}
            </span>
        `).join('');

        this.elements.tagList.querySelectorAll('.tag').forEach(el => {
            el.addEventListener('click', () => this.filterByTag(el.dataset.tag));
        });
    }

    renderPostList() {
        const filtered = this.getFilteredPosts();

        if (filtered.length === 0) {
            this.elements.postList.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">No posts found</p>';
            return;
        }

        this.elements.postList.innerHTML = filtered.map(post => `
            <div class="post-item ${this.currentPost?.id === post.id ? 'active' : ''}" data-id="${post.id}">
                <div class="post-item-title">${post.title}</div>
                <div class="post-item-date">${new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
        `).join('');

        this.elements.postList.querySelectorAll('.post-item').forEach(el => {
            el.addEventListener('click', () => {
                const post = this.posts.find(p => p.id === parseInt(el.dataset.id));
                this.viewPost(post);
                this.renderPostList();
            });
        });
    }

    showViewMode() {
        this.elements.viewMode.classList.remove('hidden');
        this.elements.editMode.classList.add('hidden');
        this.elements.welcomeScreen.classList.add('hidden');
    }

    showEditMode() {
        this.elements.viewMode.classList.add('hidden');
        this.elements.editMode.classList.remove('hidden');
        this.elements.welcomeScreen.classList.add('hidden');
    }

    showWelcomeScreen() {
        this.elements.viewMode.classList.add('hidden');
        this.elements.editMode.classList.add('hidden');
        this.elements.welcomeScreen.classList.remove('hidden');
    }

    render() {
        this.renderTags();
        this.renderPostList();

        if (this.posts.length === 0) {
            this.showWelcomeScreen();
        }
    }
}

new MarkdownBlog();
