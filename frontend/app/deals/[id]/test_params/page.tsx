"use client"
import { useParams } from "next/navigation";
import { useEffect } from "react";
export default function TestParams() {
  const params = useParams();
  useEffect(() => console.log("TestParams ID:", params.id), [params]);
  return <div>TestParams: {params.id}</div>;
}
