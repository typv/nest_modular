import { InjectRepository } from '@nestjs/typeorm';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Repository } from 'typeorm';
// import { Role } from '../../entities/role.entity';
import { commandConstants } from "../app/constants/command.constant";
import { Roles } from "../app/enums/common.enum";

@Command({
  name: commandConstants.createRoles,
  description: 'Create roles',
})
export class CreateRolesCommand extends CommandRunner {
  constructor(
    // @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      const roles = [
        {
          name: 'Admin',
          code: Roles.ADMIN,
          description: 'Admin.'
        },
        {
          name: 'Hotel',
          code: Roles.HOTEL,
          description: 'Hotel.'
        },
        {
          name: 'Customer',
          code: Roles.CUSTOMER,
          description: 'Customer.'
        }
      ];
      // await this.roleRepo.save(roles);
      console.log('\nCreate roles successfully.');
    } catch (err) {
      console.log('CreateRolesCommand Error: ', err);
    }
  }

  @Option({
    flags: '-s, --shell <shell>',
  })
  parseShell(val: string) {
    return val;
  }
}
