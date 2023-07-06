import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function Run(): Promise<void> {
  try {
    const user = await client.user.create({
      data: {
        name: "Ricardino de Almeida Afonso",
        username: "ricardinoafonso",
        password: "1234567",
        email: "admin@rimpdv.com",
        endereco: "Rua Maior ricardo 12",
        status: true,
        features: [
          "superuser",
          "user",
          "user:add",
          "user:delete",
          "user:update",
          "user:activation",
          "product",
          "product:add",
          "product:delete",
          "product:update",
          "sales",
          "sales:add",
          "sales:delete",
          "sales:update",
          "employees:add",
          "employees:delete",
          "employees:update",
          "employees:activation",
        ],
      },
    });
    console.log(user, "[seed success]");
  } catch (error: any) {
    console.log(error);
  }
}

Run()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    client.$disconnect();
  });
