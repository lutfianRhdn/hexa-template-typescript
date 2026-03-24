import { TUserGetResponse, TUser } from '../../core/entities/user/user';

export class UserResponseMapper {
  toResponse(user: TUser): TUserGetResponse {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  toListResponse(users: TUser[] | TUser): TUserGetResponse[] | TUserGetResponse {
    if (Array.isArray(users)) return users.map(user => this.toResponse(user));
    return this.toResponse(users);
  }
}
