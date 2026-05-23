import { t, type Dictionary } from "intlayer";

const userNavContent = {
  key: "user-nav",
  content: {
    labels: {
      login: t({
        en: "Login",
        bg: "Влез",
      }),
      myBookings: t({
        en: "My Bookings",
        bg: "Моите резервации",
      }),
      settings: t({
        en: "Settings",
        bg: "Настройки",
      }),
      management: t({
        en: "Management",
        bg: "Управление",
      }),
      logout: t({
        en: "Logout",
        bg: "Излез",
      }),
      becomeOwner: t({
        en: "Become an owner",
        bg: "Станете собственик",
      }),
      manageSubscription: t({
        en: "Manage subscription",
        bg: "Управление на абонамент",
      }),
    },
  },
} satisfies Dictionary;

export default userNavContent;
