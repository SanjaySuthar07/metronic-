import { redirect } from "next/navigation";
// import '@/css/styles.css';

export default function Home() {
  const isAuth = false
  if (!isAuth) {
    redirect("signup")
  } else {
    redirect("changePassword")
  }
}
