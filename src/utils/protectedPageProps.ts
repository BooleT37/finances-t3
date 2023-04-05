import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const protectedPageProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: ctx.req.url
          ? `/api/auth/signin?callbackUrl=${ctx.req.url}`
          : "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
