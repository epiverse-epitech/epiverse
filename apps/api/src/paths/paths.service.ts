import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Role given by the student path. Seeded in the fixtures, but created here
// when missing so that a fresh database works too.
const STUDENT_ROLE = 'student';

@Injectable()
export class PathsService {
  constructor(private readonly prisma: PrismaService) {}

  // The student path needs no approval (Soumia's workflow): the account gets
  // the Student role and an empty student profile at once. Choosing it again
  // changes nothing, and an existing profile is kept as it is.
  // Returns the role names of the account, sorted.
  async chooseStudentPath(userId: number): Promise<string[]> {
    const roles = await this.prisma.$transaction(async (tx) => {
      const role = await tx.role.upsert({
        where: { name: STUDENT_ROLE },
        create: { name: STUDENT_ROLE, description: 'Étudiant' },
        update: {},
        select: { id: true },
      });
      await tx.user_role.upsert({
        where: { user_id_role_id: { user_id: userId, role_id: role.id } },
        create: { user_id: userId, role_id: role.id },
        update: {},
      });
      await tx.student_profile.upsert({
        where: { user_id: userId },
        create: { user_id: userId },
        update: {},
      });
      return tx.user_role.findMany({
        where: { user_id: userId },
        select: { role: { select: { name: true } } },
      });
    });
    return roles.map((r) => r.role.name).sort();
  }
}
