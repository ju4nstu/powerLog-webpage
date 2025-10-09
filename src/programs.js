import { randomUUID } from 'node:crypto'

// todo: create a program-creation script that adds to the database the programs name, length and description
// todo: add a relation to the id of the user that created the program and the program itself 

// class create-program: 
export class createProgram {
  #programs = new Map()

  create(program) {
    const programId = randomUUID()
    const programName = document.getElementById('program-name').value
    const programDesc = document.getElementById('program-description').value
    const programLength = document.getElementById('program-duration').value
    this.#programs.set(programId, program)
  }

  delete(id) {
    this.#programs.delete(id)
  }

}