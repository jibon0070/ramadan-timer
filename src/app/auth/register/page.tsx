import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getAuth from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import Client from "./_components/client";

export const metadata: Metadata = {
  title: `Register | Auth`,
};

export default async function Register() {
  const auth = getAuth();

  if (!(await auth.verify())) {
    return redirect("/");
  }

  return (
    <Fragment>
      <CardHeader>
        <CardTitle className="text-3xl text-center">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Client />
      </CardContent>
    </Fragment>
  );
}
