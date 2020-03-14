const newsForm = document.querySelector('#newsForm')
newsForm.addEventListener('submit', getNews)

async function getNews(event) {    
    event.preventDefault()
    clearPreviousResults()
        
    const response = await fetch(getUrlQuery(event.target),getOptions()).then((response) => response.json())
    showResults(response)
}

function clearPreviousResults() {
    let resultsDiv = document.querySelectorAll('#newsResults div')
    if (resultsDiv.length !== 0) {
        resultsDiv.forEach(x => x.remove())
    }
}

function getUrlQuery(form) {
    let searchTerm = form[0].value
    let maxResults = form[1].value > 0 ? form[1].value : 20
    const searchParams = new URLSearchParams()
    searchParams.set('q', searchTerm)
    searchParams.set('pageSize', maxResults)
    searchParams.set('sortBy', 'publishedAt')
    searchParams.set('language', 'en')
    const url = new URL(`https://newsapi.org/v2/everything`)
    url.search = searchParams.toString()

    return url
}

function getOptions() {
    const options = {
        headers: new Headers({
            "X-Api-Key": "dd95698fd3844da4ba9ed506bb12ba0f" // is there a way not to reveal this?
        })
    }

    return options
}

function showResults(response) {
    response['articles'].forEach(article => {
        // filter out author==facebook, because obvs
        if (article.author !== null && article.author.includes('facebook')) {
            return
        } else {            
            let result = document.createElement('div')
            result.classList.add('my-5', 'p-3', 'border')
            
            result.appendChild(getDateline(article))
            result.appendChild(getTitle(article))
            result.appendChild(getByline(article))
            result.appendChild(getSummary(article))
            result.appendChild(getImage(article))
            
            document.querySelector('#newsResults').appendChild(result)
        }
    })
}

function getDateline(article) {
    let dateline = document.createElement('p')
    let pubDate = new Date(article.publishedAt)
    dateline.innerText = `${pubDate.toDateString()} at ${pubDate.toLocaleTimeString()}`
    dateline.classList.add('mb-1', 'text-black-50', 'small')
    return dateline
}

function getTitle(article) {
    let title = document.createElement('a')
    title.innerText = article.title
    title.setAttribute('href', article.url)
    title.classList.add('h4')
    return title
}

function getByline(article) {
    let byline = document.createElement('p')
    byline.innerText = `${article.author} for ${article.source.name}`
    byline.classList.add('font-italic')
    return byline
}

function getSummary(article) {
    let summary = document.createElement('p')
    summary.innerHTML = article.description
    return summary
}

function getImage(article) {
    let image = document.createElement('img')
    image.setAttribute('src', article.urlToImage)
    image.classList.add('img-fluid')
    return image
}
