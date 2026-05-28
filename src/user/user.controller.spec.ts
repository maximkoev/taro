import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: Pick<UserService, 'create'>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
    };
    controller = new UserController(service as UserService);
  });

  it('forwards the user payload to the service', async () => {
    const payload = { name: 'mira', password: 'secret1' };
    const response = 'User mira created';
    (service.create as jest.Mock).mockResolvedValue(response);

    await expect(controller.createUser(payload)).resolves.toBe(response);

    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create).toHaveBeenCalledWith(payload);
  });
});
