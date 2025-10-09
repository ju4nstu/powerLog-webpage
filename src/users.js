/*await server.register(import('@fastify/express'))
server.use(bodyParser.json()) // parse application/json
server.use(bodyParser.urlencoded({ extended: true })) // parse application/urlencoded
*/

// sign up
// add event listener to submit
document.getElementById("signup-form").addEventListener('submit', async(e) => {
    e.preventDefault()

    //const { name, email, password } = req.body
    const name = getElementById('name').value
    const email = getElementById('emailSign').value
    const password = getElementById('passwordSign').value

    const res = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({username: name, email: email, password: password}),
    })
    const data = await res.json()
    alert(data.message)
})

// login
document.getElementById("login-form").addEventListener('submit', async(e) => {
    e.preventDefault()

    const email = getElementById('email').value
    const password = getElementById('password').value
    
    const rep = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
        }, 
        body: new URLSearchParams({email: email, password: password}),
    })
    const data = await rep.json()
    alert(data.message)
})