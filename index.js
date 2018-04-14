import reddit from './redditapi'

const sugar = require('sugar');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e => {
    const searchTerm = searchInput.value;
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    const searchLimit = document.getElementById('limit').value;

    if (searchTerm === '') {
        showMessage('Please add search term', 'alert-danger');
    }

    reddit.search(searchTerm, searchLimit, sortBy)
        .then(results => {
            let output = '<div class="card-columns">';
            results.forEach(post => {
                const image = post.preview ? post.preview.images[0].source.url : 'https://i2-prod.mirror.co.uk/incoming/article4648052.ece/ALTERNATES/s810/Reddit-logo.jpg'
                output += `
                    <div class="card">
                    <img class="card-img-top" src=${image}>
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(post.selftext)}</p>
                        <a href=${post.url} target="_blank" class="btn btn-primary">Read more</a>
                        <hr>
                        <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                        <span class="badge badge-dark">Score: ${post.score}</span>
                    </div>
                    </div>
                `;
            });
            output += '</div>';
            document.getElementById('results').innerHTML = output;
        });

    searchInput.value = '';

    e.preventDefault();
});

function showMessage(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');

    searchContainer.insertBefore(div, search);

    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

function truncateText(text, limit) {
    return sugar.String.truncateOnWord(text, 100);
}
