import "dotenv/config";
import { PrismaClient } from "../server/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    // ----------------------
    // 1️⃣ Criar alunos
    // ----------------------
    const student1 = await prisma.student.create({
        data: {
            name: "Kaleb Gato",
            cpf: "123.456.789-00",
            email: "kaleb@example.com",
            phone: "99999-0000",
        },
    });

    const student2 = await prisma.student.create({
        data: {
            name: "Maria Silva",
            cpf: "987.654.321-00",
            email: "maria@example.com",
            phone: "98888-1111",
        },
    });

    // ----------------------
    // 2️⃣ Criar cursos
    // ----------------------
    const course1 = await prisma.course.create({
        data: {
            name: "Curso de Matemática",
            description: "Curso completo de matemática básica e avançada",
            price: 500.0,
        },
    });

    const course2 = await prisma.course.create({
        data: {
            name: "Curso de Inglês",
            description: "Aprenda inglês do zero ao avançado",
            price: 700.0,
        },
    });

    // ----------------------
    // 3️⃣ Criar turmas (Team)
    // ----------------------
    const team1 = await prisma.team.create({
        data: {
            name: "Turma A - Matemática",
            schedule: "Segunda e Quarta, 18h-20h",
            course: { connect: { id: course1.id } },
        },
    });

    const team2 = await prisma.team.create({
        data: {
            name: "Turma B - Matemática",
            schedule: "Terça e Quinta, 19h-21h",
            course: { connect: { id: course1.id } },
        },
    });

    const team3 = await prisma.team.create({
        data: {
            name: "Turma A - Inglês",
            schedule: "Segunda e Quarta, 18h-20h",
            course: { connect: { id: course2.id } },
        },
    });

    // ----------------------
    // 4️⃣ Criar matrículas (Enrollment)
    // ----------------------
    const enrollment1 = await prisma.enrollment.create({
        data: {
            student: { connect: { id: student1.id } },
            team: { connect: { id: team1.id } },
            active: true,
        },
    });

    const enrollment2 = await prisma.enrollment.create({
        data: {
            student: { connect: { id: student2.id } },
            team: { connect: { id: team3.id } },
            active: true,
        },
    });

    // ----------------------
    // 5️⃣ Criar cobranças (Charge)
    // ----------------------
    const charge1 = await prisma.charge.create({
        data: {
            enrollment: { connect: { id: enrollment1.id } },
            year: 2026,
            month: 3,
            amount: course1.price,
            dueDate: new Date("2026-03-31"),
            status: "PENDING",
        },
    });

    const charge2 = await prisma.charge.create({
        data: {
            enrollment: { connect: { id: enrollment2.id } },
            year: 2026,
            month: 3,
            amount: course2.price,
            dueDate: new Date("2026-03-31"),
            status: "PENDING",
        },
    });

    // ----------------------
    // 6️⃣ Criar pagamentos (Payment)
    // ----------------------
    await prisma.payment.create({
        data: {
            charge: { connect: { id: charge1.id } },
            amount: course1.price,
            method: "PIX",
            paidAt: new Date(),
        },
    });

    await prisma.payment.create({
        data: {
            charge: { connect: { id: charge2.id } },
            amount: 350, // pagamento parcial
            method: "CREDIT_CARD",
            paidAt: new Date(),
        },
    });

    console.log("✅ Seed finalizado com sucesso!");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
