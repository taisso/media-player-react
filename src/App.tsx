import { useState } from "react";
import ReactPlayer from "react-player";
import data from "./data.json";

import "./app.css";

type DataType = {
  imageUrl: string;
  musicUrl: string;
  singer: string;
  music: string;
};

function App() {
  const [progressTime, setProgressTime] = useState(0);
  const [songs, setSongs] = useState<DataType>(data[0]);
  const [count, setCount] = useState(0);

  const config = {
    url: songs.musicUrl,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.8,
    played: 0,
    loaded: 0,
    duration: 0,
  };

  const [mediaPlayer, setMediaPlayer] = useState(config);

  function handleClickPlayer() {
    const playing = !mediaPlayer.playing;
    setMediaPlayer({ ...mediaPlayer, playing });
  }

  function handleDuration(duration: number) {
    setMediaPlayer({ ...mediaPlayer, duration });
  }

  function handleProgress(progress: any) {
    const played = (progress.playedSeconds * 100) / mediaPlayer.duration;
    setMediaPlayer({ ...mediaPlayer, played });
    setProgressTime(progress.played);
  }

  function format(seconds: number) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  function pad(string: any) {
    return ("0" + string).slice(-2);
  }

  function handleNext() {
    const qt = count + 1;
    setCount(qt);

    let isExist: any;
    if (data.length <= qt) {
      isExist = data[0];
      setCount(0);
    } else {
      isExist = data[qt];
    }
    setSongs(isExist);
    setMediaPlayer({ ...mediaPlayer, url: isExist.musicUrl });
    console.log("Next", qt);
  }

  function handlePrev() {
    const qt = count - 1;
    setCount(qt);
    let isExist: any;

    if (qt < 0) {
      isExist = data[data.length - 1];
      setCount(data.length - 1);
    } else {
      isExist = data[qt];
    }

    setSongs(isExist);
    setMediaPlayer({ ...mediaPlayer, url: isExist.musicUrl });
    console.log("Prev", qt);
  }

  return (
    <>
      <main className="player">
        <img src={songs.imageUrl} alt="album art" className="art" />
        <div className="info">
          <h1>{songs.singer}</h1>
          <p>{songs.music}</p>
        </div>
        <div className="prog">
          <div className="prog-time">
            <p className="left">
              {format(progressTime * mediaPlayer.duration)}
            </p>
            <p className="right">
              {format(mediaPlayer.duration * (1 - progressTime))}
            </p>
          </div>
          <div className="prog-bar">
            <div
              className="prog-bar-inner"
              style={{ width: `${mediaPlayer.played}%` }}
            ></div>
          </div>
        </div>
        <ul className="buttons">
          <button className="button button-md" onClick={handlePrev}>
            <i className="fas fa-step-backward" aria-hidden="true"></i>
            <span className="sr-only">Previous Music</span>
          </button>
          <button onClick={handleClickPlayer} className="button button-lg">
            {mediaPlayer.playing ? (
              <i className="fas fa-pause fa-lg" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-play fa-lg" aria-hidden="true"></i>
            )}
            <span className="sr-only">Pause</span>
          </button>
          <button className="button button-md" onClick={handleNext}>
            <i className="fas fa-step-forward"></i>
            <span className="sr-only">Next Music</span>
          </button>
        </ul>
        <div className="bar"></div>
      </main>
      <ReactPlayer
        className="react-player"
        onDuration={handleDuration}
        onProgress={handleProgress}
        onReady={() => console.log("Ready")}
        {...mediaPlayer}
      />
    </>
  );
}

export default App;
