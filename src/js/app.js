import Button from './Button';
import Card from './Card';
import DragAndDrop from './DragAndDrop';
import State from './State';

const state = new State(localStorage);
const card = new Card();
const button = new Button(card);

const dragAndDrop = new DragAndDrop();
dragAndDrop.init();

card.bindToDom(document.querySelector('.container'));

button.init();

window.addEventListener('pagehide', () => {
  state.save(card.saveCurrentPosition());
});

const load = state.load();
card.loader(load);
