import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/apis/join/entities/join.entity';
import { ROLES_KEY } from './gql-role.param';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const gqlContext =
      GqlExecutionContext.create(context).getContext().req.user;

    return (
      gqlContext && gqlContext.role && requiredRoles.includes(gqlContext.role)
    );
  }
}
