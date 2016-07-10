import {createAction} from 'redux-actions';
import AudioPlayer from 'models/AudioPlayer';

export const playlist = createAction('PLAYER_PLAYLIST', (item) => item);

export const initSuccess = createAction('PLAYER_INIT');

export const loadStart = createAction('PLAYER_LOAD_FETCHING');
export const loadSuccess = createAction('PLAYER_LOAD', (file) => file);
export const loadError = createAction('PLAYER_LOAD_ERROR');
export const seekStart = createAction('PLAYER_SEEK', (pos) => pos);
export const seekEnd = createAction('PLAYER_SEEK_END');
export const playSuccess = createAction('PLAYER_PLAY');
export const pauseSuccess = createAction('PLAYER_PAUSE');
export const nextSuccess = createAction('PLAYER_NEXT', (player) => player);
export const prevSuccess = createAction('PLAYER_PREV', (player) => player);
export const progress = createAction('PLAYER_PROGRESS', (value) => value);
export const volumeSuccess = createAction('PLAYER_VOLUME', (value) => value);
export const end = createAction('PLAYER_END');

export function init() {
  return (dispatch) => {
    dispatch(initSuccess({
      volume: AudioPlayer.getVolume()
    }));
  };
}

export function load(audio) {
  return (dispatch) => {
    AudioPlayer.loadFromUrl(audio.url);
    dispatch(loadSuccess(audio))
  };
}

export function play() {
  return (dispatch) => {
    AudioPlayer.play();
    dispatch(playSuccess());
  };
}

export function volume(value) {
  return (dispatch) => {
    AudioPlayer.volume(value);
    dispatch(volumeSuccess(value));
  };
}

export function pause() {
  return (dispatch) => {
    AudioPlayer.pause();
    dispatch(pauseSuccess());
  };
}

export function next() {
  return (dispatch) => {
    dispatch(nextSuccess());
    dispatch(play());
  };
}

export function prev() {
  return (dispatch) => {
    dispatch(prevSuccess());
    dispatch(play());
  };
}