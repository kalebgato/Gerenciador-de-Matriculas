export type EntityId = string;

export type ApiSuccessMessage = {
  message: string;
};

export type ApiErrorResponse = {
  statusCode: number;
  statusMessage: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthMeResponse = {
  authenticated: boolean;
  authEnabled: boolean;
  user: AuthUser;
};

export type Course = {
  id: EntityId;
  title: string;
  active: boolean;
};

export type CourseCreateInput = {
  title: string;
  active?: boolean;
};

export type CourseUpdateInput = Partial<CourseCreateInput>;

export type Student = {
  id: EntityId;
  name: string;
  cpf: string;
  email?: string | null;
  dn?: string | null;
  phone?: string | null;
  responsable_name?: string | null;
  responsable_phone?: string | null;
  active: boolean;
};

export type StudentCreateInput = {
  name: string;
  cpf: string;
  email?: string;
  dn?: string;
  phone?: string;
  responsable_name?: string;
  responsable_phone?: string;
  active?: boolean;
};

export type StudentUpdateInput = Partial<StudentCreateInput>;

export type Team = {
  id: EntityId;
  course_id: EntityId;
  title: string;
  team_leader_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  horary?: string | null;
  days_of_week?: string | null;
  active: boolean;
  payment_date?: string | null;
  price: number;
};

export type TeamCreateInput = {
  course_id: EntityId;
  title: string;
  team_leader_id?: string;
  start_date?: string;
  end_date?: string;
  horary?: string;
  days_of_week?: string;
  active?: boolean;
  payment_date?: string;
  price: number;
};

export type TeamUpdateInput = Partial<Omit<TeamCreateInput, "course_id">>;

export type CourseWithTeams = Course & {
  teams: Team[];
};

export type TeamWithCourse = Team & {
  course?: Course;
};

export type Enrollment = {
  id: EntityId;
  student_id: EntityId;
  team_id: EntityId;
};

export type EnrollmentCreateInput = {
  student_id: EntityId;
  team_id: EntityId;
};

export type EnrollmentWithRelations = Enrollment & {
  student: Student;
  team: Team;
};

export type EnrollmentWithTeam = Enrollment & {
  team: Team;
};

export type ChargeStatus = "PENDING" | "PAID" | "OVERDUE";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "BOLETO" | "PIX";

export type Payment = {
  id: EntityId;
  enrollment_id: EntityId;
  charge_id: EntityId;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
};

export type Charge = {
  id: EntityId;
  enrollment_id: EntityId;
  year: number;
  month: number;
  amount: number;
  due_date: string;
  paid: boolean;
  status: ChargeStatus;
  payments?: Payment[];
};

export type LateCharge = Charge & {
  enrollment: Enrollment & {
    student: Student;
    team: Team;
  };
};

export type BillingGenerateInput = {
  action: "generate";
  enrollmentId: EntityId;
  year: number;
  amount: number;
};

export type BillingPayInput = {
  action: "pay";
  charge_id: EntityId;
  amount: number;
  method: PaymentMethod;
};

export type BillingActionInput = BillingGenerateInput | BillingPayInput;
