export function filterByUser(ctx: { session: { user: { id: string } } }) {
  return {
    where: { userId: ctx.session.user.id },
  };
}

export function connectUser(ctx: { session: { user: { id: string } } }) {
  return {
    user: {
      connect: {
        id: ctx.session.user.id,
      },
    },
  };
}
