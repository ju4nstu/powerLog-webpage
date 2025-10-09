import { fastify } from 'fastify'
import formbody from '@fastify/formbody'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import pointOfView from '@fastify/view' // point of view plugin
import fastifyStatic from '@fastify/static'
import ejs from 'ejs' // ejs support
import path from 'path'
import { createProgram } from './programs.js'
/*import bodyParser from 'body-parser'*/
import bcrypt from 'bcrypt'
import { sql }from './app.js'
//import ejsLint from 'ejs-lint'

//ejsLint('../views/partials/side-bar', 'utf8')
const server = fastify()
const program = new createProgram()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

server.register(formbody)

// this add express
/*await server.register(import('@fastify/express'))
server.use(bodyParser.json()) // parse application/json
server.use(bodyParser.urlencoded({ extended: true })) // parse application/urlencoded
*/

// render /views ejs files
server.register(pointOfView, {
    engine: {
      ejs: ejs
    },
    root: path.join(__dirname, '../views')
})

// static files
server.register(fastifyStatic, {
    root: path.join(__dirname, '../public')
})


// initialize user status
export var logged_in_status = false

// user sign up
server.post('/signup', async (req, rep) => {
    try {
        // receber dados
        const { name, email, password } = req.body
        
        // verificar se o email ja esta logado
        const [rows] = await sql`
        SELECT email FROM users WHERE email = ${email};`
        //console.log("rows: ", rows.email)

        // don't think its working
        if (rows > 0) { //rows is undefined. how? || NOTE: i was writing [rows] 
            return rep.status(400).json({error: "this email already exists."})
        }

        // hash da senha
        const passwordHash = await bcrypt.hash(password, 10)

        // inserir na db
        const insert = await sql`
        INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${passwordHash});`
        console.log("user created")

        // set default settings
        const [id] = await sql`
        select id from users where email = ${email};`
        
        if (insert) {
            await sql`
            insert into user_settings (
            user_id, theme, unit, auto_detect_pr, share_workout)
            values (${id.id}, 'light', 'kg', true, true);`
        }
        console.log("default settings assigned.")
                                                                
        // set user status
        const [data] = await sql`
        select * from users where email = ${email};`
        logged_in_status = {
            status: true,
            id: data.id,
            username: data.name,
            email: data.email
        }

        //rep.send({message: "insert completed", user: {id: id.id, username: data.name, email: data.email}})
        console.log("status:", logged_in_status)
        //rep.json("user signed up succefully!")
    } catch (err) {
        console.log(err)
        rep.statusCode = 500
        //rep.json({error: "server error"})
    }
    
    // todo: sent user back to main page
    return rep.viewAsync('index.ejs', { logged_in_status })
})

// user log in
server.post('/login', async(req, rep) => {
    try {
        // read data
        const { email, password } = req.body
        
        // compare password and email
        const [matchEmail] = await sql`
        select * from users where email = ${email};`
        
        const user = matchEmail // como posso atribuir as propiedades de senha a const user

        const matchPassword = bcrypt.compareSync(password, user.password)
        
        if (!matchPassword || !user) {
            rep.send("password or email is wrong.")
            console.log("password or email is wrong.")
        }

        // set user status
        logged_in_status = {
            status: true,
            id: user.id,
            username: user.name,
            email: user.email
        } 

        console.log("user logged in. data:", user)
    } catch (err) {
        console.log(err)
        /*rep.statusCode = 500
        rep.json({error: "server error"})*/
    }
    return rep.viewAsync('index.ejs', { logged_in_status })
})

server.get('/', (_req, rep) => {
  // todo: show main page
  rep.view('index.ejs', { logged_in_status }) // render template
})

server.get('/settings', (_req, rep) => {
    rep.view('settings.ejs', { logged_in_status })
})

server.get('/programs', (_req, rep) => {
    // todo: show programs page
    rep.view('programs.ejs', { logged_in_status })
})

server.get('/programs/create', (req, rep) => {
    rep.view('create-program.ejs', { logged_in_status })
})

server.get('/programs/create/customize', (_req, rep) => {
    rep.view('customize-program.ejs', { logged_in_status })
})

server.post('/programs/create', async (req, rep) => {
    // todo: insert program into database
    try {
        const { name, length, description } = req.body
        console.log( "req.body: ", name, length, description )
        //console.log(req.body)
        
        // todo: pass logged_in_status to this function
        
        const id = logged_in_status.id
        console.log("id: ", id)

        const insert = await sql`
        insert into programs(name, length, description, user_id) values 
        (${name}, ${length}, ${description}, ${id});`

        if (insert) {
            return rep.redirect("/programs/create/customize")
        }
    } catch (err) {
        rep.send(err)
    }
})




// request body for program creation
/*
server.post('/programs/create', (req, rep) => {
    const { name, description, length } = request.body

    program.create({
        name,
        description,
        length,
    })

    return reply.status(201).send()
})
*/

server.listen({
    port: 5001,
})
console.log("port: 5001")