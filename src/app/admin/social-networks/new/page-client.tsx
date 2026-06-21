import { SocialNetworksFormClient } from "../social-networks-form-client"

const emptyForm = { url: "", icon: "", positions: [] as string[] }

export const SocialNetworksNewPageClient = () => {
  return <SocialNetworksFormClient mode="create" initialForm={emptyForm} />
}
