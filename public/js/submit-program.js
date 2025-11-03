document.getElementById("submit-program-form").addEventListener("submit", async function(event) {
    event.preventDefault()

    const weeks = []
    document.querySelectorAll('.week').forEach(weekEl => {
        const weekNumber = parseInt(weekEl.dataset.week, 10)
        const workout = []
        weekEl.querySelectorAll('.workout').forEach(workoutEl => {
            const dayNumber = parseInt(workoutEl.dataset.day, 10)
            const exercises = []
            workoutEl.querySelectorAll('tr.custom').forEach(row => {
                const nameEl = row.querySelector('select[name="exercise[]"]')
                const setsEl = row.querySelector('input[name="sets[]"]')
                const repsEl = row.querySelector('input[name="reps[]"]')
                const methodEl = row.querySelector('select[name="method[]"]')
                const intensityEl = row.querySelector('input[name="intensity[]"]')

                if(!nameEl || !nameEl.value) return

                exercises.push({
                    name: nameEl.value,
                    sets: setsEl.value !== '' ? parseInt(setsEl.value, 10) : null,
                    reps: repsEl.value !== '' ? parseInt(repsEl.value, 10) : null,
                    method: methodEl.value,
                    intensity: intensityEl.value !== '' ? parseInt(intensityEl.value, 10) : null,
                })
            })
            workout.push({ day: dayNumber, exercises })
        })
        weeks.push({ week: weekNumber, workout })
    })
    const program = { weeks }

    const hidden = document.getElementById('program-json')
    hidden.value = JSON.stringify(program)
    console.log('program data:', hidden.value)
    this.submit()
})