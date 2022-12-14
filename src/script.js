// 1
const { PrismaClient } = require("@prisma/client")

// 2
const prisma = new PrismaClient()

// 3
// Define an async function called main to SEND queries to the database.
// You will write all your queries inside this function.
async function main() {
  const newLink = await prisma.link.create({
    data: {
        description: 'Fullstack tutorial for GraphQL',
        url: 'www.howtographql.com',
    },
  })
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

// 4
main()
  .catch(e => {
    throw e
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect()
  })