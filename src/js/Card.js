import Tooltip from './Tooltip';

export default class Card {
  constructor() {
    this.containerCard = null;
    this.textCard = null;
    this.cardButton = null;
    this.cardButtonReset = null;
    this.card = null;
    this.buttonItemCardRemove = null;
    this.containerCard = null;
    this.containerCards = document.querySelectorAll('.container-cards');
    this.container = null;

    this.showCard = this.showCard.bind(this);
    this.createCard = this.createCard.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removecontainerCard = this.removecontainerCard.bind(this);
    this.saveCurrentPosition = this.saveCurrentPosition.bind(this);
    this.loader = this.loader.bind(this);
  }

  bindToDom(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
  }

  showCard(event) {
    const textCard = document.createElement('textarea');
    textCard.classList.add('card');

    textCard.placeholder = 'Enter a title for this card...';

    const cardButton = document.createElement('button');
    cardButton.classList.add('button-card');
    cardButton.innerHTML = 'Add Card';

    const cardButtonReset = document.createElement('button');
    cardButtonReset.classList.add('button-reset-card');
    cardButtonReset.classList.add('button');
    cardButtonReset.innerHTML = '×';

    const containerCard = document.createElement('div');

    event.target.closest('.container-button').appendChild(cardButton);
    event.target.closest('.container-button').appendChild(cardButtonReset);

    containerCard.append(textCard);

    event.target.closest('.column').querySelector('.container-cards-enter').appendChild(containerCard);

    const displayButton = event.target;
    displayButton.style.display = 'none';

    cardButton.addEventListener('click', (event) => this.addCard(event, textCard));

    cardButtonReset.addEventListener('click', this.removecontainerCard);
  }

  createCard(text) {
    const card = document.createElement('li');
    this.spanText = card.querySelector('span');

    card.classList.add('card-item');

    card.insertAdjacentHTML('beforeend', `<span>${text}</span><button class="button-item-card-remove button">&#215</button>`);

    return card;
  }

  addCard(event, textCard) {
    if (!event.target.closest('.column').querySelector('.card').value) {
      const tooltip = new Tooltip('Введите текст');
      tooltip.createTooltip(event);

      event.target.closest('.column').querySelector('.card').addEventListener('input', () => {
        if (event.target.closest('.column').querySelector('.tooltip') && textCard.value) {
          event.target.closest('.column').querySelector('.tooltip').remove();
        }
      });
    } else {
      const card = this.createCard(event.target.closest('.column').querySelector('.card').value);

      textCard.remove();

      const removeButton = event.target.closest('.column').querySelector('.button-reset-card');
      removeButton.remove();

      const displayButton = event.target.closest('.column').querySelector('.add-card');
      displayButton.style.display = 'block';

      event.target.closest('.column').querySelector('.container-cards').appendChild(card);
      event.target.remove();
    }
  }

  removecontainerCard(event) {
    this.event = event.target;

    this.event.closest('.column').querySelector('.card').remove();
    this.event.closest('.column').querySelector('.button-card').remove();
    this.event.closest('.column').querySelector('.add-card').style.display = 'block';

    if (this.event.closest('.column').querySelector('.tooltip')) {
      this.event.closest('.column').querySelector('.tooltip').remove();
    }

    this.event.remove();
  }

  saveCurrentPosition() {
    const objSave = { todo: [], inprogress: [], done: [] };

    [...this.containerCards].forEach((item) => {
      item.querySelectorAll('.card-item span').forEach((el, i) => {
        objSave[item.getAttribute('data-containerCards-name')][i] = el.textContent;
      });
    });

    return objSave;
  }

  loader(load) {
    this.containerCards.forEach((e) => {
      e.innerHTML = '';
    });

    Object.entries(load).forEach(([key, value]) => {
      value.forEach((text) => {
        this.container.querySelector(`[data-containerCards-name = "${key}"]`).insertAdjacentElement('beforeend', this.createCard(text));
      });
    });
  }
}
