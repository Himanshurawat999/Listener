let trackName;
let currentSong_api = new Audio();
let apiPlaylist = document.querySelector(".apiPlaylist");
let localPlaylist = document.querySelector(".localPlaylist");
let songsList = new Array();
let previewUrlList = new Array();
let previewUrlListIndex;
let apiSearchResult = document.querySelector(".apiSearchResult");
let searchInput = document.querySelector(".searchInput");
let header = document.querySelector(".header");
let idForPlaylist = new Array();
let songNameList = new Array();
let homeIcon = document.querySelector(".homePage");
let searchIcon = document.querySelector(".searchPage");
let trendIcon = document.querySelector(".trend");
let playbar = document.querySelector(".playbar");
let spotifyPlaylists = document.querySelector(".spotifyPlaylists");
let trElements = document.querySelectorAll(".sidebarTableBody tr");
let sidebar = document.querySelector(".sidebar");
let topArtContainer = document.querySelector(".topArtContainer");
let library = document.querySelector(".heading");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  update,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeJ3NX4DDi17tDgkS9MCKnQrNiNn6SPAI",
  authDomain: "spotify-e24b7.firebaseapp.com",
  databaseURL: "https://spotify-e24b7-default-rtdb.firebaseio.com",
  projectId: "spotify-e24b7",
  storageBucket: "spotify-e24b7.appspot.com",
  messagingSenderId: "19564928193",
  appId: "1:19564928193:web:362dabb5e133eec0174840",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let userCreds = JSON.parse(sessionStorage.getItem("user-creds"));
console.log(userCreds);
console.log(userCreds.uid);
let userInfo = JSON.parse(sessionStorage.getItem("user-info"));
console.log(userInfo);

const userUid = userCreds.uid; // Assuming userCreds contains the user's authentication credentials
const userTrackRef = ref(db, `UsersAuthList/${userUid}/trackData`);

// Add click event listener to each <tr> element
trElements.forEach(function (tr) {
  tr.addEventListener("click", function () {
    // Get the data-src attribute value of the clicked <tr> element
    var audioSrc = tr.getAttribute("data-src");

    // Create a new audio element
    var audioPlayer = new Audio(audioSrc);

    // Pause the previously playing audio (if any)
    if (currentAudio) {
      currentAudio.pause();
    }

    // Set the current audio to the new audio element
    currentAudio = audioPlayer;

    // Play the audio
    audioPlayer.play();
  });
});

searchIcon.addEventListener("click", function () {
  searchInput.value = "";
  searchInput.focus();
});

homeIcon.addEventListener("click", function () {
  localPlaylist.classList.remove("hide");
  apiSearchResult.classList.add("hide");
  apiPlaylist.classList.add("hide");
  spotifyPlaylists.classList.remove("grid");
  playbar.classList.remove("hide");
  sidebar.classList.add("hide");

  searchInput.value = "";
});

trendIcon.addEventListener("click", function () {
  localPlaylist.classList.add("hide");
  apiSearchResult.classList.add("hide");
  apiPlaylist.classList.add("hide");
  playbar.classList.add("hide");
  sidebar.classList.remove("hide");

  searchInput.value = "";
  apiSearchResult.style.maxHeight = "73vh";

  tranding();
});

function millisecondsToMinutesAndSeconds(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const playMusic_api = (track, pause = false) => {
  if (currentSong.hasAttribute("src")) {
    currentSong.setAttribute("src", "");
    currentSong.removeAttribute("src");
    console.log("src attribute removed");
    currentSong.pause();
  }

  console.log(track);
  if (!pause) {
    currentSong_api.src = track;
    currentSong_api.play();
    play.src = "img/pause.svg";
  }

  // When the song ends, play it again in the loop
  currentSong_api.addEventListener("ended", () => {
    currentSong_api.currentTime = 0;
    currentSong_api.play();
    play.src = "img/pause.svg";
  });

  console.log(previewUrlListIndex - 1);
  console.log(songsList);
  if (songsList != 0) {
    document.querySelector(".songinfo").innerHTML =
      songsList[previewUrlListIndex - 1];
    console.log("fuck");
  }
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

console.log(cardContainer);

const displayAlbums_api = (result) => {
  localPlaylist.classList.add("hide");
  spotifyPlaylists.classList.toggle("grid");
  apiSearchResult.classList.remove("hide");

  apiSearchResult.innerHTML = "";
  apiSearchResult.style.margin = "30px 0 0 0";

  result.items.forEach((playlist) => {
    // Construct HTML for the current playlist
    const playlistHtml = `
    <div class="card">
      <div class="play">
        <svg
          width="28"
          height="28"
          viewBox="0 0 20 24"
          fill="black"
          stroke="#141B34"
          stroke-width="1.5"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
        <path d="M5 20V4L19 12L5 20Z" />
        </svg>
      </div>
      <img
        src=${playlist.images[0].url}
        alt="img1"
      />
      <h2>${playlist.name}</h2>
   </div>`;

    // Append HTML for the current playlist to the apiSearchResult
    apiSearchResult.innerHTML += playlistHtml;
  });

  // Getting id for playList_api on clicking on cards
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e);
    e.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      console.log(item);
      console.log(item.currentTarget);
      const songName = item.currentTarget.querySelector("h2").textContent;
      console.log(songName);
      songNameList.some((name) => {
        if (name === songName) {
          console.log(songName);
          // console.log(indexOf(name));
          const getId = songNameList.findIndex((n) => n === songName);
          playlists_api(idForPlaylist[getId]);
        }
      });
    });
  });
};

async function main_api() {
  const playButtons = document.getElementById("play");
  // Attach an event listner to play, next and previous
  console.log(playButtons);

  playButtons.addEventListener("click", () => {
    if (currentSong_api.paused) {
      currentSong_api.play();
      play.src = "img/pause.svg";
    } else {
      currentSong_api.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong_api.addEventListener("timeupdate", () => {
    // console.log(currentSong_api.currentTime, currentSong_api.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong_api.currentTime
    )} / ${secondsToMinutesSeconds(currentSong_api.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong_api.currentTime / currentSong_api.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong_api.currentTime = (currentSong_api.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  hamburger.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close button
  close.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listener to previous
  const previousButtons = document.getElementById("previous");
  previousButtons.addEventListener("click", () => {
    handlePreviousButtonClick(
      --previewUrlListIndex,
      previewUrlList,
      playMusic_api
    );
  });

  // Add an event listener to next
  const nextButtons = document.getElementById("next");
  // console.log("next clicked");

  nextButtons.addEventListener("click", () => {
    handleNextButtonClick(++previewUrlListIndex, previewUrlList, playMusic_api);
  });

  // Add an event to volume
  volume(currentSong_api);

  // Add event listener to mute the track
  mute(currentSong_api);
}

main_api();
let trys;
async function playlists_api(id) {
  apiSearchResult.classList.add("hide");
  sidebar.classList.add("hide");
  apiPlaylist.classList.remove("hide");
  playbar.classList.remove("hide");
  spotifyPlaylists.classList.remove("grid");
  //Shubh
  fetch(
    `https://v1.nocodeapi.com/subeg/spotify/npOnMvjuZbMMkyzX/playlists?id=${id}`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result.tracks.items);
      apiPlaylist.innerHTML = `
      
        <div class="list-heading">
          <img src=${result.images[0].url}>
          <div class="singer-info">
            <p>${result.type}</p>
            <h1>${result.name}</h1>
            <p>${result.description}</p>
            <ul>
            <li>${result.owner.display_name}</li>
            <li>${result.followers.total} likes</li>
            <li>${result.tracks.total} songs</li>
            </ul>
          </div>
      </div>
      <div class="song-list">
      <table>
            <thead>
              <tr class="songlistHtr">
                <th>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Artist</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody class="songlistBody">
              ${result.tracks.items
                .map(
                  (track, index) => `
                <tr class="songlistBtr">
                  <td>${index + 1}</td>
                  
                  <td>
                    <img src="${
                      track.track.album.images[2].url
                    }" alt="Album Image" style="width: 50px; height: 50px; margin-right: 10px;">
                  
                    <span class="track-name" data-preview="${
                      track.track.preview_url
                    }">${track.track.name}</span>
                  </td>
                  
                  <td>${track.track.series ? track.track.series : ""} ${
                    track.track.album ? track.track.album.name : ""
                  }
                  </td>

                  <td>${track.track.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                  </td>

                  <td>${millisecondsToMinutesAndSeconds(
                    track.track.duration_ms
                  )}
                  </td>

                  <td class="add"><img class="invert" src="../img/add.svg" alt="add" style="padding:10px"/></td>
                  <td class="tick hide"><img class="invert" src="../img/tick.svg" alt="tick" style="padding:10px"/></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
      </div>
      `;

      // Add event listener to all elements with class 'track-name'
      songsList = [];
      previewUrlList = [];
      document.querySelectorAll(".track-name").forEach((item) => {
        songsList.push(item.textContent);
        previewUrlList.push(item.dataset.preview);
        item.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default link behavior
          console.log(event.target);
          const previewUrl = event.target.dataset.preview;
          previewUrlListIndex = previewUrlList.indexOf(previewUrl) + 1;
          trackName = event.target.innerText;
          if (previewUrl) {
            playMusic_api(previewUrl); // Call the playAudio function
          }
        });
      });

      // Define an empty object to store track names and data previews
      let trackData = {};

      let add = document.querySelectorAll(".add");
      let tick = document.querySelectorAll(".tick");
      add.forEach((addBtn, index) => {
        addBtn.addEventListener("click", (e) => {
          console.log(e);
          console.log("hello");

          // Extract track name and data preview from corresponding elements
          let trackName =
            addBtn.parentNode.querySelector(".track-name").textContent;
          let dataPreview =
            addBtn.parentNode.querySelector(".track-name").dataset.preview;

          // Store track name and data preview in the trackData object
          trackData[trackName] = dataPreview;

          // Hide "add" button and show "tick" button
          addBtn.classList.add("hide");
          tick[index].classList.remove("hide"); // Use index to access corresponding tick button

          // Optionally, log the trackData object to see the stored track names and data previews
          console.log(trackData);

          // Storing data in Track
          if (userUid) {
            update(userTrackRef, trackData)
              .then(() => {
                console.log("Track data stored successfully!");
              })
              .catch((error) => {
                console.error("Error storing track data: ", error);
              });
          } else {
            console.error("User is not authenticated.");
          }

          // Retriving data in Track
          if (userUid) {
            get(userTrackRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const trackData = Object.entries(snapshot.val());
                  trys = [...trackData];
                  console.log("Track data:", trackData);
                  console.log("Track data:", trackData[0][0]);
                  console.log("Track data:", trackData[0][1]);
                  // Process the retrieved track data as needed
                } else {
                  console.log("No track data found for the user.");
                }
              })
              .catch((error) => {
                console.error("Error retrieving track data: ", error);
              });
          } else {
            console.error("User is not authenticated.");
          }
        });
      });
    });
}

library.addEventListener("click", function () {
  // console.log("Hello");
  // songUL.innerHTML = "";
  // for (const song of songs) {
  //   songUL.innerHTML =
  //     songUL.innerHTML +
  //     `<li>
  //       <img class="invert" src="img/music.svg" alt="music" />
  //       <div class="info">
  //         <div>${trackData[0][0]}</div>
  //       </div>
  //       <div class="playnow">
  //         <span>Play Now</span>
  //         <img class="invert" src="img/play.svg" alt="play" />
  //       </div>
  //     </li>`;
  // }

  // Array.from(
  //   document.querySelector(".songList").getElementsByTagName("li")
  // ).forEach((e) => {
  //   e.addEventListener("click", (element) => {
  //     trackData[0][1].play();
  //   });
  //   // console.log(e.querySelector(".info").firstElementChild.innerHTML);
  // });
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  if (userUid) {
    const userTrackRef = ref(db, `UsersAuthList/${userUid}/trackData`);
    get(userTrackRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const trackData = snapshot.val();
          console.log("Track data:", trackData);

          // Iterate over each trackData entry and render the songs
          for (const [trackName, trackPreviewUrl] of Object.entries(
            trackData
          )) {
            songUL.innerHTML += `
                <li> 
                  <img class="invert" src="img/music.svg" alt="music" />
                  <div class="info">
                    <div>${trackName}</div> <!-- Track name -->
                  </div>
                  <div class="playnow" data-preview="${trackPreviewUrl}">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="play" />
                  </div>  
                </li>`;
          }

          // Attach event listeners to song list items
          Array.from(
            document.querySelector(".songList").getElementsByTagName("li")
          ).forEach((e) => {
            e.addEventListener("click", () => {
              const trackName = e.querySelector(".info div").textContent;
              const trackPreviewUrl =
                e.querySelector(".playnow").dataset.preview;
              // Play the audio associated with the selected song (trackPreviewUrl)
              // You can implement the audio playback logic here
              console.log("Playing:", trackPreviewUrl);
              document.querySelector(".songinfo").innerHTML = trackName;
              playMusic_api(trackPreviewUrl);
            });
          });
        } else {
          console.log("No track data found for the user.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving track data: ", error);
      });
  } else {
    console.error("User is not authenticated.");
  }
});

// playlists_api();

async function search(singer) {
  idForPlaylist = [];
  songNameList = [];
  apiPlaylist.classList.add("hide");
  fetch(
    `https://v1.nocodeapi.com/subeg/spotify/npOnMvjuZbMMkyzX/search?q=${singer}&type=playlist`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result.playlists);
      displayAlbums_api(result.playlists);

      result.playlists.items.forEach((item) => {
        idForPlaylist.push(item.id);
        songNameList.push(item.name);
      });

      console.log(idForPlaylist);
      console.log(songNameList);
    });
}

searchInput.addEventListener("keypress", function (event) {
  // console.log(event.key);
  if (event.key === "Enter") {
    // Execute your code here when Enter is pressed
    console.log("Enter key pressed");
    header.style.background =
      "linear-gradient(43deg, #4158d0 0%, #c850c0 46%, #ffcc70 100%)";
    console.log(searchInput.value);
    // For example, you can call a function to handle the search
    search(searchInput.value);
  }
});

async function tranding() {
  idForPlaylist = [];
  songNameList = [];
  fetch(
    `https://v1.nocodeapi.com/subeg/spotify/npOnMvjuZbMMkyzX/browse/featured`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      displayAlbums_api(result.playlists);

      result.playlists.items.forEach((item) => {
        idForPlaylist.push(item.id);
        songNameList.push(item.name);
      });

      console.log(idForPlaylist);
      console.log(songNameList);
    });
}

topArtContainer.addEventListener("click", (e) => {
  console.log(e);
  console.log(e.target.id);
  playlists_api(e.target.id);
});

// let songlistTr = document.querySelector(".songlistTr")
function checkWidth() {
  var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  // If viewport width is <= 500px, remove the class
  if (viewportWidth <= 500) {
    spotifyPlaylists.classList.remove("grid");
  }
  // else {
  //   // If viewport width is > 500px and the class is not present, add it back
  //   if (!document.getElementById("myElement").classList.contains("myClass")) {
  //     document.getElementById("myElement").classList.add("myClass");
  //   }
  // }
}

// Call the function on page load
checkWidth();

// Listen for window resize events and call the function
window.addEventListener("load", checkWidth);
// window.addEventListener("resize", checkWidth);

// Add an event listener for hamburger
hamburger.addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
  searchInput.classList.add("hide");
});

// Add an event listener for close button
close.addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
  searchInput.classList.remove("hide");
});
