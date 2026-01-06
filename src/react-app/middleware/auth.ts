import { redirect } from "react-router";
import { isAuthenticated } from "../services/auth.service";

export async function authMiddleware() {
  if (!isAuthenticated()) {
    throw redirect("/admin/login");
  }

  return null;
}
