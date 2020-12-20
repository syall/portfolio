(async () => {
    // Copyright Year
    document.querySelector('.year').textContent = new Date().getFullYear();

    // Projects
    try {
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `bearer ${decrypt('779714f4e58d2d750662gg3f90e5f0b09f666452')}`
            },
            body: JSON.stringify({
                query: `{
                user(login: "syall") {
                    pinnedItems(first: 6, types: [REPOSITORY]) {
                        edges {
                            node {
                                ... on Repository {
                                    name
                                    languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
                                        nodes {
                                            name
                                        }
                                    }
                                    description
                                    url
                                    homepageUrl
                                }
                            }
                        }
                    }
                }
            }` })
        });
        const repos = JSON.parse(await res.text())
            .data
            .user
            .pinnedItems
            .edges.map(({ node }) => {
                node.languages = node
                    .languages
                    .nodes.map(({ name }) => name);
                return node;
            });
        const articles = document.querySelectorAll('#projects .project');
        for (let i = 0; i < 6; i++) {
            articles[i].children[0].innerText = repos[i].name;
            articles[i].children[1].innerText = repos[i].languages.join(', ');
            articles[i].children[2].innerText = repos[i].description;
            articles[i].children[3].setAttribute('href', repos[i].url);
            if (repos[i].homepageUrl) {
                const hosted = document.createElement('a');
                hosted.classList.add('link');
                hosted.innerText = 'Hosted Link';
                hosted.setAttribute('href', repos[i].homepageUrl);
                hosted.setAttribute('target', '_blank');
                hosted.setAttribute('rel', 'noreferrer');
                articles[i].appendChild(hosted);
            }
            articles[i].classList.remove('hidden');
        }
    } catch (error) {
        document.querySelectorAll('#projects .project').forEach(e => e.remove());
        const errorNode = document.createElement('p');
        errorNode.classList.add('.error');
        errorNode.innerHTML = 'Projects could not be loaded...';
        document.querySelector('#projects').appendChild(errorNode);
        console.error(error);
    } finally {
        document.querySelector('#projects .loading').remove();
    }

    function decrypt(encrypted) {
        const split = encrypted.split('');
        const decryptedCharCodes = split.map(c => c.match(/[a-z]/)
            ? c.charCodeAt(0) - 1
            : c.charCodeAt(0));
        const decrypted = String.fromCharCode(...decryptedCharCodes);
        return decrypted;
    }

})();
