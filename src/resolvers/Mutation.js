const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)

  // 2
  //use your PrismaClient instance (via prisma as we covered
  //in the steps about context) to store the new User record in the database.
  const user = await context.prisma.user.create({ data: { ...args, 
password } })

  // 3
  //Generating a JSON Web Token which is signed with an APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4
  //return the token and the user in an object that adheres to the shape
  //of an AuthPayload object from your GraphQL schema.
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user.findUnique({ where: { email: 
args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 3
  return {
    token,
    user,
  }
}

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
}

module.exports = {
  signup,
  login,
  post,
}
