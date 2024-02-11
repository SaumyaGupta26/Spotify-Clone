
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10? 0 : ''}${remainingSeconds}`;
}

async function getSongs(folder){
    let a = await fetch("http://192.168.29.18:5500/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            let trackUrlParts = element.href.split("/songs/");
            let trackName = trackUrlParts[trackUrlParts.length - 1];
            songs.push(trackName);
        }
    }
    return songs;
}

const playMusic = (track, pause=false) =>{
    //let audio = new Audio("/songs/" + track);
    
    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();
        play.src = "svgImg/pause.svg";
    }
    const decodedTrack = decodeURIComponent(track);
    document.querySelector(".songinfo").innerHTML = decodedTrack;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    

    //list of all songs
    songs = await getSongs();
    //console.log(songs);
    playMusic(songs[0], true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img src="music.svg" class="invert" alt="">
        <div class="info">
            <div>${song.toString().replaceAll("http://", " ").replaceAll("192.168.29.18:5500,", " ").replaceAll("http://127.0.0.1:5500,", " ").replaceAll("%20", " ")} </div>
            <div>Saumya</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="play_musicbar.png" class="playBtn">
        </div></li>`;
    }
    
    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    //attaching an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "svgImg/pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "svgImg/play.svg";
        }
    })

    
    //listen for timeUpdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime)/(currentSong.duration)*100 + "%";
    })
    //Add an event listener tp seekbar to make it move
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let per = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        currentSong.currentTime = ((currentSong.duration)* per)/100;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    //add an event listener for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    //add an event listener to previous and next
    previous.addEventListener("click", ()=>{
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click", ()=>{
        currentSong.pause();
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100;
    })
    
}
main();
