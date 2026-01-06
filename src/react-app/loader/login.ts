import { redirect } from "react-router";
import { isAuthenticated } from "../services/auth.service";

export async function loginLoader() {
  if (isAuthenticated()) {
    throw redirect("/admin/dashboard");
  }
  return null;
}
