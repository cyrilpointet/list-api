import { AppDataSource } from "../data-source";
import { User } from "../user/model/User";

export const invitationHelper = {
  async populateInvitationWithUser(rawInvitations) {
    const userRepository = AppDataSource.getRepository(User);

    const invitations = [];
    for (let i = 0; i < rawInvitations.length; i++) {
      const user = await userRepository.findOne({
        where: {
          email: rawInvitations[i].email,
        },
      });
      if (user) {
        invitations.push({
          ...rawInvitations[i],
          user,
        });
      }
    }
    return invitations;
  },
};
