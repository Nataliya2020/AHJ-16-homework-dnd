export default class DragAndDrop {
  constructor() {
    this.itemsEl = document.querySelector('.container-cards');
    this.draggedEl = null;
    this.ghostEl = null;
    this.draggedElX = null;
    this.draggedElY = null;
    this.newDragEl = null;
    this.container = null;
    this.underDragEl = null;
    this.removeCard = this.removeCard.bind(this);
    this.takeCard = this.takeCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.releaseCard = this.releaseCard.bind(this);
    this.leaveDesk = this.leaveDesk.bind(this);
  }

  init() {
    this.container = document.querySelector('.container');
    this.container.addEventListener('mousedown', this.takeCard);
    this.container.addEventListener('mousemove', this.moveCard);
    this.container.addEventListener('mouseup', this.releaseCard);
    this.container.addEventListener('mouseleave', this.leaveDesk);
  }

  removeCard(event) {
    this.event = event.target;
    this.event.closest('.card-item').remove();
  }

  takeCard(event) {
    if (!event.target.closest('.card-item')) {
      return;
    } if (event.target.classList.contains('button-item-card-remove')) {
      this.removeCard(event);
      return;
    }

    event.preventDefault();

    this.draggedEl = event.target.closest('.card-item');

    this.ghostEl = this.draggedEl.cloneNode(true);

    this.draggedElX = event.clientX - this.draggedEl.getBoundingClientRect().left;
    this.draggedElY = event.clientY - this.draggedEl.getBoundingClientRect().top;

    this.ghostEl.style.width = `${this.draggedElX.offsetWidth}px`;
    this.ghostEl.classList.add('card-item-dragged');

    document.querySelector('.container').appendChild(this.ghostEl);

    this.ghostEl.style.left = `${event.pageX - this.draggedElX}px`;
    this.ghostEl.style.top = `${event.pageY - this.draggedElY}px`;
    this.draggedEl.style.opacity = 0;

    this.newDragEl = document.createElement('li');
    this.newDragEl.classList.add('new-drag');
    this.newDragEl.style.height = `${this.draggedEl.offsetHeight}px`;
  }

  moveCard(event) {
    if (!this.draggedEl) {
      return;
    }

    this.ghostEl.classList.add('none');
    this.underDragEl = document.elementFromPoint(event.clientX, event.clientY);
    this.ghostEl.classList.remove('none');

    this.ghostEl.style.left = `${event.pageX - this.draggedElX}px`;
    this.ghostEl.style.top = `${event.pageY - this.draggedElY}px`;

    if (this.underDragEl.closest('.column')) {
      const containerCards = this.underDragEl.closest('.column').querySelector('.container-cards');

      if (!containerCards.hasChildNodes()) {
        containerCards.append(this.newDragEl);
      } else if (this.underDragEl.closest('.add-card')) {
        containerCards.append(this.newDragEl);
      } else if (this.underDragEl.closest('.title')) {
        containerCards.prepend(this.newDragEl);
      } else if (this.underDragEl.closest('.card-item')) {
        containerCards.insertBefore(this.newDragEl, this.underDragEl.closest('.card-item'));
      }
    }
  }

  releaseCard(event) {
    event.preventDefault();
    if (!this.draggedEl) {
      return;
    }

    if (!this.underDragEl.closest('.column')) {
      document.querySelector('.container').removeChild(this.ghostEl);
      document.querySelector('.new-drag').remove();
      this.draggedEl.style.opacity = 1;
      this.ghostEl = null;
      this.draggedEl = null;
      return;
    }

    const containerCards = this.underDragEl.closest('.column').querySelector('.container-cards');

    if (this.underDragEl.closest('.title')) {
      containerCards.prepend(this.ghostEl);
    } else if (this.underDragEl.closest('.add-card')) {
      containerCards.append(this.ghostEl);
    } else {
      containerCards.insertBefore(this.ghostEl, this.underDragEl.closest('.card-item'));
    }

    if (document.querySelector('.new-drag')) {
      document.querySelector('.new-drag').remove();
    }

    this.ghostEl.classList.remove('card-item-dragged');
    this.ghostEl.style = '100%';
    this.draggedEl.remove();
    this.draggedEl = null;
    this.ghostEl = null;
  }

  leaveDesk() {
    if (!this.draggedEl) {
      return;
    }

    document.querySelector('.container').removeChild(this.ghostEl);
    document.querySelector('.new-drag').remove();
    this.draggedEl.style.opacity = 1;
    this.ghostEl = null;
    this.draggedEl = null;
  }
}
