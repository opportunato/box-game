import { Howl } from 'howler';

import * as Sounds from '../../constants/Sounds';

import { isObject } from 'lodash';


const SOUNDS = {
  [Sounds.ROCK_CLICK]: '10.icebreak',
  [Sounds.ROCK_CRASH]: '11.box',
  [Sounds.BOX_CENTER_CLICK]: '20.synth-d',
  [Sounds.BOX_CORNER_CLICK]: '21.buttonz',
  [Sounds.LETTER_APPEAR]: '22.letter',
  [Sounds.FIRST_GLIPH_SEARCH]: '30.firstglyph',
  [Sounds.SECOND_GLIPH_SEARCH]: '31.secondglyph',
  [Sounds.THIRD_GLIPH_SEARCH]: '32.thirdglyph',
  [Sounds.GLIPH_APPEAR]: '33.foundglyph',
  [Sounds.BOX_OPEN]: '40.boxclang',
  [Sounds.SEEDS_FLY]: '41.seedsfly',
  [Sounds.SEED_CATCH]: '42.catchseed',
  [Sounds.SEED_PLANT]: '43.Seedy',
};

let playedMusic = [];

const play = (sound, loop=false) => {
  const howl = new Howl({
    urls: [require(`./sounds/${SOUNDS[sound]}.mp3`)],
    loop,
  });

  howl.play();

  if (loop) {
    playedMusic = playedMusic.concat(howl);
  }
};

const stopAll = () => {
  playedMusic.forEach(music => music.stop());
  playedMusic = [];
}

const playSound = (sound) => {
  play(sound);
};

const playMusic = (sound) => {
  stopAll();
  play(sound, { loop: true });
};

const stopMusic = () => {
  stopAll();
};

export default {
  playRockClick() {
    playSound(Sounds.ROCK_CLICK);
  },

  playRockCrash() {
    playSound(Sounds.ROCK_CRASH);
  },

  playBoxCenterClick() {
    playSound(Sounds.BOX_CENTER_CLICK);
  },

  playBoxCornerClick() {
    playSound(Sounds.BOX_CORNER_CLICK);
  },

  playLetterAppear() {
    playSound(Sounds.LETTER_APPEAR);
  },

  playFirstGliphSearch(index) {
    playMusic(Sounds.FIRST_GLIPH_SEARCH);
  },

  playSecondGliphSearch(index) {
    playMusic(Sounds.SECOND_GLIPH_SEARCH);
  },

  playThirdGliphSearch(index) {
    playMusic(Sounds.THIRD_GLIPH_SEARCH);
  },

  playGliphAppear() {
    playSound(Sounds.GLIPH_APPEAR);
  },

  playBoxOpen() {
    playSound(Sounds.BOX_OPEN);
  },

  playSeedsFly() {
    playMusic(Sounds.SEEDS_FLY);
  },

  playSeedCatch() {
    playSound(Sounds.SEED_CATCH);
  },

  playSeedPlant() {
    playSound(Sounds.SEED_PLANT);
  },

  stopMusic,
};
