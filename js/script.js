console.log("lets write JS");
let currentSong = new Audio();
let songs;
let currFolder;
let cardContainer = document.querySelector(".cardContainer");
let hamburger = document.querySelector(".hamburger");
let close = document.querySelector(".close");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`${folder}`)[1].replace("/", ""));
      // songs.push(element.href.split(`${folder}`)[1]);
    }
    // console.log(element.href);
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
        <img class="invert" src="img/music.svg" alt="music" />
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Song Artist</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="play" />
        </div>  
      </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
    // console.log(e.querySelector(".info").firstElementChild.innerHTML);
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  // console.log(track);
  currentSong.src = `/${currFolder}/` + track;
  console.log(currFolder);
  console.log(currentSong);
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = `${track.replaceAll(
    "%20",
    " "
  )}`;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  // console.log("displaying albums");
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  // let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    // console.log(e);
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[1];
      // console.log(folder)
      // Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response)
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
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
        src="/songs/${folder}/cover.jpg"
        alt="img1"
      />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log("Fetching Songs");
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

function handlePreviousButtonClick(i, s, play) {
  // console.log("previous clicked");
  let index = i;
  if (index - 1 >= 0) {
    play(s[index - 1]);
  } else {
    play(s[index]);
  }
}

function handleNextButtonClick(i, s, play) {
  // console.log("previous clicked");
  let index = i;
  console.log(index);
  if (index + 1 < s.length) {
    play(s[index + 1]);
  } else {
    play(s[index]);
  }
}

function volume(cs) {
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log("Setting volume to ", e.target.value, "/ 100");
      cs.volume = parseInt(e.target.value) / 100;
      if (cs.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("img/mute.svg", "img/volume.svg");
      }
      if (cs.volume === 0) {
        if (cs.volume > 0) {
          document.querySelector(".volume>img").src = document
            .querySelector(".volume>img")
            .src.replace("img/volume.svg", "img/mute.svg");
        }
      }
    });
}

function mute(cs) {
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      cs.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
      cs.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

async function main() {
  // Get the list of all the songs

  // These are default songs
  // songs = await getSongs("songs/ncs");
  // playMusic(songs[0], true);

  // currentSong.src = `http://127.0.0.1:5500/songs/8asle.m4a`;

  // Display all the albums on the page
  await displayAlbums();

  // Attach an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    // console.log(currentSong.currentTime);
    // console.log(currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    handlePreviousButtonClick(
      songs.indexOf(currentSong.src.split("/").slice(-1)[0]),
      songs,
      playMusic
    );
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    handleNextButtonClick(
      songs.indexOf(currentSong.src.split("/").slice(-1)[0]),
      songs,
      playMusic
    );
  });

  // Add an event to volume
  volume(currentSong);

  // Add event listener to mute the track
  mute(currentSong);
}

main();
