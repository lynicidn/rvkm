import React, {Component} from 'react';
import block from 'bem-cn';
import './index.styl';

import Track from 'components/Track';
import Spinner from 'components/Spinner';
import Error from 'components/Error';
import PaginationMore from 'components/PaginationMore';
import PlayButton from 'components/PlayButton';

import User from 'models/User';
import Audio from 'models/Audio';

import {connect} from 'react-redux';
import {loadAndPlay, play, pause, playlist as loadPlaylist} from 'actions/player';

const mapStateToProps = (state) => ({
  user: new User(state.user),
  player: state.player
});

const b = block('playlist');

class Playlist extends Component {

  rowRender = (audio, i) => {
    const {player} = this.props;
    const isCurrent = player.audio.id === audio.getId();
    const isPlaying = player.playing;
    const duration = audio.getDuration();

    return (
      <div className={b('item', {current: isCurrent})} key={i}>
        <div className={b('controls')}>
          <PlayButton className={b('play')} onClick={() => this.onTrackClick(audio)} playing={isCurrent && isPlaying} size="xs"/>
        </div>
        <Track className={b('track')} size="m" id={audio.getId()} url={audio.getUrl()} duration={duration} artist={audio.getArtist()} song={audio.getSong()}/>
      </div>
    )
  };

  onTrackClick = (audio) => {
    const {loadAndPlay, play, pause, loadPlaylist, audios, player} = this.props;

    if (player.playlist.id !== audios.id) {
      loadPlaylist(audios);
    }

    if (player.audio.id !== audio.id) {
      loadAndPlay(audio);
    } else {
      if (player.playing) {
        pause();
      } else {
        play();
      }
    }
  };

  render() {
    const {audios, onMore} = this.props;
    let pagination = null;

    if (!audios) {
      return (
        <section className={b}>
          <div className={b('loading')}><Error title="Nothing selected" desc="Please, select some items in list"/></div>
        </section>
      );
    }

    if (audios.error && audios.error.error_msg) {
      return (
        <section className={b}>
          <div className={b('loading')}><Error title="An error has occurred" desc={audios.error.error_msg}/></div>
        </section>
      );
    }

    if (audios.fetching) {
      return (
        <section className={b}>
          <div className={b('loading')}><Spinner size="lg" type="primary"/></div>
        </section>
      );
    }

    if (audios.items) {
      if (audios.items.length === 0) {
        return (
          <section className={b}>
            <div className={b('loading')}><Error title="List is empty"/></div>
          </section>
        );
      }

      if (audios.items.length < audios.count) {
        pagination = (<PaginationMore onLoad={onMore}/>);
      }
    }

    return (
      <section className={b}>
        {Audio.hydrateArray(audios.items || []).map(this.rowRender)}
        {pagination}
      </section>
    );
  }
}

export default connect(
  mapStateToProps,
  {loadAndPlay, play, pause, loadPlaylist}
)(Playlist);
