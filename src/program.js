document.getElementById("crate-program-form").eventListener('submit', async(e) => {
  e.preventDefault()

  const name = document.getElementById("program-name").value
  const duration = document.getElementById("program-duration").value
  const description = document.getElementById("program-description").value

  const rep = await fetch('/programs/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({program_name: name, program_length: duration, program_description: description }),
  })

  await fetch('/programs/create/customize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({program_name: name}),
  })
  const data = await rep.json()
  console.log(data.message)
})

