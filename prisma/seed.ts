import "dotenv/config";
import { PrismaClient } from "../server/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const student1 = await prisma.student.create({
    data: {
      name: "Kaleb Gato",
      cpf: "123.456.789-00",
      email: "kaleb@example.com",
      dn: new Date("2006-01-01"),
      phone: "99999-0000",
      responsable_name: "Responsavel Kaleb",
      responsable_phone: "99999-9999",
      active: true,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Maria Silva",
      cpf: "987.654.321-00",
      email: "maria@example.com",
      dn: new Date("2008-03-20"),
      phone: "98888-1111",
      responsable_name: "Responsavel Maria",
      responsable_phone: "98888-8888",
      active: true,
    },
  });

  const course1 = await prisma.course.create({
    data: {
      title: "Curso de Matematica",
      active: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Curso de Ingles",
      active: true,
    },
  });

  const team1 = await prisma.team.create({
    data: {
      title: "Turma A - Matematica",
      course_id: course1.id,
      team_leader_id: "leader-1",
      start_date: new Date("2026-02-01"),
      end_date: new Date("2026-12-20"),
      horary: "18:00-20:00",
      days_of_week: "Segunda,Quarta",
      active: true,
      payment_date: new Date("2026-02-10"),
      price: 500,
    },
  });

  const team3 = await prisma.team.create({
    data: {
      title: "Turma A - Ingles",
      course_id: course2.id,
      team_leader_id: "leader-3",
      start_date: new Date("2026-02-01"),
      end_date: new Date("2026-12-20"),
      horary: "18:00-20:00",
      days_of_week: "Segunda,Quarta",
      active: true,
      payment_date: new Date("2026-02-10"),
      price: 700,
    },
  });

  const enrollment1 = await prisma.enrollment.create({
    data: {
      student_id: student1.id,
      team_id: team1.id,
    },
  });

  const enrollment2 = await prisma.enrollment.create({
    data: {
      student_id: student2.id,
      team_id: team3.id,
    },
  });

  const charge1 = await prisma.charge.create({
    data: {
      enrollment_id: enrollment1.id,
      year: 2026,
      month: 3,
      amount: 500,
      due_date: new Date("2026-03-31"),
      status: "PENDING",
      paid: false,
    },
  });

  const charge2 = await prisma.charge.create({
    data: {
      enrollment_id: enrollment2.id,
      year: 2026,
      month: 3,
      amount: 700,
      due_date: new Date("2026-03-31"),
      status: "PENDING",
      paid: false,
    },
  });

  await prisma.payment.create({
    data: {
      enrollment_id: enrollment1.id,
      charge_id: charge1.id,
      amount: 500,
      method: "PIX",
      payment_date: new Date(),
    },
  });

  await prisma.payment.create({
    data: {
      enrollment_id: enrollment2.id,
      charge_id: charge2.id,
      amount: 350,
      method: "CREDIT_CARD",
      payment_date: new Date(),
    },
  });

  console.log("Seed finalizado com sucesso!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
