document.addEventListener('DOMContentLoaded', () => { //DOMContentLoaded -> ensures html has been fully loaded
  const toggleSwitch = document.getElementById('myToggle')

  toggleSwitch.addEventListener('change', () => {
    if (this.checked) {
      console.log('on')
    } else {
      console.log('off')
    }
  })
})