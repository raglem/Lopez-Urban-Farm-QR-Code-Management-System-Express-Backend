import bcrypt from 'bcrypt'
import readline from 'readline';

import configureScript from './config.js';
import User from '../models/user.models.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  });
}

async function registerUser() {
  try {
    console.log("Proceed to register new user...");

    let username
    let password

    while(true){
        username = await askQuestion("Enter your username: ")
        if(await User.findOne({ username })){
            console.log("Username already taken. Please select a new one\n")
            continue
        }

        password = await askQuestion("Enter your password: ")
        const secondPassword = await askQuestion("Verify your password: ")
        if(password === secondPassword){
            break
        }
        console.log("Passwords do not match. Please try again.\n")
    }


    const hashedPassword = await bcrypt.hash(password, 10)
    const user = User({
        username,
        password: hashedPassword,
        role: 'Owner'
    })
    await user.save()

    console.log()
    console.log(`New user with ${username} successfully created`)
    process.exit(0);
  } catch (err) {
    console.error("Something went wrong:", err)
  } finally {
    rl.close()
  }
}

await configureScript()
registerUser()
