export default class Button {
  constructor(card) {
    this.button = document.querySelectorAll('.add-card');
    this.card = card;
  }

  init() {
    for (const card of [...this.button]) {
      card.addEventListener('click', (event) => this.card.showCard(event));
    }
  }
}
