
const searchInput = document.getElementById('search');
const autocompleteBox = document.getElementById('autocomplete');
const repoList = document.getElementById('repo-list');

let debounceTimeout = null;

function fetchRepositories() {
  const query = searchInput.value.trim();

  if (!query) {
    autocompleteBox.innerHTML = '';
    return;
  }

  fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`)
    .then(response => response.json())
    .then(data => {
      autocompleteBox.innerHTML = '';
      if (data.items) {
        data.items.forEach(repo => {
          const item = document.createElement('div');
          item.textContent = repo.name;
          item.addEventListener('click', () => {
            addRepoToList(repo);
            searchInput.value = '';
            autocompleteBox.innerHTML = '';
          });
          autocompleteBox.appendChild(item);
        });
      }
    })
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });
}

function debounceFetch() {
  clearTimeout(debounceTimeout);

  if (!searchInput.value.trim()) {
    autocompleteBox.innerHTML = '';
    return;
  }

  debounceTimeout = setTimeout(fetchRepositories, 400);
}

searchInput.addEventListener('input', debounceFetch);

function addRepoToList(repo) {
  const repoItem = document.createElement('div');
  repoItem.className = 'repo-item';
  repoItem.insertAdjacentHTML('afterbegin', `
    <p><strong>Name:</strong> ${repo.name}</p>
    <p><strong>Owner:</strong> ${repo.owner.login}</p>
    <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
    <button class="remove-btn">✖</button>
  `);

  const removeBtn = repoItem.querySelector('.remove-btn');
  const removeHandler = () => {
    removeBtn.removeEventListener('click', removeHandler);
    repoList.removeChild(repoItem);
  };
  removeBtn.addEventListener('click', removeHandler);

  repoList.appendChild(repoItem);
}

// Очистка автокомплита при клике вне поля ввода
window.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !autocompleteBox.contains(e.target)) {
    autocompleteBox.innerHTML = '';
  }
});
