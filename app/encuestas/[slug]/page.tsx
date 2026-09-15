import type { Metadata } from "next";
import { SurveyPage } from "@/components/surveys/SurveyPage";
import { googleConfigured } from "@/lib/server/google";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Encuesta de producto", robots: { index: false, follow: true } };
export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const notice = (await searchParams).correo;
  return <SurveyPage slug={(await params).slug} googleEnabled={googleConfigured()} notice={typeof notice === "string" ? notice : undefined}/>;
}
