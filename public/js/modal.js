// get modal element
const modal = document.getElementById('login-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');

const Smodal = document.getElementById('sign-up-modal');
const SopenModalBtn = document.querySelector('#login-modal .submit-btn:last-of-type');
const ScloseModalBtn = document.querySelector('.close-modal-sign-btn');

// open modal
openModalBtn.onclick = function() {
  modal.style.display = 'block';
}

// sign up
SopenModalBtn.onclick = function() {
  modal.style.display = 'none';
  Smodal.style.display = 'block';
}

// close modal
closeModalBtn.onclick = function() {
  modal.style.display = 'none';
}

// sign up
ScloseModalBtn.onclick = function() {
  Smodal.style.display = 'none';
}

// close modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}