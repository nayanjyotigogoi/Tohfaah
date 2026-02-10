import { redirect } from "next/navigation";

export default function OldGiftRedirect({ params }: any) {
  redirect(`/premium-gifts/valentine/${params.id}`);
}
