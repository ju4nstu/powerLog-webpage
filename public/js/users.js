// sign up
// add event listener to submit
document.getElementById("signup-form").addEventListener('submit', async(e) => {
    e.preventDefault()

    //const { name, email, password } = req.body
    const name = document.getElementById('name').value
    const email = document.getElementById('emailSign').value
    const password = document.getElementById('passwordSign').value

    const res = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({username: name, email: email, password: password}),
    })
    const data = await res.json()
    alert(data.message)
    window.location.reload()
})

// login
document.getElementById("login-form").addEventListener('submit', async(e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    const rep = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
        }, 
        body: new URLSearchParams({email: email, password: password}),
    })
    
    window.location.reload()
    /*const data = rep.code(200)
    alert(data)*/
})

// exercises
form_exercises = document.getElementById('add-exercise-form')
form_exercises.addEventListener('submit', async(e) => {
    e.preventDefault()
    
    var selectElements = document.getElementsByName('muscles-worked[]')
    var selectedMuscles = Array.from(selectElements[0].selectedOptions).map(option => option.value)
    console.log(selectedMuscles)    
    
    const name = document.getElementById('exercise-name').value
    const type = document.getElementById('exercise-type').value

    fetch('/exercises/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({name: name, type: type, muscle_group: selectedMuscles}),
    })  
     .then(data => {console.log(data)})
     .catch(error => {console.log(error)})
})

form_exercises_delete = document.getElementById('delete-exercise-form')
form_exercises_delete.addEventListener('submit', async(e) => {
    e.preventDefault()

    var selectedElements = document.getElementsByName('exercise-to-delete[]')
    var selectedExercises = Array.from(selectedElements[0].selectedOptions).map(option => option.value)
    
    fetch('/exercises/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({exercise_to_delete_name: selectedExercises})
    })
     .then(data => {console.log(data)})
     .catch(error => {console.log(error)})
})