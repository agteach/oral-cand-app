import { redirect, } from "next/navigation";
import PatientForm from "@/components/PateientsForm";

export default function Home() {

  redirect('/login')
  return (
    <div className="p-10">
      <PatientForm />
    </div>
  );
}
