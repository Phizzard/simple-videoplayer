let mediaId = 1630723954;
const videosPromises = [fetchVideo(1630723954),
  fetchVideo(2667647842),
  fetchVideo(1402726504)
];

Promise.all(videosPromises)
  .then(videosResult => {
    renderVideoList(videosResult);

  }).catch(err => console.error(err));

const url = new URL(window.location.href);
mediaId = url.searchParams.get("mediaId") ? url.searchParams.get("mediaId") : mediaId;

fetchVideo(mediaId).then(video => {
  const [, simpleUrlLoader] = video.assetDescriptors;
  const {
    title,
    description
  } = video;
  console.log(video)
  renderVideo(simpleUrlLoader.key, title, description);
}).catch(err => console.error(err));

/**
 * 
 * @param {Array} videos 
 */
function renderVideoList(videos) {
  const videoListElement = document.querySelector(".videoList");

  videoListElement.removeChild(document.querySelector(".videoList li"));

  videos.forEach(video => {
    const videoElement = document.createElement("li");

    videoElement.onclick = (e) => {
      renderVideo(video.assetDescriptors[1].key, video.title, video.description);
    };
    videoElement.className = "videoItem";
    videoElement.innerHTML = `
      <img class="videoItemImage" src="${video.thumbnail}" alt="${video.title}" />
      <h4 class="videoItemTitle">${video.title}</h4>
    `;
    videoListElement.appendChild(videoElement);
  })
}

/**
 * 
 * @param {String} src 
 * @param {String} title 
 */
function renderVideo(src, title, description = "") {
  const videoElement = document.querySelector("#videoPlayer");
  const videoTitleElement = document.querySelector("#videoPlayerContainer .videoTitle");
  const videoDescriptionElement = document.querySelector("#videoPlayerContainer .videoDescription");

  videoTitleElement.innerHTML = title;
  videoDescriptionElement.innerHTML = description;
  videoElement.src = src;
}

/**
 * 
 * @param {Number} id 
 */
function fetchVideo(id) {
  return fetch(`https://www.cbc.ca/bistro/order?mediaId=${id}`)
    .then(response => response.json())
    .then(({
      items
    }) => {
      const [video] = items;

      return video;
    })
    .catch(err => console.error(err));
}