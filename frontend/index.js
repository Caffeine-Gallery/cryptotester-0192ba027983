import { backend } from 'declarations/backend';

let currentPostId = null;

async function loadPosts() {
    const posts = await backend.getPosts();
    const postList = document.getElementById('posts');
    postList.innerHTML = '';
    posts.forEach(post => {
        const li = document.createElement('li');
        li.textContent = post.title;
        li.addEventListener('click', () => showPost(post.id));
        postList.appendChild(li);
    });
}

async function showPost(id) {
    currentPostId = id;
    const post = await backend.getPost(id);
    if (post) {
        document.getElementById('post-detail-title').textContent = post.title;
        document.getElementById('post-detail-author').textContent = `By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}`;
        document.getElementById('post-detail-content').textContent = post.content;
        document.getElementById('post-list').style.display = 'none';
        document.getElementById('new-post').style.display = 'none';
        document.getElementById('post-detail').style.display = 'block';
        loadComments(id);
    }
}

async function loadComments(postId) {
    const comments = await backend.getComments(postId);
    const commentList = document.getElementById('comments');
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = `${comment.author}: ${comment.content}`;
        commentList.appendChild(li);
    });
}

document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const author = document.getElementById('post-author').value;
    const content = document.getElementById('post-content').value;
    await backend.createPost(title, content, author);
    loadPosts();
    e.target.reset();
});

document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value;
    const content = document.getElementById('comment-content').value;
    if (currentPostId !== null) {
        await backend.addComment(currentPostId, author, content);
        loadComments(currentPostId);
        e.target.reset();
    }
});

window.addEventListener('load', loadPosts);
