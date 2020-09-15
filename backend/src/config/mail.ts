interface IMailConfig {
  driver: "ethereal" | "ses";

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || "ethereal",

  defaults: {
    from: {
      email: "moises1695@gmail.com",
      name: "Moisez Dantas",
    },
  },
} as IMailConfig;
