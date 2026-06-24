import { redirect } from 'next/navigation'

export default async function DealPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  redirect(`/deals/${params.id}/deal-room`)
}
