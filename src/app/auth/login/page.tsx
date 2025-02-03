import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Fragment } from "react";
import Client from "./_components/client";
import getAuth from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Auth",
};

export default async function Login() {
  const auth = getAuth();

  if (!(await auth.verify())) {
    return redirect("/");
  }

  return (
    <Fragment>
      <CardHeader>
        <CardTitle className="text-3xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Client />
      </CardContent>
    </Fragment>
  );
}
