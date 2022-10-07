import { Auth } from './auth.js';
import { MusicBox } from './musicBox.js';

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const init = async (player) => {
  const musicBox = new MusicBox(player);
  await musicBox.connect();
  musicBox.addEvents();
};

ready(async () => {
  if (window.location.pathname === '/' && !window.location.hash) {
    if (Auth.validate()) {
      MusicBox.addElement(init);
    } else {
      await Auth.getToken();
    }
  } else if (window.location.hash) {
    Auth.store();
  } else {
    await Auth.getToken();
  }
});
