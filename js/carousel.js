const container = document.querySelector('#projects .container');
const errorMessage = 'Could not load Projects. Try Refreshing...';

(async function () { attachRepos(await fetchPinnedRepos()); })();

async function fetchPinnedRepos() {
    const url = 'https://api.github.com/graphql';
    const encrypted = '779714f4e58d2d750662gg3f90e5f0b09f666452';
    const token = decrypt(encrypted);
    const query = `{
        user(login: "syall") {
            pinnedItems(first: 6, types: [REPOSITORY]) {
                edges {
                    node {
                        ... on Repository {
                            name
                            primaryLanguage {
                                name
                            }
                            description
                            url
                            homepageUrl
                        }
                    }
                }
            }
        }
    }`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({ query })
        });
        const repos = JSON.parse(await res.text())
            .data.user.pinnedItems.edges.map(wrapper => {
                const repo = wrapper.node;
                repo.language = repo.primaryLanguage.name;
                delete repo.primaryLanguage;
                return repo;
            });
        return repos;
    } catch (error) {
        console.log(error);
        container.innerHTML = errorMessage;
        throw error;
    }

    function decrypt(encrypted) {
        const split = encrypted.split('');
        const decryptedCharCodes = split.map(c => c.match(/[a-z]/)
            ? c.charCodeAt(0) - 1
            : c.charCodeAt(0));
        const decrypted = String.fromCharCode(...decryptedCharCodes);
        return decrypted;
    }

}

function attachRepos(repos) {
    container.innerHTML = '';
    const carousel = createCarousel();
    container.appendChild(createArrow(`«<br>«<br>«<br>«`));
    container.appendChild(carousel);
    for (const repo of repos) {
        carousel.appendChild(createCard(repo));
    }
    container.appendChild(createArrow(`»<br>»<br>»<br>»`));

    function createCarousel() {
        const div = document.createElement('div');
        div.className = 'carousel';
        return div;
    }

    function createCard(repo) {

        // Card
        const card = document.createElement('div');
        card.className = 'card';

        // Name
        const name = repo.name;
        const nameH2 = document.createElement('h2');
        nameH2.className = 'name';
        nameH2.innerHTML = name;
        card.appendChild(nameH2);

        // Language
        const language = repo.language;
        const languageP = document.createElement('p');
        languageP.className = 'language';
        languageP.innerHTML = language;
        card.appendChild(languageP);

        // Description
        const description = repo.description;
        const descriptionP = document.createElement('p');
        descriptionP.className = 'description';
        descriptionP.innerHTML = description;
        card.appendChild(descriptionP);

        // Link Div
        const linksDiv = document.createElement('div');
        linksDiv.className = 'links';
        card.appendChild(linksDiv);

        // GitHub Link
        const github = repo.url;
        const githubA = document.createElement('a');
        githubA.className = 'link';
        githubA.innerHTML = 'GitHub Link';
        githubA.setAttribute('href', github);
        githubA.setAttribute('target', '_blank');
        githubA.setAttribute('rel', 'noreferrer');
        linksDiv.appendChild(githubA);

        // Hosted Link
        const hostedA = document.createElement('a');
        hostedA.className = 'link';
        hostedA.setAttribute('target', '_blank');
        hostedA.setAttribute('rel', 'noreferrer');
        linksDiv.appendChild(hostedA);
        if (repo.homepageUrl) {
            const hosted = repo.homepageUrl;
            hostedA.innerHTML = 'Hosted Link';
            hostedA.setAttribute('href', hosted);
        } else {
            hostedA.innerHTML = 'No Hosted Link';
            hostedA.classList.add('dead');
        }

        // Return Card
        return card;
    }

    function createArrow(text) {
        const div = document.createElement('div');
        div.className = 'arrows';
        div.innerHTML = text;
        return div;
    }

}
